export type BillingCycle = 'monthly' | 'annual';

export interface CalculatedRate {
  amount: number;
  monthlyEquivalent: number;
}

const MAX_COMPARE_PLANS = 3;

export function calculateDisplayRate(
  monthlyRate: number,
  ageFactor: number,
  cycle: BillingCycle,
  annualDiscountPercent: number
): CalculatedRate {
  const safeMonthly = Number.isFinite(monthlyRate) && monthlyRate > 0 ? monthlyRate : 0;
  const safeFactor = Number.isFinite(ageFactor) && ageFactor > 0 ? ageFactor : 1;
  const clampedDiscount = Math.min(Math.max(annualDiscountPercent, 0), 50);

  const adjustedMonthly = Math.round(safeMonthly * safeFactor);

  if (cycle === 'annual') {
    const discountedMonthly = Math.round(adjustedMonthly * (1 - clampedDiscount / 100));
    return {
      amount: discountedMonthly * 12,
      monthlyEquivalent: discountedMonthly
    };
  }

  return {
    amount: adjustedMonthly,
    monthlyEquivalent: adjustedMonthly
  };
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const safeCurrency = currencyCode.trim() || 'IDR';
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${safeCurrency} ${amount.toLocaleString('en-US')}`;
  }
}

export function initPlanComparison(root: HTMLElement): void {
  // Guard against double listener attachment when MutationObserver fires alongside DOMContentLoaded
  if (root.dataset.cmpInitialized === 'true') {
    return;
  }
  root.dataset.cmpInitialized = 'true';

  const defaultCycle: BillingCycle =
    root.dataset.defaultCycle === 'annual' ? 'annual' : 'monthly';
  const parsedDiscount = Number.parseFloat(root.dataset.annualDiscount ?? '15');
  const annualDiscountPercent = Number.isFinite(parsedDiscount) ? parsedDiscount : 15;
  const currencyCode = root.dataset.currency || 'IDR';

  const filterBtns = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-cmp-hook-plan="filterBtn"]')
  );
  const cycleBtns = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-cmp-hook-plan="cycleBtn"]')
  );
  const ageSelect = root.querySelector<HTMLSelectElement>('[data-cmp-hook-plan="ageBand"]');
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>('[data-cmp-hook-plan="card"]')
  );
  const emptyFilterEl = root.querySelector<HTMLElement>('[data-cmp-hook-plan="emptyFilter"]');
  const compareTray = root.querySelector<HTMLElement>('[data-cmp-hook-plan="compareTray"]');
  const compareSummary = root.querySelector<HTMLElement>('[data-cmp-hook-plan="compareSummary"]');
  const clearCompareBtn = root.querySelector<HTMLButtonElement>(
    '[data-cmp-hook-plan="clearCompare"]'
  );
  const compareChecks = Array.from(
    root.querySelectorAll<HTMLInputElement>('[data-cmp-hook-plan="compareCheck"]')
  );

  let activeCategory = 'all';
  let activeCycle: BillingCycle = defaultCycle;
  let ageFactor = ageSelect ? Number.parseFloat(ageSelect.value) || 1 : 1;

  const renderPrices = (): void => {
    for (const card of cards) {
      const baseRate = Number.parseFloat(card.dataset.monthlyRate ?? '0');
      const priceEl = card.querySelector<HTMLElement>('[data-cmp-hook-plan="price"]');
      const periodEl = card.querySelector<HTMLElement>('[data-cmp-hook-plan="period"]');

      const { amount, monthlyEquivalent } = calculateDisplayRate(
        baseRate,
        ageFactor,
        activeCycle,
        annualDiscountPercent
      );

      if (priceEl) {
        priceEl.textContent = formatCurrency(amount, currencyCode);
      }
      if (periodEl) {
        periodEl.textContent =
          activeCycle === 'annual'
            ? `per year (eq. ${formatCurrency(monthlyEquivalent, currencyCode)}/mo)`
            : 'per month';
      }
    }
  };

  const renderFilter = (): void => {
    let visibleCount = 0;

    for (const card of cards) {
      const cardCategory = card.dataset.category ?? '';
      const isMatch = activeCategory === 'all' || cardCategory === activeCategory;
      card.hidden = !isMatch;
      if (isMatch) {
        visibleCount += 1;
      }
    }

    for (const btn of filterBtns) {
      const isActive = (btn.dataset.filter ?? '') === activeCategory;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }

    if (emptyFilterEl) {
      emptyFilterEl.hidden = visibleCount > 0;
    }
  };

  const renderCycleControls = (): void => {
    for (const btn of cycleBtns) {
      const isActive = btn.dataset.cycle === activeCycle;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    }
  };

  const renderCompareTray = (): void => {
    const selectedChecks = compareChecks.filter((input) => input.checked);
    const limitReached = selectedChecks.length >= MAX_COMPARE_PLANS;

    for (const input of compareChecks) {
      input.disabled = limitReached && !input.checked;
    }

    if (!compareTray || !compareSummary) {
      return;
    }

    if (selectedChecks.length < 2) {
      compareTray.hidden = true;
      compareSummary.replaceChildren();
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const input of selectedChecks) {
      const card = input.closest<HTMLElement>('[data-cmp-hook-plan="card"]');
      if (!card) {
        continue;
      }

      const item = document.createElement('div');
      item.className = 'cmp-plan-comparison__tray-item';

      const titleEl = document.createElement('strong');
      titleEl.textContent = card.dataset.planTitle ?? card.dataset.planId ?? '';

      const priceText =
        card.querySelector<HTMLElement>('[data-cmp-hook-plan="price"]')?.textContent ?? '';
      const annualLimit = card.dataset.annualLimit ?? '';
      const metaEl = document.createElement('span');
      metaEl.textContent = annualLimit ? `${priceText} | Limit ${annualLimit}` : priceText;

      item.append(titleEl, metaEl);
      fragment.appendChild(item);
    }

    compareSummary.replaceChildren(fragment);
    compareTray.hidden = false;
  };

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.filter || 'all';
      renderFilter();
    });
  }

  for (const btn of cycleBtns) {
    btn.addEventListener('click', () => {
      activeCycle = btn.dataset.cycle === 'annual' ? 'annual' : 'monthly';
      renderCycleControls();
      renderPrices();
      renderCompareTray();
    });
  }

  ageSelect?.addEventListener('change', () => {
    const nextFactor = Number.parseFloat(ageSelect.value);
    ageFactor = Number.isFinite(nextFactor) && nextFactor > 0 ? nextFactor : 1;
    renderPrices();
    renderCompareTray();
  });

  for (const check of compareChecks) {
    check.addEventListener('change', () => {
      renderCompareTray();
    });
  }

  clearCompareBtn?.addEventListener('click', () => {
    for (const check of compareChecks) {
      check.checked = false;
    }
    renderCompareTray();
  });

  renderCycleControls();
  renderFilter();
  renderPrices();
  renderCompareTray();
}

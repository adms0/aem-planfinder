import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateDisplayRate,
  initPlanComparison
} from './planComparison';

function createFixtureDom(): HTMLElement {
  document.body.innerHTML = `
    <section class="cmp-plan-comparison"
             data-cmp-is="plan-comparison"
             data-default-cycle="monthly"
             data-annual-discount="15"
             data-currency="IDR">
      <div class="cmp-plan-comparison__filters">
        <button type="button" class="is-active" data-cmp-hook-plan="filterBtn" data-filter="all" aria-pressed="true">All</button>
        <button type="button" data-cmp-hook-plan="filterBtn" data-filter="health" aria-pressed="false">Health</button>
        <button type="button" data-cmp-hook-plan="filterBtn" data-filter="critical" aria-pressed="false">Critical</button>
      </div>
      <select data-cmp-hook-plan="ageBand">
        <option value="1.0" selected>18 - 30</option>
        <option value="1.35">31 - 45</option>
      </select>
      <div class="cmp-plan-comparison__cycle-toggle">
        <button type="button" class="is-active" data-cmp-hook-plan="cycleBtn" data-cycle="monthly" aria-pressed="true">Monthly</button>
        <button type="button" data-cmp-hook-plan="cycleBtn" data-cycle="annual" aria-pressed="false">Annual</button>
      </div>
      <div class="cmp-plan-comparison__grid">
        <article data-cmp-hook-plan="card"
                 data-plan-id="primacare-essential"
                 data-plan-title="PrimaCare Essential"
                 data-category="health"
                 data-monthly-rate="420000"
                 data-annual-limit="IDR 1,500,000,000">
          <div data-cmp-hook-plan="price">420000</div>
          <div data-cmp-hook-plan="period">per month</div>
          <input type="checkbox" data-cmp-hook-plan="compareCheck" value="primacare-essential"/>
        </article>
        <article data-cmp-hook-plan="card"
                 data-plan-id="criticalguard-max"
                 data-plan-title="CriticalGuard Max"
                 data-category="critical"
                 data-monthly-rate="910000"
                 data-annual-limit="IDR 2,500,000,000">
          <div data-cmp-hook-plan="price">910000</div>
          <div data-cmp-hook-plan="period">per month</div>
          <input type="checkbox" data-cmp-hook-plan="compareCheck" value="criticalguard-max"/>
        </article>
      </div>
      <p data-cmp-hook-plan="emptyFilter" hidden>Empty</p>
      <div data-cmp-hook-plan="compareTray" hidden>
        <div data-cmp-hook-plan="compareSummary"></div>
        <button type="button" data-cmp-hook-plan="clearCompare">Clear</button>
      </div>
    </section>
  `;

  return document.querySelector<HTMLElement>('[data-cmp-is="plan-comparison"]')!;
}

describe('calculateDisplayRate', () => {
  it('applies age factor and annual discount accurately', () => {
    const monthly = calculateDisplayRate(420000, 1.35, 'monthly', 15);
    expect(monthly.amount).toBe(567000);

    const annual = calculateDisplayRate(420000, 1.0, 'annual', 15);
    expect(annual.monthlyEquivalent).toBe(357000);
    expect(annual.amount).toBe(4284000);
  });
});

describe('initPlanComparison', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = createFixtureDom();
  });

  it('sets initialized flag and ignores duplicate init calls', () => {
    initPlanComparison(root);
    expect(root.dataset.cmpInitialized).toBe('true');

    const annualBtn = root.querySelector<HTMLButtonElement>('[data-cycle="annual"]')!;
    initPlanComparison(root);
    annualBtn.click();

    const firstPrice = root.querySelector<HTMLElement>('[data-cmp-hook-plan="price"]')!;
    expect(firstPrice.textContent).toContain('4.284.000');
  });

  it('switches billing cycle from monthly to annual using data-annual-discount', () => {
    initPlanComparison(root);

    const annualBtn = root.querySelector<HTMLButtonElement>('[data-cycle="annual"]')!;
    annualBtn.click();

    const firstCard = root.querySelector<HTMLElement>('[data-plan-id="primacare-essential"]')!;
    const priceText = firstCard.querySelector<HTMLElement>('[data-cmp-hook-plan="price"]')!.textContent;
    const periodText = firstCard.querySelector<HTMLElement>('[data-cmp-hook-plan="period"]')!.textContent;

    expect(annualBtn.getAttribute('aria-pressed')).toBe('true');
    expect(priceText).toContain('4.284.000');
    expect(periodText).toContain('357.000/mo');
  });

  it('filters cards by category and updates aria-pressed', () => {
    initPlanComparison(root);

    const criticalBtn = root.querySelector<HTMLButtonElement>('[data-filter="critical"]')!;
    criticalBtn.click();

    const healthCard = root.querySelector<HTMLElement>('[data-plan-id="primacare-essential"]')!;
    const criticalCard = root.querySelector<HTMLElement>('[data-plan-id="criticalguard-max"]')!;

    expect(criticalBtn.getAttribute('aria-pressed')).toBe('true');
    expect(healthCard.hidden).toBe(true);
    expect(criticalCard.hidden).toBe(false);
  });

  it('recalculates IDR premium when age band changes', () => {
    initPlanComparison(root);

    const ageSelect = root.querySelector<HTMLSelectElement>('[data-cmp-hook-plan="ageBand"]')!;
    ageSelect.value = '1.35';
    ageSelect.dispatchEvent(new Event('change'));

    const firstCard = root.querySelector<HTMLElement>('[data-plan-id="primacare-essential"]')!;
    const priceText = firstCard.querySelector<HTMLElement>('[data-cmp-hook-plan="price"]')!.textContent;
    expect(priceText).toContain('567.000');
  });

  it('reveals comparison tray when at least 2 plans are checked and clears cleanly', () => {
    initPlanComparison(root);

    const tray = root.querySelector<HTMLElement>('[data-cmp-hook-plan="compareTray"]')!;
    const checks = root.querySelectorAll<HTMLInputElement>('[data-cmp-hook-plan="compareCheck"]');

    checks[0].checked = true;
    checks[0].dispatchEvent(new Event('change'));
    expect(tray.hidden).toBe(true);

    checks[1].checked = true;
    checks[1].dispatchEvent(new Event('change'));
    expect(tray.hidden).toBe(false);
    expect(root.querySelector('[data-cmp-hook-plan="compareSummary"]')!.children.length).toBe(2);

    root.querySelector<HTMLButtonElement>('[data-cmp-hook-plan="clearCompare"]')!.click();
    expect(tray.hidden).toBe(true);
    expect(checks[0].checked).toBe(false);
  });
});

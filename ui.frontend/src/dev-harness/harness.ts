import './harness.scss';

interface FixturePlan {
  id: string;
  title: string;
  category: 'health' | 'life' | 'critical';
  badge?: string;
  monthlyRate: number;
  roomLimit: string;
  annualLimit: string;
  featured: boolean;
  ctaLabel: string;
  ctaLink: string;
  features: string[];
}

const SAMPLE_PLANS: FixturePlan[] = [
  {
    id: 'primacare-essential',
    title: 'PrimaCare Essential',
    category: 'health',
    monthlyRate: 420000,
    roomLimit: 'IDR 1,500,000 / day',
    annualLimit: 'IDR 1,500,000,000',
    featured: false,
    ctaLabel: 'Choose Essential',
    ctaLink: '#primacare-essential',
    features: [
      'Cashless hospital admission',
      'Inpatient surgery & ICU',
      'Pre- and post-hospitalization 30 days'
    ]
  },
  {
    id: 'primacare-plus',
    title: 'PrimaCare Plus',
    category: 'health',
    badge: 'Most Selected',
    monthlyRate: 780000,
    roomLimit: 'IDR 3,000,000 / day',
    annualLimit: 'IDR 4,000,000,000',
    featured: true,
    ctaLabel: 'Choose Plus',
    ctaLink: '#primacare-plus',
    features: [
      'Private 1-bed suite worldwide (excl. US)',
      'Annual health check-up allowance',
      'No-claim renewal bonus 10%'
    ]
  },
  {
    id: 'lifeshield-family',
    title: 'LifeShield Family',
    category: 'life',
    monthlyRate: 560000,
    roomLimit: 'Sum Assured IDR 1.2B',
    annualLimit: 'IDR 1,200,000,000',
    featured: false,
    ctaLabel: 'Choose LifeShield',
    ctaLink: '#lifeshield-family',
    features: [
      'Term life protection up to age 75',
      'Accidental death additional benefit',
      'Waiver of premium on total disability'
    ]
  },
  {
    id: 'criticalguard-max',
    title: 'CriticalGuard Max',
    category: 'critical',
    badge: 'Comprehensive',
    monthlyRate: 910000,
    roomLimit: 'Lump-sum payout',
    annualLimit: 'IDR 2,500,000,000',
    featured: false,
    ctaLabel: 'Choose CriticalGuard',
    ctaLink: '#criticalguard-max',
    features: [
      'Covers 68 early & late-stage conditions',
      'Multiple claim payout structure',
      'Second medical opinion service'
    ]
  }
];

interface WorkbenchState {
  wcmMode: 'author' | 'publish';
  fixture: 'populated' | 'empty';
  styleVariant: '' | 'cmp-plan-comparison--compact' | 'cmp-plan-comparison--navy';
  annualDiscountPercent: number;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderComponentHtml(state: WorkbenchState): string {
  if (state.fixture === 'empty') {
    if (state.wcmMode === 'publish') {
      return '';
    }
    return `<div class="cq-placeholder cmp-plan-comparison" data-emptytext="Plan Comparison">Plan Comparison (Configure plans in dialog)</div>`;
  }

  const sectionClasses = ['cmp-plan-comparison', state.styleVariant].filter(Boolean).join(' ');

  const cardsHtml = SAMPLE_PLANS.map((plan) => {
    const cardClasses = [
      'cmp-plan-comparison__card',
      plan.featured ? 'cmp-plan-comparison__card--featured' : ''
    ]
      .filter(Boolean)
      .join(' ');

    const badgeHtml = plan.badge
      ? `<span class="cmp-plan-comparison__badge">${escapeHtml(plan.badge)}</span>`
      : '';

    const featuresHtml = plan.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('');

    return `
      <article class="${cardClasses}"
               data-cmp-hook-plan="card"
               data-plan-id="${escapeHtml(plan.id)}"
               data-plan-title="${escapeHtml(plan.title)}"
               data-category="${escapeHtml(plan.category)}"
               data-monthly-rate="${plan.monthlyRate}"
               data-room-limit="${escapeHtml(plan.roomLimit)}"
               data-annual-limit="${escapeHtml(plan.annualLimit)}">
        <div class="cmp-plan-comparison__card-top">
          <div class="cmp-plan-comparison__card-meta">
            <span class="cmp-plan-comparison__category">${escapeHtml(plan.category)}</span>
            ${badgeHtml}
          </div>
          <h3 class="cmp-plan-comparison__card-title">${escapeHtml(plan.title)}</h3>
        </div>
        <div class="cmp-plan-comparison__price-block">
          <div class="cmp-plan-comparison__price" data-cmp-hook-plan="price">${plan.monthlyRate}</div>
          <div class="cmp-plan-comparison__period" data-cmp-hook-plan="period">per month</div>
        </div>
        <dl class="cmp-plan-comparison__limits">
          <div class="cmp-plan-comparison__limit-row">
            <dt>Hospital / Room</dt>
            <dd>${escapeHtml(plan.roomLimit)}</dd>
          </div>
          <div class="cmp-plan-comparison__limit-row">
            <dt>Annual Limit</dt>
            <dd>${escapeHtml(plan.annualLimit)}</dd>
          </div>
        </dl>
        <ul class="cmp-plan-comparison__features">${featuresHtml}</ul>
        <div class="cmp-plan-comparison__card-footer">
          <label class="cmp-plan-comparison__compare-label">
            <input type="checkbox"
                   class="cmp-plan-comparison__compare-check"
                   data-cmp-hook-plan="compareCheck"
                   value="${escapeHtml(plan.id)}"/>
            <span>Compare</span>
          </label>
          <a class="cmp-plan-comparison__cta" href="${escapeHtml(plan.ctaLink)}">${escapeHtml(plan.ctaLabel)}</a>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section class="${sectionClasses}"
             data-cmp-is="plan-comparison"
             data-default-cycle="monthly"
             data-annual-discount="${state.annualDiscountPercent}"
             data-currency="IDR">
      <header class="cmp-plan-comparison__header">
        <div class="cmp-plan-comparison__intro">
          <h2 class="cmp-plan-comparison__heading">Compare Protection Plans</h2>
          <p class="cmp-plan-comparison__subheading">Evaluate hospital coverage, annual benefit limits, and age-adjusted monthly or annual premiums.</p>
        </div>
        <div class="cmp-plan-comparison__controls">
          <div class="cmp-plan-comparison__filters" role="group" aria-label="Filter by coverage category">
            <button type="button" class="cmp-plan-comparison__filter-btn is-active" data-cmp-hook-plan="filterBtn" data-filter="all" aria-pressed="true">All Plans</button>
            <button type="button" class="cmp-plan-comparison__filter-btn" data-cmp-hook-plan="filterBtn" data-filter="health" aria-pressed="false">Health</button>
            <button type="button" class="cmp-plan-comparison__filter-btn" data-cmp-hook-plan="filterBtn" data-filter="life" aria-pressed="false">Life</button>
            <button type="button" class="cmp-plan-comparison__filter-btn" data-cmp-hook-plan="filterBtn" data-filter="critical" aria-pressed="false">Critical Illness</button>
          </div>
          <div class="cmp-plan-comparison__pricing-controls">
            <label class="cmp-plan-comparison__age-field">
              <span class="cmp-plan-comparison__control-label">Age Band</span>
              <select class="cmp-plan-comparison__age-select" data-cmp-hook-plan="ageBand" aria-label="Age band">
                <option value="1.0" selected>18 - 30 yrs</option>
                <option value="1.35">31 - 45 yrs</option>
                <option value="1.85">46 - 60 yrs</option>
              </select>
            </label>
            <div class="cmp-plan-comparison__cycle-toggle" role="group" aria-label="Billing cycle">
              <button type="button" class="cmp-plan-comparison__cycle-btn is-active" data-cmp-hook-plan="cycleBtn" data-cycle="monthly" aria-pressed="true">Monthly</button>
              <button type="button" class="cmp-plan-comparison__cycle-btn" data-cmp-hook-plan="cycleBtn" data-cycle="annual" aria-pressed="false">
                Annual
                ${state.annualDiscountPercent > 0 ? `<span class="cmp-plan-comparison__discount-tag">Save ${state.annualDiscountPercent}%</span>` : ''}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="cmp-plan-comparison__grid">${cardsHtml}</div>
      <p class="cmp-plan-comparison__empty-filter" data-cmp-hook-plan="emptyFilter" hidden>No plans match the selected coverage category.</p>
      <div class="cmp-plan-comparison__compare-tray" data-cmp-hook-plan="compareTray" hidden>
        <div class="cmp-plan-comparison__tray-inner">
          <div class="cmp-plan-comparison__tray-summary" data-cmp-hook-plan="compareSummary"></div>
          <button type="button" class="cmp-plan-comparison__tray-clear" data-cmp-hook-plan="clearCompare">Clear selection</button>
        </div>
      </div>
      <p class="cmp-plan-comparison__disclaimer">Illustrative rates only. Final underwriting terms depend on medical disclosure and policy issuance.</p>
    </section>
  `;
}

function mountWorkbench(): void {
  const root = document.getElementById('aem-workbench-root');
  if (!root) {
    return;
  }

  const state: WorkbenchState = {
    wcmMode: 'author',
    fixture: 'populated',
    styleVariant: '',
    annualDiscountPercent: 15
  };

  root.innerHTML = `
    <div class="dev-workbench">
      <div class="dev-workbench__bar">
        <div class="dev-workbench__title">AEM Local Workbench - planfinder/components/plan-comparison</div>
        <div class="dev-workbench__controls">
          <div class="dev-workbench__field">
            <label for="wb-wcm">WCM Mode</label>
            <select id="wb-wcm">
              <option value="author" selected>Author (Edit)</option>
              <option value="publish">Publish (wcmmode=disabled)</option>
            </select>
          </div>
          <div class="dev-workbench__field">
            <label for="wb-fixture">Content</label>
            <select id="wb-fixture">
              <option value="populated" selected>Populated (4 Plans)</option>
              <option value="empty">Empty Component</option>
            </select>
          </div>
          <div class="dev-workbench__field">
            <label for="wb-style">Style System</label>
            <select id="wb-style">
              <option value="" selected>Default</option>
              <option value="cmp-plan-comparison--compact">Compact</option>
              <option value="cmp-plan-comparison--navy">Dark Header</option>
            </select>
          </div>
          <div class="dev-workbench__field">
            <label for="wb-discount">Annual Discount %</label>
            <input id="wb-discount" type="number" min="0" max="40" value="15"/>
          </div>
        </div>
      </div>
      <main class="dev-workbench__canvas">
        <div class="dev-workbench__author-chrome">
          <div class="dev-workbench__edit-badge">planfinder/components/plan-comparison</div>
          <div id="wb-component-mount"></div>
        </div>
      </main>
    </div>
  `;

  const mountEl = document.getElementById('wb-component-mount');
  const wcmSelect = document.getElementById('wb-wcm') as HTMLSelectElement;
  const fixtureSelect = document.getElementById('wb-fixture') as HTMLSelectElement;
  const styleSelect = document.getElementById('wb-style') as HTMLSelectElement;
  const discountInput = document.getElementById('wb-discount') as HTMLInputElement;

  const render = (): void => {
    document.body.classList.toggle('cq-wcm-edit', state.wcmMode === 'author');
    if (mountEl) {
      mountEl.innerHTML = renderComponentHtml(state);
    }
  };

  wcmSelect.addEventListener('change', () => {
    state.wcmMode = wcmSelect.value === 'publish' ? 'publish' : 'author';
    render();
  });

  fixtureSelect.addEventListener('change', () => {
    state.fixture = fixtureSelect.value === 'empty' ? 'empty' : 'populated';
    render();
  });

  styleSelect.addEventListener('change', () => {
    const val = styleSelect.value;
    state.styleVariant =
      val === 'cmp-plan-comparison--compact' || val === 'cmp-plan-comparison--navy' ? val : '';
    render();
  });

  discountInput.addEventListener('change', () => {
    const next = Number.parseInt(discountInput.value, 10);
    state.annualDiscountPercent = Number.isFinite(next) ? Math.min(Math.max(next, 0), 40) : 15;
    render();
  });

  render();
}

mountWorkbench();

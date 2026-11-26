import './styles/site.scss';
import { initPlanComparison } from './components/plan-comparison/planComparison';

const COMPONENT_SELECTOR = '[data-cmp-is="plan-comparison"]';

export function initPlanComparisonComponents(scope: ParentNode = document): void {
  const instances = scope.querySelectorAll<HTMLElement>(COMPONENT_SELECTOR);
  for (const element of instances) {
    initPlanComparison(element);
  }
}

function bootstrap(): void {
  initPlanComparisonComponents(document);

  if (!document.body || typeof MutationObserver === 'undefined') {
    return;
  }

  // Re-bind when AEM Touch UI replaces a component fragment in place after a dialog save
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        if (node.matches(COMPONENT_SELECTOR)) {
          initPlanComparison(node);
        } else {
          initPlanComparisonComponents(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

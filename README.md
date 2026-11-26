# aem-planfinder

AEM multi-module reference implementing a `plan-comparison` component (`planfinder/components/plan-comparison`) with billing cycle switching, coverage category filtering, age-band premium calculation, and a side-by-side comparison tray.

## Modules

- `core`: Sling Models (`PlanComparisonModel`, `PlanItem`), Jackson exporter configuration, and JUnit 5 tests using `aem-mocks`.
- `ui.apps`: Touch UI dialog (`_cq_dialog`), edit config (`_cq_editConfig`), HTL markup (`plan-comparison.html`), and proxied `clientlib-site` assets.
- `ui.content`: Style System policies (`/conf/planfinder`) and sample authored page content (`/content/planfinder/id/en/protection-plans`).
- `ui.frontend`: TypeScript + SCSS (BEM) source compiled via Vite, unit-tested with Vitest, and synced to `ui.apps` via `scripts/sync-clientlib.mjs`. Also includes a local dev harness (`src/dev-harness`) to preview Author vs. Publish states without running `cq-quickstart.jar`.
- `dispatcher`: Baseline Apache Dispatcher filter rules allowing `/etc.clientlibs/*` while denying `/apps/*`.

## Frontend Quickstart

Requires Node.js 20+ and `pnpm`.

```bash
cd ui.frontend
pnpm install
pnpm dev
```

Run checks and regenerate the proxied AEM clientlib in `ui.apps`:

```bash
pnpm typecheck
pnpm test
pnpm build
```

`pnpm build` writes deterministic `site.js`, `site.css`, `js.txt`, and `css.txt` into `ui.apps/src/main/content/jcr_root/apps/planfinder/clientlibs/clientlib-site/`.

## Full AEM Deployment

When targeting a local AEM SDK Author instance on port `4502`:

```bash
mvn clean install -PautoInstallSinglePackage
```

## Design Notes

- Authoring empty-state uses `core/wcm/components/commons/v1/templates.html` (`placeholderTemplate`) so empty components stay selectable in Edit mode and render nothing on Publish.
- `clientlib-site` sets `allowProxy="{Boolean}true"` so assets resolve via `/etc.clientlibs/planfinder/clientlibs/clientlib-site.*` when `/apps` is blocked on Publish and Dispatcher.
- `site.ts` attaches a `MutationObserver` scoped to `document.body` so re-rendered component fragments after Touch UI dialog saves re-initialize automatically.

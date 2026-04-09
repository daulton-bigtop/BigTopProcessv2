# Big Top Lead-to-Cash Mapper

Open `index.html` in a browser.

## What is new
- User-friendly **Project Inputs** section to generate a recommended workflow path.
- `Layout View` toggle with **Parallel View** and **Timeline View**.
- Floating compass controls on the chart for quick directional scrolling (click or press-and-hold), plus center recenter.
- Every node is clickable to open a RACI popup (pre/post PO templates based on your process and PM ownership matrix).
- RACI popup editing is PIN-protected (`0000`) and saved in-app using browser local storage (no code changes needed for updates).
- Path generation is curated from project conditions (install, engineering, terms, revisions, offload), and preassigned production slot is handled as an in-flow mid-process decision.
- Contract, engineering, finance, and PM readiness now run as explicit **parallel tracks** with a shared pre-scope prerequisite join.
- Finance invoicing and PM early scheduling also run in parallel after award.
- For non-net customers, **down payment receipt is a prerequisite before scope begins**.
- Scope remains in **Sales**, but only starts after the full prerequisite join is complete.
- Branding logo is loaded from `brand/big-top-logo-2-color.png`.
- Renderer now enforces continuity: nodes are kept connected from start, and broken links are auto-fixed/pruned during render.
- Full workflow mode remains available for complete branch visibility.
- SVG download is built in.

## Basic use
1. Open `index.html`.
2. Fill in **Project Inputs**.
3. Click **Generate Recommended Path**.
4. Click any node to open the **RACI Details** popup.
5. Enter PIN `0000` and click **Unlock Edit** to update text, then **Save**.
6. Optional: click **Show Full Workflow**.
7. Optional: click **Download SVG**.

## Advanced mode
- Open **Advanced JSON (optional)** to load or render custom workflow JSON.
- Required JSON shape:
  - `lanes`: string array
  - `steps`: array of step objects with `id`, `label`, `lane`, `type`, and `next`
- `next` supports either:
  - `"target_step_id"`
  - `{ "to": "target_step_id", "label": "Yes" }`

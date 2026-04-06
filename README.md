# Big Top Lead-to-Cash Mapper

Open `index.html` in a browser.

## What is new
- User-friendly **Project Inputs** section to generate a recommended workflow path.
- `Layout View` toggle with **Parallel View** and **Timeline View**.
- Path generation is curated from project conditions (install, engineering, terms, revisions, offload, proactive slot).
- Contract and engineering now run as explicit **parallel tracks** with a shared pre-scope prerequisite join.
- Finance invoicing and PM early scheduling also run in parallel after award.
- For non-net customers, **down payment receipt is required before scope release**.
- Scope release decision is owned in **Sales** (with Finance payment prerequisite checks).
- Branding logo is loaded from `brand/big-top-logo-2-color.png`.
- Renderer now enforces continuity: nodes are kept connected from start, and broken links are auto-fixed/pruned during render.
- Full workflow mode remains available for complete branch visibility.
- SVG download is built in.

## Basic use
1. Open `index.html`.
2. Fill in **Project Inputs**.
3. Click **Generate Recommended Path**.
4. Optional: click **Show Full Workflow**.
5. Optional: click **Download SVG**.

## Advanced mode
- Open **Advanced JSON (optional)** to load or render custom workflow JSON.
- Required JSON shape:
  - `lanes`: string array
  - `steps`: array of step objects with `id`, `label`, `lane`, `type`, and `next`
- `next` supports either:
  - `"target_step_id"`
  - `{ "to": "target_step_id", "label": "Yes" }`

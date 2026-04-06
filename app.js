
const NS = "http://www.w3.org/2000/svg";

const TYPE_META = {
  start: { badge: "S", shape: "circle", fill: "#e9fef0", stroke: "#15803d" },
  task: { badge: "T", shape: "rect", fill: "#edf4ff", stroke: "#1d4ed8" },
  decision: { badge: "D", shape: "diamond", fill: "#fff7e8", stroke: "#b45309" },
  milestone: { badge: "M", shape: "hex", fill: "#f0f5ff", stroke: "#4338ca" },
  document: { badge: "DOC", shape: "doc", fill: "#fefce8", stroke: "#a16207" },
  end: { badge: "E", shape: "circle", fill: "#fdecec", stroke: "#b91c1c" }
};

const LANE_COLORS = [
  "#eaf2ff",
  "#ebf9f3",
  "#f6efff",
  "#fff5ea",
  "#eefaff",
  "#f5f9e8",
  "#fff0f0"
];

const FULL_TEMPLATE = {
  lanes: [
    "Customer",
    "Sales",
    "CAD/Engineering",
    "Project Management",
    "Installer",
    "Production",
    "Finance"
  ],
  steps: [
    {
      id: "lead_received",
      label: "Lead received (online, email, phone, referral)",
      lane: "Customer",
      type: "start",
      next: ["qualify_lead"]
    },
    {
      id: "qualify_lead",
      label: "Sales qualifies lead",
      lane: "Sales",
      type: "task",
      next: ["can_assist"]
    },
    {
      id: "can_assist",
      label: "Can Big Top support this opportunity?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "need_more_info", label: "Yes" },
        { to: "closed_lost", label: "No" }
      ]
    },
    {
      id: "need_more_info",
      label: "Need more customer information?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "request_customer_info", label: "Yes" },
        { to: "feasibility_check_needed", label: "No" }
      ]
    },
    {
      id: "request_customer_info",
      label: "Request missing project details",
      lane: "Sales",
      type: "task",
      next: ["customer_provides_info"]
    },
    {
      id: "customer_provides_info",
      label: "Customer provides additional details",
      lane: "Customer",
      type: "document",
      next: ["qualify_lead"]
    },
    {
      id: "feasibility_check_needed",
      label: "Engineering feasibility check needed?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "send_feasibility_request", label: "Yes" },
        { to: "install_required", label: "No" }
      ]
    },
    {
      id: "send_feasibility_request",
      label: "Send quote feasibility request to Engineering",
      lane: "Sales",
      type: "task",
      next: ["engineering_feasibility_review"]
    },
    {
      id: "engineering_feasibility_review",
      label: "Engineering feasibility review",
      lane: "CAD/Engineering",
      type: "task",
      next: ["feasible_for_site"]
    },
    {
      id: "feasible_for_site",
      label: "Project feasible for site conditions?",
      lane: "CAD/Engineering",
      type: "decision",
      next: [
        { to: "install_required", label: "Yes" },
        { to: "closed_lost", label: "No" }
      ]
    },
    {
      id: "install_required",
      label: "Big Top installation required?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "install_quote_request", label: "Yes" },
        { to: "build_structure_quote", label: "No" }
      ]
    },
    {
      id: "install_quote_request",
      label: "Send install quote request + minimum info sheet",
      lane: "Sales",
      type: "document",
      next: ["pm_create_bidtracer_request"]
    },
    {
      id: "pm_create_bidtracer_request",
      label: "PM enters job into BidTracer",
      lane: "Project Management",
      type: "task",
      next: ["bidtracer_invites_installers"]
    },
    {
      id: "bidtracer_invites_installers",
      label: "BidTracer sends bid requests to installers",
      lane: "Project Management",
      type: "task",
      next: ["installers_submit_bid"]
    },
    {
      id: "installers_submit_bid",
      label: "Installers submit bid",
      lane: "Installer",
      type: "task",
      next: ["pm_markup_install_bid"]
    },
    {
      id: "pm_markup_install_bid",
      label: "PM marks up install bid",
      lane: "Project Management",
      type: "task",
      next: ["sales_receive_install_price"]
    },
    {
      id: "sales_receive_install_price",
      label: "Sales receives marked-up install pricing",
      lane: "Sales",
      type: "task",
      next: ["build_structure_quote"]
    },
    {
      id: "build_structure_quote",
      label: "Build full quote (structure + install + accessories)",
      lane: "Sales",
      type: "task",
      next: ["customer_review_quote"]
    },
    {
      id: "customer_review_quote",
      label: "Customer reviews quote",
      lane: "Customer",
      type: "task",
      next: ["budget_revision_needed"]
    },
    {
      id: "budget_revision_needed",
      label: "Budget revisions requested?",
      lane: "Customer",
      type: "decision",
      next: [
        { to: "sales_revise_quote", label: "Yes" },
        { to: "po_received_decision", label: "No" }
      ]
    },
    {
      id: "sales_revise_quote",
      label: "Sales revises quote to fit budget",
      lane: "Sales",
      type: "task",
      next: ["build_structure_quote"]
    },
    {
      id: "po_received_decision",
      label: "Customer issues purchase order?",
      lane: "Customer",
      type: "decision",
      next: [
        { to: "po_received", label: "Yes" },
        { to: "closed_lost", label: "No" }
      ]
    },
    {
      id: "po_received",
      label: "PO received / project awarded",
      lane: "Sales",
      type: "milestone",
      next: ["post_award_parallel_launch"]
    },
    {
      id: "post_award_parallel_launch",
      label: "Post-award kickoff (parallel workstreams start)",
      lane: "Sales",
      type: "milestone",
      next: [
        { to: "payment_terms_decision", label: "Finance" },
        { to: "pm_award_notification", label: "PM" },
        { to: "contract_negotiation", label: "Contract" },
        { to: "engineering_required_decision", label: "Engineering" }
      ]
    },
    {
      id: "payment_terms_decision",
      label: "Customer on net terms or deposit terms?",
      lane: "Finance",
      type: "decision",
      next: [
        { to: "invoice_50_percent", label: "Deposit" },
        { to: "finance_terms_recorded", label: "Net Terms" }
      ]
    },
    {
      id: "invoice_50_percent",
      label: "Invoice 50% down payment",
      lane: "Finance",
      type: "task",
      next: ["deposit_received"]
    },
    {
      id: "deposit_received",
      label: "Down payment received",
      lane: "Finance",
      type: "milestone",
      next: ["finance_parallel_ready"]
    },
    {
      id: "finance_terms_recorded",
      label: "Record net payment terms",
      lane: "Finance",
      type: "milestone",
      next: ["finance_parallel_ready"]
    },
    {
      id: "finance_parallel_ready",
      label: "Finance setup complete (parallel)",
      lane: "Finance",
      type: "milestone",
      next: [{ to: "scope_release_gate", label: "Finance ready" }]
    },
    {
      id: "pm_award_notification",
      label: "PM notified of award and starts planning",
      lane: "Project Management",
      type: "task",
      next: ["pm_schedule_installers_parallel"]
    },
    {
      id: "pm_schedule_installers_parallel",
      label: "PM develops preliminary installer schedule",
      lane: "Project Management",
      type: "task",
      next: ["pm_parallel_ready"]
    },
    {
      id: "pm_parallel_ready",
      label: "PM pre-scope readiness complete (parallel)",
      lane: "Project Management",
      type: "milestone",
      next: [{ to: "scope_project", label: "Parallel track complete" }]
    },
    {
      id: "contract_negotiation",
      label: "Negotiate scope, pricing, terms, and delivery",
      lane: "Sales",
      type: "task",
      next: ["contract_approved_decision"]
    },
    {
      id: "contract_approved_decision",
      label: "Contract terms approved/executed?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "contract_ready", label: "Yes" },
        { to: "contract_revision", label: "No" }
      ]
    },
    {
      id: "contract_revision",
      label: "Revise contract package",
      lane: "Sales",
      type: "task",
      next: ["contract_negotiation"]
    },
    {
      id: "contract_ready",
      label: "Contract track complete",
      lane: "Sales",
      type: "milestone",
      next: ["scope_prereq_join"]
    },
    {
      id: "engineering_required_decision",
      label: "Engineering package required?",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "engineering_package", label: "Yes" },
        { to: "engineering_ready", label: "No" }
      ]
    },
    {
      id: "engineering_package",
      label: "Engineering develops and stamps package",
      lane: "CAD/Engineering",
      type: "task",
      next: ["customer_engineering_approval"]
    },
    {
      id: "customer_engineering_approval",
      label: "Customer engineering approval received?",
      lane: "Customer",
      type: "decision",
      next: [
        { to: "engineering_ready", label: "Yes" },
        { to: "engineering_revision", label: "No" }
      ]
    },
    {
      id: "engineering_revision",
      label: "Engineering revisions / direct engineering coordination",
      lane: "CAD/Engineering",
      type: "task",
      next: ["engineering_package"]
    },
    {
      id: "engineering_ready",
      label: "Engineering track complete",
      lane: "CAD/Engineering",
      type: "milestone",
      next: ["scope_prereq_join"]
    },
    {
      id: "scope_prereq_join",
      label: "Scope prerequisites complete (contract + engineering)",
      lane: "Sales",
      type: "milestone",
      next: ["scope_release_gate"]
    },
    {
      id: "scope_release_gate",
      label: "Sales scope release check (incl. deposit if not net terms)",
      lane: "Sales",
      type: "decision",
      next: [
        { to: "scope_project", label: "Yes" },
        { to: "hold_for_deposit", label: "No" }
      ]
    },
    {
      id: "hold_for_deposit",
      label: "Hold scope until down payment is received",
      lane: "Finance",
      type: "task",
      next: ["scope_release_gate"]
    },
    {
      id: "scope_project",
      label: "Scope project",
      lane: "Sales",
      type: "milestone",
      next: ["issue_tech_data_sheet"]
    },
    {
      id: "issue_tech_data_sheet",
      label: "Issue marked tech data sheet",
      lane: "Sales",
      type: "document",
      next: ["cad_sketch"]
    },
    {
      id: "cad_sketch",
      label: "CAD sketches project and electrical layout as needed",
      lane: "CAD/Engineering",
      type: "task",
      next: ["customer_sketch_approval"]
    },
    {
      id: "customer_sketch_approval",
      label: "Customer approves sketch package?",
      lane: "Customer",
      type: "decision",
      next: [
        { to: "pm_finalize_installer_schedule", label: "Yes" },
        { to: "change_order", label: "No" }
      ]
    },
    {
      id: "change_order",
      label: "Create and scope change order",
      lane: "Sales",
      type: "document",
      next: ["scope_project"]
    },
    {
      id: "pm_finalize_installer_schedule",
      label: "PM finalizes installer schedule and installer PO",
      lane: "Project Management",
      type: "task",
      next: ["production_slot_decision"]
    },
    {
      id: "production_slot_decision",
      label: "Proactive production slot already assigned?",
      lane: "Project Management",
      type: "decision",
      next: [
        { to: "proactive_slot_already_assigned", label: "Yes" },
        { to: "assign_production_slot", label: "No" }
      ]
    },
    {
      id: "proactive_slot_already_assigned",
      label: "Confirm proactive production slot",
      lane: "Project Management",
      type: "milestone",
      next: ["enter_production"]
    },
    {
      id: "assign_production_slot",
      label: "Assign production slot",
      lane: "Project Management",
      type: "task",
      next: ["enter_production"]
    },
    {
      id: "enter_production",
      label: "Structure enters production",
      lane: "Production",
      type: "milestone",
      next: ["order_trucks"]
    },
    {
      id: "order_trucks",
      label: "Shipping orders trucks based on install timing",
      lane: "Production",
      type: "task",
      next: ["finished_goods_ready"]
    },
    {
      id: "finished_goods_ready",
      label: "Finished goods staged in shipping area",
      lane: "Production",
      type: "milestone",
      next: ["release_to_ship_gate"]
    },
    {
      id: "release_to_ship_gate",
      label: "Ready to ship (paid balance or net terms)?",
      lane: "Finance",
      type: "decision",
      next: [
        { to: "offload_coordination", label: "Yes" },
        { to: "hold_for_final_payment", label: "No" }
      ]
    },
    {
      id: "hold_for_final_payment",
      label: "Hold shipment pending payment",
      lane: "Finance",
      type: "task",
      next: ["release_to_ship_gate"]
    },
    {
      id: "offload_coordination",
      label: "Offload coordinated by Big Top or customer?",
      lane: "Production",
      type: "decision",
      next: [
        { to: "pm_verify_offload", label: "Big Top" },
        { to: "shipping_verify_customer_receive", label: "Customer" }
      ]
    },
    {
      id: "pm_verify_offload",
      label: "PM verifies installer onsite for offload",
      lane: "Project Management",
      type: "task",
      next: ["ship_order"]
    },
    {
      id: "shipping_verify_customer_receive",
      label: "Shipping verifies customer receive availability",
      lane: "Production",
      type: "task",
      next: ["ship_order"]
    },
    {
      id: "ship_order",
      label: "Ship order",
      lane: "Production",
      type: "milestone",
      next: ["installation_owner_decision"]
    },
    {
      id: "installation_owner_decision",
      label: "Installation by Big Top or customer?",
      lane: "Installer",
      type: "decision",
      next: [
        { to: "installer_complete_install", label: "Big Top" },
        { to: "customer_complete_install", label: "Customer" }
      ]
    },
    {
      id: "installer_complete_install",
      label: "Installer completes installation",
      lane: "Installer",
      type: "task",
      next: ["final_invoice_required"]
    },
    {
      id: "customer_complete_install",
      label: "Customer completes installation",
      lane: "Customer",
      type: "task",
      next: ["final_invoice_required"]
    },
    {
      id: "final_invoice_required",
      label: "Final invoice required by payment terms?",
      lane: "Finance",
      type: "decision",
      next: [
        { to: "issue_final_invoice", label: "Yes" },
        { to: "cash_received", label: "No" }
      ]
    },
    {
      id: "issue_final_invoice",
      label: "Issue final invoice",
      lane: "Finance",
      type: "task",
      next: ["cash_received"]
    },
    {
      id: "cash_received",
      label: "Cash received",
      lane: "Finance",
      type: "milestone",
      next: ["project_closeout"]
    },
    {
      id: "project_closeout",
      label: "Project closeout complete",
      lane: "Sales",
      type: "end",
      next: []
    },
    {
      id: "closed_lost",
      label: "Opportunity closed lost",
      lane: "Sales",
      type: "end",
      next: []
    }
  ]
};

const STEP_META = new Map(FULL_TEMPLATE.steps.map((step) => [step.id, step]));

const els = {
  leadSource: document.getElementById("leadSource"),
  layoutMode: document.getElementById("layoutMode"),
  paymentTerms: document.getElementById("paymentTerms"),
  requiresInstall: document.getElementById("requiresInstall"),
  requiresEngineering: document.getElementById("requiresEngineering"),
  requiresFeasibilityCheck: document.getElementById("requiresFeasibilityCheck"),
  offloadOwner: document.getElementById("offloadOwner"),
  quoteRevisions: document.getElementById("quoteRevisions"),
  contractRevisions: document.getElementById("contractRevisions"),
  engineeringRevisions: document.getElementById("engineeringRevisions"),
  cadRevisions: document.getElementById("cadRevisions"),
  proactiveSlot: document.getElementById("proactiveSlot"),
  generateBtn: document.getElementById("generateBtn"),
  showFullBtn: document.getElementById("showFullBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  loadTemplateBtn: document.getElementById("loadTemplateBtn"),
  renderFromJsonBtn: document.getElementById("renderFromJsonBtn"),
  jsonInput: document.getElementById("jsonInput"),
  summary: document.getElementById("summary"),
  status: document.getElementById("status"),
  legend: document.getElementById("legend"),
  chart: document.getElementById("chart")
};

let currentData = null;

init();

function init() {
  renderLegend();
  bindEvents();
  syncInputDependencies();
  writeJson(FULL_TEMPLATE);
  generateScenario();
}

function bindEvents() {
  els.generateBtn.addEventListener("click", generateScenario);

  els.showFullBtn.addEventListener("click", () => {
    const normalized = normalizeData(clone(FULL_TEMPLATE));
    const connected = enforceConnected(normalized);
    currentData = connected.data;
    writeJson(currentData);
    render(currentData);
    updateSummary(currentData, "Full workflow", connected.warnings);
    showStatus(formatStatus("Showing full workflow", connected.warnings), connected.warnings.length ? "error" : "success");
  });

  els.downloadBtn.addEventListener("click", downloadSvg);

  els.loadTemplateBtn.addEventListener("click", () => {
    writeJson(FULL_TEMPLATE);
    showStatus("Loaded full template JSON.", "success");
  });

  els.renderFromJsonBtn.addEventListener("click", () => {
    const parsed = parseJsonInput();
    if (!parsed) {
      return;
    }

    const connected = enforceConnected(parsed);
    currentData = connected.data;
    render(currentData);
    updateSummary(currentData, "JSON render", connected.warnings);
    showStatus(formatStatus("Rendered JSON", connected.warnings), connected.warnings.length ? "error" : "success");
  });

  els.requiresInstall.addEventListener("change", syncInputDependencies);
  els.layoutMode.addEventListener("change", () => {
    if (!currentData) {
      return;
    }

    render(currentData);
    showStatus(`Switched to ${els.layoutMode.value === "timeline" ? "Timeline View" : "Parallel View"}.`, "success");
  });
}
function syncInputDependencies() {
  const requiresInstall = els.requiresInstall.value === "yes";

  if (!requiresInstall) {
    els.offloadOwner.value = "customer";
    els.offloadOwner.disabled = true;
  } else {
    els.offloadOwner.disabled = false;
  }
}

function readInputs() {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  return {
    leadSource: els.leadSource.value,
    paymentTerms: els.paymentTerms.value,
    requiresInstall: els.requiresInstall.value === "yes",
    requiresEngineering: els.requiresEngineering.value === "yes",
    requiresFeasibilityCheck: els.requiresFeasibilityCheck.value === "yes",
    offloadOwner: els.offloadOwner.value,
    quoteRevisions: clamp(Number(els.quoteRevisions.value) || 0, 0, 3),
    contractRevisions: clamp(Number(els.contractRevisions.value) || 0, 0, 3),
    engineeringRevisions: clamp(Number(els.engineeringRevisions.value) || 0, 0, 3),
    cadRevisions: clamp(Number(els.cadRevisions.value) || 0, 0, 3),
    proactiveSlot: els.proactiveSlot.value === "yes"
  };
}

function generateScenario() {
  const input = readInputs();
  const scenario = buildScenario(input);
  const normalized = normalizeData(scenario);
  const connected = enforceConnected(normalized);

  currentData = connected.data;
  writeJson(currentData);
  render(currentData);
  updateSummary(currentData, "Recommended project path", connected.warnings, input);
  showStatus(formatStatus("Generated connected lead-to-cash path", connected.warnings), connected.warnings.length ? "error" : "success");
}

function buildScenario(input) {
  const steps = [];
  const byId = new Map();
  const createId = (baseId, suffix) => (suffix ? `${baseId}_${suffix}` : baseId);

  const add = (baseId, options = {}) => {
    const base = STEP_META.get(baseId) || {
      label: baseId,
      lane: "Sales",
      type: "task"
    };

    const id = createId(baseId, options.suffix || "");
    if (byId.has(id)) {
      throw new Error(`Duplicate scenario step id '${id}'.`);
    }

    const step = {
      id,
      label: options.label || base.label,
      lane: options.lane || base.lane,
      type: options.type || base.type,
      next: []
    };

    if (options.stage) {
      step.stage = options.stage;
    }

    byId.set(id, step);
    steps.push(step);
    return id;
  };

  const connect = (fromId, toId, label = "") => {
    const from = byId.get(fromId);
    if (!from || !byId.has(toId)) {
      throw new Error(`Cannot connect '${fromId}' to '${toId}'.`);
    }

    if (label) {
      from.next.push({ to: toId, label });
    } else {
      from.next.push(toId);
    }
  };

  const walk = (fromId, baseId, options = {}) => {
    const toId = add(baseId, options);
    connect(fromId, toId, options.edgeLabel || "");
    return toId;
  };

  let cursor = add("lead_received", { label: `Lead received (${input.leadSource})` });
  cursor = walk(cursor, "qualify_lead");
  cursor = walk(cursor, "can_assist");
  cursor = walk(cursor, "need_more_info", { edgeLabel: "Yes" });
  cursor = walk(cursor, "feasibility_check_needed", { edgeLabel: "No" });

  if (input.requiresFeasibilityCheck) {
    cursor = walk(cursor, "send_feasibility_request", { edgeLabel: "Yes" });
    cursor = walk(cursor, "engineering_feasibility_review");
    cursor = walk(cursor, "feasible_for_site");
    cursor = walk(cursor, "install_required", { edgeLabel: "Yes" });
  } else {
    cursor = walk(cursor, "install_required", { edgeLabel: "No" });
  }

  if (input.requiresInstall) {
    cursor = walk(cursor, "install_quote_request", { edgeLabel: "Yes" });
    cursor = walk(cursor, "pm_create_bidtracer_request");
    cursor = walk(cursor, "bidtracer_invites_installers");
    cursor = walk(cursor, "installers_submit_bid");
    cursor = walk(cursor, "pm_markup_install_bid");
    cursor = walk(cursor, "sales_receive_install_price");
    cursor = walk(cursor, "build_structure_quote");
  } else {
    cursor = walk(cursor, "build_structure_quote", { edgeLabel: "No" });
  }

  cursor = walk(cursor, "customer_review_quote");

  for (let i = 1; i <= input.quoteRevisions; i += 1) {
    const budgetDecision = add("budget_revision_needed", {
      suffix: `r${i}`,
      label: `Budget revisions requested? (Round ${i})`
    });
    connect(cursor, budgetDecision);

    const reviseQuote = add("sales_revise_quote", {
      suffix: `r${i}`,
      label: `Sales revises quote (Round ${i})`
    });
    connect(budgetDecision, reviseQuote, "Yes");

    const rebuiltQuote = add("build_structure_quote", {
      suffix: `r${i}`,
      label: `Rebuild quote (Round ${i})`
    });
    connect(reviseQuote, rebuiltQuote);

    const reReview = add("customer_review_quote", {
      suffix: `r${i}`,
      label: `Customer re-reviews quote (Round ${i})`
    });
    connect(rebuiltQuote, reReview);
    cursor = reReview;
  }

  const budgetFinal = add("budget_revision_needed", {
    suffix: "final",
    label: "Budget revisions requested?"
  });
  connect(cursor, budgetFinal);

  const poDecision = add("po_received_decision");
  connect(budgetFinal, poDecision, "No");

  const poReceived = add("po_received");
  connect(poDecision, poReceived, "Yes");

  const kickoff = add("post_award_parallel_launch");
  connect(poReceived, kickoff);

  const paymentDecision = add("payment_terms_decision");
  connect(kickoff, paymentDecision, "Finance");

  let financeReady;
  if (input.paymentTerms === "deposit") {
    const invoice = add("invoice_50_percent");
    connect(paymentDecision, invoice, "Deposit");
    const depositReceived = add("deposit_received");
    connect(invoice, depositReceived);
    financeReady = add("finance_parallel_ready");
    connect(depositReceived, financeReady);
  } else {
    const netTerms = add("finance_terms_recorded");
    connect(paymentDecision, netTerms, "Net Terms");
    financeReady = add("finance_parallel_ready");
    connect(netTerms, financeReady);
  }

  const pmNotify = add("pm_award_notification");
  connect(kickoff, pmNotify, "PM");
  const pmPlan = add("pm_schedule_installers_parallel");
  connect(pmNotify, pmPlan);
  const pmReady = add("pm_parallel_ready");
  connect(pmPlan, pmReady);

  let contractWork = add("contract_negotiation");
  connect(kickoff, contractWork, "Contract");

  for (let i = 1; i <= input.contractRevisions; i += 1) {
    const contractDecision = add("contract_approved_decision", {
      suffix: `r${i}`,
      label: `Contract approved/executed? (Round ${i})`
    });
    connect(contractWork, contractDecision);

    const contractRevision = add("contract_revision", {
      suffix: `r${i}`,
      label: `Contract revision (Round ${i})`
    });
    connect(contractDecision, contractRevision, "No");

    contractWork = add("contract_negotiation", {
      suffix: `r${i}`,
      label: `Contract renegotiation (Round ${i})`
    });
    connect(contractRevision, contractWork);
  }

  const contractFinalDecision = add("contract_approved_decision", {
    suffix: "final",
    label: "Contract approved/executed?"
  });
  connect(contractWork, contractFinalDecision);

  const contractReady = add("contract_ready");
  connect(contractFinalDecision, contractReady, "Yes");

  const engineeringDecision = add("engineering_required_decision");
  connect(kickoff, engineeringDecision, "Engineering");

  let engineeringReady;
  if (input.requiresEngineering) {
    let engineeringPackage = add("engineering_package");
    connect(engineeringDecision, engineeringPackage, "Yes");

    for (let i = 1; i <= input.engineeringRevisions; i += 1) {
      const engineeringApproval = add("customer_engineering_approval", {
        suffix: `r${i}`,
        label: `Customer engineering approval? (Round ${i})`
      });
      connect(engineeringPackage, engineeringApproval);

      const engineeringRevision = add("engineering_revision", {
        suffix: `r${i}`,
        label: `Engineering revision (Round ${i})`
      });
      connect(engineeringApproval, engineeringRevision, "No");

      engineeringPackage = add("engineering_package", {
        suffix: `r${i}`,
        label: `Updated engineering package (Round ${i})`
      });
      connect(engineeringRevision, engineeringPackage);
    }

    const engineeringApprovalFinal = add("customer_engineering_approval", {
      suffix: "final",
      label: "Customer engineering approval?"
    });
    connect(engineeringPackage, engineeringApprovalFinal);

    engineeringReady = add("engineering_ready");
    connect(engineeringApprovalFinal, engineeringReady, "Yes");
  } else {
    engineeringReady = add("engineering_ready", {
      label: "Engineering not required"
    });
    connect(engineeringDecision, engineeringReady, "No");
  }

  const prereqJoin = add("scope_prereq_join");
  connect(contractReady, prereqJoin);
  connect(engineeringReady, prereqJoin);

  const scopeReleaseGate = add("scope_release_gate", {
    label: input.paymentTerms === "net"
      ? "Sales scope release check (contract + engineering + net terms)"
      : "Sales scope release check (contract + engineering + down payment)"
  });
  connect(prereqJoin, scopeReleaseGate, "Prereqs");
  connect(financeReady, scopeReleaseGate, input.paymentTerms === "net" ? "Net Terms" : "Deposit");
  connect(pmReady, scopeReleaseGate, "PM Ready");

  if (input.paymentTerms === "deposit") {
    const holdForDeposit = add("hold_for_deposit", {
      label: "Hold scope until down payment is received"
    });
    connect(scopeReleaseGate, holdForDeposit, "No");
    connect(holdForDeposit, scopeReleaseGate);
  }

  const scopeProject = add("scope_project");
  connect(scopeReleaseGate, scopeProject, "Yes");

  const techSheet = add("issue_tech_data_sheet");
  connect(scopeProject, techSheet);
  let cadWork = add("cad_sketch");
  connect(techSheet, cadWork);

  for (let i = 1; i <= input.cadRevisions; i += 1) {
    const sketchApproval = add("customer_sketch_approval", {
      suffix: `r${i}`,
      label: `Customer approves sketch? (Round ${i})`
    });
    connect(cadWork, sketchApproval);

    const changeOrder = add("change_order", {
      suffix: `r${i}`,
      label: `Change order scoped (Round ${i})`
    });
    connect(sketchApproval, changeOrder, "No");

    cadWork = add("cad_sketch", {
      suffix: `r${i}`,
      label: `Updated CAD sketch (Round ${i})`
    });
    connect(changeOrder, cadWork);
  }

  const finalSketchApproval = add("customer_sketch_approval", {
    suffix: "final",
    label: "Customer approves sketch?"
  });
  connect(cadWork, finalSketchApproval);

  const pmFinalizeSchedule = add("pm_finalize_installer_schedule");
  connect(finalSketchApproval, pmFinalizeSchedule, "Yes");

  let productionSlotStep;
  if (input.proactiveSlot) {
    productionSlotStep = add("proactive_slot_already_assigned", {
      label: "Use proactive production slot"
    });
    connect(pmFinalizeSchedule, productionSlotStep);
  } else {
    productionSlotStep = add("assign_production_slot");
    connect(pmFinalizeSchedule, productionSlotStep);
  }

  const inProduction = add("enter_production");
  connect(productionSlotStep, inProduction);
  const trucks = add("order_trucks");
  connect(inProduction, trucks);
  const finished = add("finished_goods_ready");
  connect(trucks, finished);
  const shipGate = add("release_to_ship_gate");
  connect(finished, shipGate);
  const offloadDecision = add("offload_coordination");
  connect(shipGate, offloadDecision, "Yes");

  let offloadConfirmed;
  if (input.requiresInstall && input.offloadOwner === "big_top") {
    offloadConfirmed = add("pm_verify_offload");
    connect(offloadDecision, offloadConfirmed, "Big Top");
  } else {
    offloadConfirmed = add("shipping_verify_customer_receive");
    connect(offloadDecision, offloadConfirmed, "Customer");
  }

  const shipped = add("ship_order");
  connect(offloadConfirmed, shipped);
  const installDecision = add("installation_owner_decision");
  connect(shipped, installDecision);

  let installComplete;
  if (input.requiresInstall) {
    installComplete = add("installer_complete_install");
    connect(installDecision, installComplete, "Big Top");
  } else {
    installComplete = add("customer_complete_install");
    connect(installDecision, installComplete, "Customer");
  }

  const finalInvoiceDecision = add("final_invoice_required");
  connect(installComplete, finalInvoiceDecision);

  let cashReceived;
  if (input.paymentTerms === "net") {
    const finalInvoice = add("issue_final_invoice");
    connect(finalInvoiceDecision, finalInvoice, "Yes");
    cashReceived = add("cash_received");
    connect(finalInvoice, cashReceived);
  } else {
    cashReceived = add("cash_received");
    connect(finalInvoiceDecision, cashReceived, "No");
  }

  const closeout = add("project_closeout");
  connect(cashReceived, closeout);

  return {
    lanes: FULL_TEMPLATE.lanes.slice(),
    steps
  };
}

function parseJsonInput() {
  let parsed;

  try {
    parsed = JSON.parse(els.jsonInput.value);
  } catch (error) {
    showStatus(`Invalid JSON: ${error.message}`, "error");
    return null;
  }

  try {
    return normalizeData(parsed);
  } catch (error) {
    showStatus(error.message, "error");
    return null;
  }
}

function normalizeData(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Workflow JSON root must be an object.");
  }

  if (!Array.isArray(raw.lanes) || !Array.isArray(raw.steps)) {
    throw new Error("Workflow JSON must include 'lanes' and 'steps' arrays.");
  }

  const lanes = [];
  raw.lanes.forEach((lane) => {
    const name = String(lane || "").trim();
    if (name && !lanes.includes(name)) {
      lanes.push(name);
    }
  });

  const steps = [];
  const seen = new Set();

  raw.steps.forEach((stepRaw) => {
    if (!stepRaw || typeof stepRaw !== "object") {
      return;
    }

    const id = normalizeId(stepRaw.id);
    if (!id) {
      throw new Error("Each step requires a valid id.");
    }

    if (seen.has(id)) {
      throw new Error(`Duplicate step id '${id}'.`);
    }
    seen.add(id);

    const label = String(stepRaw.label || "").trim();
    if (!label) {
      throw new Error(`Step '${id}' is missing a label.`);
    }

    const lane = String(stepRaw.lane || "Sales").trim() || "Sales";
    if (!lanes.includes(lane)) {
      lanes.push(lane);
    }

    const type = TYPE_META[stepRaw.type] ? stepRaw.type : "task";
    const stage = Number.isFinite(Number(stepRaw.stage)) && Number(stepRaw.stage) > 0
      ? Math.floor(Number(stepRaw.stage))
      : undefined;

    steps.push({
      id,
      label,
      lane,
      type,
      stage,
      next: normalizeNext(stepRaw.next)
    });
  });

  return { lanes, steps };
}
function enforceConnected(data) {
  const warnings = [];
  const byId = new Map(data.steps.map((step) => [step.id, step]));

  let startId = "lead_received";
  if (!byId.has(startId)) {
    const startNode = data.steps.find((step) => step.type === "start") || data.steps[0];
    startId = startNode ? startNode.id : "";
  }

  if (!startId) {
    return { data: clone(data), warnings: ["No steps found."] };
  }

  const reachable = new Set([startId]);
  const queue = [startId];

  while (queue.length > 0) {
    const id = queue.shift();
    const step = byId.get(id);
    if (!step) {
      continue;
    }

    for (const edge of step.next) {
      const to = edge.to;
      if (!byId.has(to)) {
        warnings.push(`Step '${id}' points to missing step '${to}'.`);
        continue;
      }

      if (!reachable.has(to)) {
        reachable.add(to);
        queue.push(to);
      }
    }
  }

  const dropped = data.steps.filter((step) => !reachable.has(step.id));
  if (dropped.length > 0) {
    warnings.push(`Removed ${dropped.length} disconnected step(s) that were not reachable from '${startId}'.`);
  }

  const filteredSteps = data.steps
    .filter((step) => reachable.has(step.id))
    .map((step) => ({
      ...step,
      next: step.next.filter((edge) => reachable.has(edge.to))
    }));

  for (let i = 0; i < filteredSteps.length; i += 1) {
    const step = filteredSteps[i];

    if (step.type === "end") {
      step.next = [];
      continue;
    }

    if (step.next.length === 0) {
      const nextStep = filteredSteps[i + 1];
      if (nextStep) {
        step.next = [{ to: nextStep.id, label: "Auto" }];
        warnings.push(`Auto-connected '${step.id}' to '${nextStep.id}' to preserve continuity.`);
      } else {
        step.type = "end";
        warnings.push(`Converted '${step.id}' to end node because it had no outgoing connection.`);
      }
    }
  }

  return {
    data: {
      lanes: data.lanes.slice(),
      steps: filteredSteps
    },
    warnings
  };
}

function normalizeNext(nextRaw) {
  if (!Array.isArray(nextRaw)) {
    return [];
  }

  const edges = [];
  nextRaw.forEach((entry) => {
    if (typeof entry === "string") {
      const to = normalizeId(entry);
      if (to) {
        edges.push({ to, label: "" });
      }
      return;
    }

    if (!entry || typeof entry !== "object") {
      return;
    }

    const to = normalizeId(entry.to);
    if (!to) {
      return;
    }

    edges.push({
      to,
      label: typeof entry.label === "string" ? entry.label.trim() : ""
    });
  });

  return edges;
}

function normalizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toSerializable(data) {
  return {
    lanes: data.lanes.slice(),
    steps: data.steps.map((step) => {
      const out = {
        id: step.id,
        label: step.label,
        lane: step.lane,
        type: step.type,
        next: step.next.map((edge) => (edge.label ? { to: edge.to, label: edge.label } : edge.to))
      };

      if (step.stage) {
        out.stage = step.stage;
      }

      return out;
    })
  };
}

function writeJson(data) {
  els.jsonInput.value = JSON.stringify(toSerializable(data), null, 2);
}

function updateSummary(data, title, warnings = [], input = null) {
  const laneSet = new Set(data.steps.map((step) => step.lane));
  const decisionCount = data.steps.filter((step) => step.type === "decision").length;

  const bits = [];
  bits.push(`<div class="summary-item"><strong>${escapeHtml(title)}</strong></div>`);
  bits.push(`<div class="summary-item">Steps: <strong>${data.steps.length}</strong> | Decisions: <strong>${decisionCount}</strong> | Lanes used: <strong>${laneSet.size}</strong></div>`);
  bits.push(`<div class="summary-item">Layout: <strong>${els.layoutMode && els.layoutMode.value === "timeline" ? "Timeline View" : "Parallel View"}</strong></div>`);

  if (input) {
    const pills = [];
    pills.push(`Lead: ${input.leadSource}`);
    pills.push(`Install: ${input.requiresInstall ? "Big Top" : "Customer"}`);
    pills.push(`Engineering: ${input.requiresEngineering ? "Required" : "Not required"}`);
    pills.push(`Terms: ${input.paymentTerms === "net" ? "Net" : "Deposit"}`);
    pills.push(`Quote Rev: ${input.quoteRevisions}`);
    pills.push(`Contract Rev: ${input.contractRevisions}`);
    pills.push(`Eng Rev: ${input.engineeringRevisions}`);
    pills.push(`CAD Rev: ${input.cadRevisions}`);

    bits.push(`<div class="summary-item">${pills.map((item) => `<span class=\"summary-pill\">${escapeHtml(item)}</span>`).join("")}</div>`);
  }

  if (warnings.length > 0) {
    bits.push(`<div class="summary-item"><strong>Warnings:</strong> ${escapeHtml(warnings.join(" | "))}</div>`);
  } else {
    bits.push("<div class=\"summary-item\">All nodes are connected from start and route to completion.</div>");
  }

  els.summary.innerHTML = bits.join("");
}

function formatStatus(prefix, warnings) {
  if (!warnings || warnings.length === 0) {
    return `${prefix}.`;
  }

  return `${prefix}. ${warnings.length} warning(s): ${warnings.join(" | ")}`;
}

function showStatus(text, type) {
  els.status.textContent = text;
  els.status.classList.remove("error", "success");

  if (type === "error" || type === "success") {
    els.status.classList.add(type);
  }
}

function renderLegend() {
  els.legend.innerHTML = "";
  const nodeGroup = document.createElement("div");
  nodeGroup.className = "legend-group";

  const nodeTitle = document.createElement("span");
  nodeTitle.className = "legend-title";
  nodeTitle.textContent = "Node Types";
  nodeGroup.append(nodeTitle);

  ["start", "task", "decision", "document", "milestone", "end"].forEach((key) => {
    const meta = TYPE_META[key];

    const item = document.createElement("span");
    item.className = "legend-item";

    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.textContent = meta.badge;

    const label = document.createElement("span");
    label.textContent = key;

    item.append(dot, label);
    nodeGroup.append(item);
  });

  const edgeGroup = document.createElement("div");
  edgeGroup.className = "legend-group";

  const edgeTitle = document.createElement("span");
  edgeTitle.className = "legend-title";
  edgeTitle.textContent = "Connector Meaning";
  edgeGroup.append(edgeTitle);

  [
    { className: "yes", label: "Yes / Big Top / Net Terms" },
    { className: "no", label: "No / Customer / Deposit" },
    { className: "", label: "Other connector" },
    { className: "dashed", label: "Dashed = revisit/backflow path" }
  ].forEach((entry) => {
    const item = document.createElement("span");
    item.className = "legend-item";

    const line = document.createElement("span");
    line.className = `legend-line${entry.className ? ` ${entry.className}` : ""}`;

    const label = document.createElement("span");
    label.textContent = entry.label;

    item.append(line, label);
    edgeGroup.append(item);
  });

  els.legend.append(nodeGroup, edgeGroup);
}
function render(data) {
  const mode = els.layoutMode ? els.layoutMode.value : "parallel";
  const layout = buildLayout(data, mode);
  drawChart(layout);
}

function buildLayout(data, mode = "parallel") {
  const metrics = {
    laneHeight: 172,
    laneHeaderWidth: 200,
    top: 34,
    bottom: 44,
    colWidth: 272,
    nodeWidth: 194,
    nodeHeight: 80
  };

  const left = metrics.laneHeaderWidth + 36;
  const laneIndex = new Map(data.lanes.map((lane, index) => [lane, index]));
  const stepIndex = new Map(data.steps.map((step, index) => [step.id, index]));

  const stageById = new Map();
  data.steps.forEach((step, index) => {
    if (step.stage) {
      stageById.set(step.id, step.stage);
      return;
    }

    stageById.set(step.id, mode === "timeline" ? index + 1 : 1);
  });

  for (let pass = 0; pass < data.steps.length; pass += 1) {
    let changed = false;

    for (const step of data.steps) {
      const sourceStage = stageById.get(step.id) || 1;
      const sourceIndex = stepIndex.get(step.id) || 0;

      for (const edge of step.next) {
        const targetIndex = stepIndex.get(edge.to);
        if (targetIndex === undefined) {
          continue;
        }

        if (targetIndex > sourceIndex) {
          const candidate = sourceStage + 1;
          const current = stageById.get(edge.to) || 1;
          if (candidate > current) {
            stageById.set(edge.to, candidate);
            changed = true;
          }
        }
      }
    }

    if (!changed) {
      break;
    }
  }

  const uniqueStages = [...new Set(stageById.values())].sort((a, b) => a - b);
  const compact = new Map(uniqueStages.map((value, index) => [value, index + 1]));

  const buckets = new Map();
  const nodes = new Map();
  let maxStage = 1;

  data.steps.forEach((step) => {
    const lanePos = laneIndex.get(step.lane);
    if (lanePos === undefined) {
      return;
    }

    const stage = compact.get(stageById.get(step.id)) || 1;
    maxStage = Math.max(maxStage, stage);

    const key = `${lanePos}:${stage}`;
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }

    buckets.get(key).push(step.id);

    nodes.set(step.id, {
      ...step,
      stage,
      lanePos,
      width: metrics.nodeWidth,
      height: metrics.nodeHeight,
      x: 0,
      y: 0
    });
  });

  let maxBucketSize = 1;
  for (const ids of buckets.values()) {
    maxBucketSize = Math.max(maxBucketSize, ids.length);
  }

  const nodeGap = 96;
  const minimumLaneHeight = Math.ceil((maxBucketSize - 1) * nodeGap + metrics.nodeHeight + 28);
  metrics.laneHeight = Math.max(metrics.laneHeight, minimumLaneHeight);

  for (const [key, ids] of buckets.entries()) {
    const [lanePosText, stageText] = key.split(":");
    const lanePos = Number(lanePosText);
    const stage = Number(stageText);
    const laneCenterY = metrics.top + lanePos * metrics.laneHeight + metrics.laneHeight / 2;

    ids.forEach((id, index) => {
      const node = nodes.get(id);
      node.x = left + (stage - 1) * metrics.colWidth + metrics.colWidth / 2;
      node.y = laneCenterY + spread(index, ids.length, nodeGap);
    });
  }

  const width = left + maxStage * metrics.colWidth + 120;
  const height = metrics.top + data.lanes.length * metrics.laneHeight + metrics.bottom;

  const edges = prepareEdges(data, nodes);

  return {
    data,
    nodes,
    edges,
    metrics,
    left,
    maxStage,
    width,
    height
  };
}

function prepareEdges(data, nodes) {
  const edges = [];

  data.steps.forEach((step) => {
    const source = nodes.get(step.id);
    if (!source) {
      return;
    }

    step.next.forEach((edge) => {
      const target = nodes.get(edge.to);
      if (!target) {
        return;
      }

      edges.push({
        source,
        target,
        label: edge.label || "",
        direction: target.stage >= source.stage ? "fwd" : "back",
        outIndex: 0,
        outTotal: 0,
        inIndex: 0,
        inTotal: 0,
        channelIndex: 0,
        channelTotal: 1
      });
    });
  });

  const outCounts = new Map();
  const inCounts = new Map();

  edges.forEach((edge) => {
    const outKey = `${edge.source.id}:${edge.direction}`;
    const inKey = `${edge.target.id}:${edge.direction}`;

    edge.outIndex = outCounts.get(outKey) || 0;
    edge.inIndex = inCounts.get(inKey) || 0;

    outCounts.set(outKey, edge.outIndex + 1);
    inCounts.set(inKey, edge.inIndex + 1);
  });

  edges.forEach((edge) => {
    edge.outTotal = outCounts.get(`${edge.source.id}:${edge.direction}`) || 1;
    edge.inTotal = inCounts.get(`${edge.target.id}:${edge.direction}`) || 1;
  });

  const channelTotals = new Map();
  edges.forEach((edge) => {
    const key = channelKey(edge);
    channelTotals.set(key, (channelTotals.get(key) || 0) + 1);
  });

  const channelUsed = new Map();
  edges.forEach((edge) => {
    const key = channelKey(edge);
    edge.channelIndex = channelUsed.get(key) || 0;
    edge.channelTotal = channelTotals.get(key) || 1;
    channelUsed.set(key, edge.channelIndex + 1);
  });

  return edges;
}

function channelKey(edge) {
  if (edge.direction === "fwd") {
    const from = Math.min(edge.source.stage, edge.target.stage);
    const to = Math.max(edge.source.stage, edge.target.stage);
    const laneA = Math.min(edge.source.lanePos, edge.target.lanePos);
    const laneB = Math.max(edge.source.lanePos, edge.target.lanePos);
    return `f:${from}->${to}:l${laneA}-${laneB}`;
  }

  return `b:${edge.source.stage}->${edge.target.stage}`;
}

function drawChart(layout) {
  const svg = els.chart;
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  svg.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  svg.setAttribute("width", String(layout.width));
  svg.setAttribute("height", String(layout.height));

  drawDefs(svg);
  drawLanes(svg, layout);
  drawStages(svg, layout);
  drawEdges(svg, layout);
  drawNodes(svg, layout);
}

function drawDefs(svg) {
  const defs = createSvg("defs");
  defs.append(createArrowMarker("arrow-default", "#334155"));
  defs.append(createArrowMarker("arrow-yes", "#166534"));
  defs.append(createArrowMarker("arrow-no", "#b45309"));
  svg.append(defs);
}

function createArrowMarker(id, color) {
  const marker = createSvg("marker", {
    id,
    markerWidth: 10,
    markerHeight: 8,
    refX: 9,
    refY: 4,
    orient: "auto",
    markerUnits: "strokeWidth"
  });

  marker.append(createSvg("path", { d: "M 0 0 L 10 4 L 0 8 z", fill: color }));
  return marker;
}

function drawLanes(svg, layout) {
  layout.data.lanes.forEach((lane, index) => {
    const y = layout.metrics.top + index * layout.metrics.laneHeight;

    svg.append(createSvg("rect", {
      x: 0,
      y,
      width: layout.width,
      height: layout.metrics.laneHeight,
      fill: LANE_COLORS[index % LANE_COLORS.length],
      stroke: "#cbd5e1"
    }));

    svg.append(createSvg("rect", {
      x: 0,
      y,
      width: layout.metrics.laneHeaderWidth,
      height: layout.metrics.laneHeight,
      fill: "rgba(255,255,255,.75)",
      stroke: "#94a3b8"
    }));

    const title = createSvg("text", {
      x: 14,
      y: y + 29,
      class: "lane-title"
    });
    title.textContent = lane;
    svg.append(title);
  });
}

function drawStages(svg, layout) {
  for (let stage = 1; stage <= layout.maxStage; stage += 1) {
    const x = layout.left + (stage - 1) * layout.metrics.colWidth + layout.metrics.colWidth / 2;

    svg.append(createSvg("line", {
      x1: x,
      y1: layout.metrics.top,
      x2: x,
      y2: layout.height - layout.metrics.bottom + 10,
      stroke: "#d4dceb",
      "stroke-dasharray": "5 6"
    }));

    const label = createSvg("text", {
      x: x - 17,
      y: 20,
      fill: "#334155",
      "font-size": 10,
      "font-weight": 600
    });
    label.textContent = `Stage ${stage}`;
    svg.append(label);
  }
}

function drawEdges(svg, layout) {
  const ordered = layout.edges
    .slice()
    .sort((a, b) => {
      if (a.direction !== b.direction) {
        return a.direction === "back" ? -1 : 1;
      }
      return (a.channelTotal - b.channelTotal) || (a.channelIndex - b.channelIndex);
    });

  ordered.forEach((edge) => {
    const route = routeEdge(layout, edge);
    const color = edgeColor(edge.label);
    const markerId = markerIdForEdge(edge);

    const casing = createSvg("path", {
      d: route.path,
      fill: "none",
      stroke: "rgba(255,255,255,0.96)",
      "stroke-width": 5.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });

    const path = createSvg("path", {
      d: route.path,
      fill: "none",
      stroke: color,
      "stroke-width": 2.3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "marker-end": `url(#${markerId})`
    });

    if (edge.direction === "back") {
      casing.setAttribute("stroke-dasharray", "9 6");
      path.setAttribute("stroke-dasharray", "6 4");
    }

    svg.append(casing);
    svg.append(path);

    if (edge.label) {
      drawEdgeLabel(svg, route.labelX, route.labelY, edge.label);
    }
  });
}

function markerIdForEdge(edge) {
  const color = edgeColor(edge.label);
  if (color === "#166534") {
    return "arrow-yes";
  }
  if (color === "#b45309") {
    return "arrow-no";
  }
  return "arrow-default";
}

function drawEdgeLabel(svg, x, y, textValue) {
  const text = String(textValue || "").trim();
  if (!text) {
    return;
  }

  const width = Math.max(22, Math.round(text.length * 6.6 + 10));
  const bg = createSvg("rect", {
    x: Math.round(x - width / 2),
    y: Math.round(y - 10),
    width,
    height: 14,
    rx: 4,
    ry: 4,
    fill: "rgba(255,255,255,0.95)",
    stroke: "#cbd5e1",
    "stroke-width": 1
  });
  svg.append(bg);

  const label = createSvg("text", {
    x: Math.round(x),
    y: Math.round(y),
    class: "edge-label",
    "text-anchor": "middle"
  });
  label.textContent = text;
  svg.append(label);
}

function routeEdge(layout, edge) {
  const source = edge.source;
  const target = edge.target;

  const outOffset = spread(edge.outIndex, edge.outTotal, 16);
  const inOffset = spread(edge.inIndex, edge.inTotal, 16);
  const channelOffset = spread(edge.channelIndex, edge.channelTotal, 20);

  if (edge.direction === "fwd") {
    const sx = source.x + source.width / 2;
    const sy = source.y + outOffset;
    const ex = target.x - target.width / 2;
    const ey = target.y + inOffset;

    if (target.stage === source.stage) {
      const channelX = Math.max(sx, ex) + 62 + channelOffset;
      const points = [
        [sx, sy],
        [channelX, sy],
        [channelX, ey],
        [ex, ey]
      ];

      return {
        path: pathFrom(points),
        labelX: channelX + 8,
        labelY: (sy + ey) / 2 - 6
      };
    }

    const gap = ex - sx;
    let channelX = sx + Math.max(38, gap * 0.45) + channelOffset;
    channelX = Math.min(channelX, ex - 26);
    channelX = Math.max(channelX, sx + 26);

    const points = [
      [sx, sy],
      [channelX, sy],
      [channelX, ey],
      [ex, ey]
      ];

    return {
      path: pathFrom(points),
      labelX: channelX + 8,
      labelY: (sy + ey) / 2 - 6
    };
  }

  const sx = source.x - source.width / 2;
  const sy = source.y + outOffset;
  const ex = target.x - target.width / 2;
  const ey = target.y + inOffset;
  const stageGap = Math.abs(source.stage - target.stage);

  const wrapX = Math.min(sx, ex) - (58 + stageGap * 13 + Math.abs(channelOffset) * 0.6);
  const topY = Math.min(sy, ey) - (78 + edge.channelIndex * 13 + edge.inIndex * 5);

  const points = [
    [sx, sy],
    [wrapX, sy],
    [wrapX, topY],
    [ex - 14, topY],
    [ex - 14, ey],
    [ex, ey]
  ];

  return {
    path: pathFrom(points),
    labelX: wrapX + 10,
    labelY: topY - 6
  };
}
function drawNodes(svg, layout) {
  layout.nodes.forEach((node) => {
    const meta = TYPE_META[node.type] || TYPE_META.task;
    const group = createSvg("g");

    drawNodeShape(group, node, meta);
    drawNodeBadge(group, node, meta);
    drawNodeLabel(group, node.label, node.x, node.y);

    const idText = createSvg("text", {
      x: node.x,
      y: node.y + node.height / 2 - 7,
      class: "node-id",
      "text-anchor": "middle"
    });
    idText.textContent = node.id;
    group.append(idText);

    svg.append(group);
  });
}

function drawNodeShape(group, node, meta) {
  const { x, y, width, height } = node;

  if (meta.shape === "circle") {
    group.append(createSvg("ellipse", {
      cx: x,
      cy: y,
      rx: Math.round(width * 0.3),
      ry: Math.round(height * 0.45),
      fill: meta.fill,
      stroke: meta.stroke,
      "stroke-width": 2
    }));
    return;
  }

  if (meta.shape === "diamond") {
    const points = [
      `${x} ${y - height / 2}`,
      `${x + width / 2} ${y}`,
      `${x} ${y + height / 2}`,
      `${x - width / 2} ${y}`
    ].join(" ");

    group.append(createSvg("polygon", {
      points,
      fill: meta.fill,
      stroke: meta.stroke,
      "stroke-width": 2
    }));
    return;
  }

  if (meta.shape === "hex") {
    const dx = 22;
    const points = [
      `${x - width / 2 + dx} ${y - height / 2}`,
      `${x + width / 2 - dx} ${y - height / 2}`,
      `${x + width / 2} ${y}`,
      `${x + width / 2 - dx} ${y + height / 2}`,
      `${x - width / 2 + dx} ${y + height / 2}`,
      `${x - width / 2} ${y}`
    ].join(" ");

    group.append(createSvg("polygon", {
      points,
      fill: meta.fill,
      stroke: meta.stroke,
      "stroke-width": 2
    }));
    return;
  }

  if (meta.shape === "doc") {
    const left = x - width / 2;
    const right = x + width / 2;
    const top = y - height / 2;
    const bottom = y + height / 2;
    const fold = 15;

    group.append(createSvg("path", {
      d: `M ${left} ${top} L ${right - fold} ${top} L ${right} ${top + fold} L ${right} ${bottom} L ${left} ${bottom} Z M ${right - fold} ${top} L ${right - fold} ${top + fold} L ${right} ${top + fold}`,
      fill: meta.fill,
      stroke: meta.stroke,
      "stroke-width": 2
    }));
    return;
  }

  group.append(createSvg("rect", {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    rx: 12,
    ry: 12,
    fill: meta.fill,
    stroke: meta.stroke,
    "stroke-width": 2
  }));
}

function drawNodeBadge(group, node, meta) {
  const width = Math.max(25, meta.badge.length * 6 + 10);
  const x = Math.round(node.x - width / 2);
  const y = Math.round(node.y - node.height / 2 + 6);

  group.append(createSvg("rect", {
    x,
    y,
    width,
    height: 16,
    rx: 4,
    ry: 4,
    fill: "#ffffff",
    stroke: meta.stroke,
    "stroke-width": 1
  }));

  const text = createSvg("text", {
    x: x + width / 2,
    y: y + 11.5,
    "text-anchor": "middle",
    "font-size": 9,
    "font-weight": 700,
    fill: "#0f172a"
  });
  text.textContent = meta.badge;
  group.append(text);
}

function drawNodeLabel(group, labelText, x, y) {
  const lines = wrapLabel(labelText, 24, 3);
  const blockHeight = (lines.length - 1) * 12;
  let baseline = y - blockHeight / 2 + 8;

  lines.forEach((line) => {
    const text = createSvg("text", {
      x,
      y: baseline,
      class: "node-title",
      "text-anchor": "middle"
    });
    text.textContent = line;
    group.append(text);
    baseline += 12;
  });
}

function wrapLabel(text, maxChars, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines = [];
  let line = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const word = words[i];
    if ((line + " " + word).length <= maxChars) {
      line += " " + word;
    } else {
      lines.push(line);
      line = word;
    }
  }

  lines.push(line);

  if (lines.length > maxLines) {
    const clipped = lines.slice(0, maxLines);
    clipped[maxLines - 1] = `${clipped[maxLines - 1].slice(0, maxChars - 3)}...`;
    return clipped;
  }

  return lines;
}

function edgeColor(label) {
  const normalized = String(label || "").trim().toLowerCase();
  if (normalized === "yes" || normalized === "big top" || normalized === "net terms") {
    return "#166534";
  }

  if (normalized === "no" || normalized === "customer" || normalized === "deposit") {
    return "#b45309";
  }

  return "#334155";
}

function spread(index, total, gap = 12) {
  return (index - (total - 1) / 2) * gap;
}

function pathFrom(points) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${Math.round(point[0])} ${Math.round(point[1])}`)
    .join(" ");
}

function downloadSvg() {
  const svg = els.chart;
  if (!svg.firstChild) {
    showStatus("Render a chart before downloading.", "error");
    return;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  if (!source.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
    source = source.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "big-top-lead-to-cash.svg";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  showStatus("Downloaded SVG.", "success");
}

function createSvg(name, attrs = {}) {
  const element = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

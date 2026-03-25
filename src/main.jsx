import React, { StrictMode, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const hrlLatestCardDetail = {
  title: 'Model Card: High Risk Location (HRL)',
  summaryFields: [
    ['Team', 'ML Products Team'],
    ['Model Name', 'High Risk Location (HRL) Model'],
    ['Model Type', 'Hybrid (Statistical + Bayesian Inference Detection + Rule-based Logic)'],
    ['Owner', 'Ali Jalalifar'],
    ['Peer Reviewers', '[ Get two members from the other team ]'],
    ['Approved by', '[ Team Manager ]'],
    ['Version', '1.0'],
    [
      'Area of Detection',
      'Protect digital platforms from coordinated fraud attacks, multi-accounting abuse, and location-based exploitation by providing real-time risk assessment at the geohash level.',
    ],
    ['Metrics', 'Precision Rate > 80%'],
    ['Innovation Suggestions', '[ Space for farmers to suggest new ideas ]'],
    ['Questions', '[ Space for farmers to ask questions on model ]'],
    ['FARM team sign off (2)', '[ Get two farm members to sign off ]'],
    ['Release team sign off (1)', '[ Get release team to sign off ]'],
  ],
  changeLog: [
    ['Version 1.1', 'TBD'],
    ['Version 1.0', 'Mar 20, 2026'],
  ],
  documentStructure: ['Business Objective and Model Overview', 'Technical Details', 'FAQ'],
  overview: [
    {
      title: '1.1 Purpose and Function',
      body: 'The HRL Model is a multi-layered fraud detection system that identifies geographic locations exhibiting suspicious behavioral anomalies across five distinct risk dimensions. It provides risk assessments at the geohash level to protect platforms from coordinated attacks, multi-accounting, and location-based exploitation.',
    },
    {
      title: '1.2 Business Context',
      body: 'Fraudsters frequently operate from concentrated physical locations to execute systematic platform exploitation, such as identity farms or bonus abuse. This model addresses these challenges by identifying location-based patterns that traditional systems often fail to detect until significant damage has occurred.',
    },
    {
      title: '1.3 Client Coverage',
      body: 'The HRL model is currently deployed across multiple clients with varying levels of integration, including batch and streaming modes. Each client operates with customized thresholds, operator mappings, and detection logic parameters.',
    },
  ],
  clientSummary: [
    ['Total Active Clients', '13'],
    ['Batch Processing', '9 clients'],
    ['Streaming Processing', '7 clients'],
    ['Both Batch + Streaming', '3 clients'],
    ['Total Clients (including POC)', '24'],
  ],
  clientGroups: [
    {
      title: 'Active Clients (Batch + Streaming)',
      columns: ['Client', 'Batch', 'Streaming', 'Status'],
      rows: [
        ['Caesars', 'Yes', 'Yes', 'Operational'],
        ['BetMGM', 'Yes', 'Yes', 'Operational'],
        ['Novig', 'Yes', 'Yes', 'Operational'],
      ],
    },
    {
      title: 'Active Clients (Batch Only)',
      columns: ['Client', 'Batch', 'Streaming', 'Status'],
      rows: [
        ['PointsBet', 'Yes', 'No', 'Operational'],
        ['Luno', 'Yes', 'No', 'Operational'],
        ['Bally Casino', 'Yes', 'No', 'Operational'],
        ['Novibet', 'Yes', 'No', 'Operational'],
        ['Soft2Bet', 'Yes', 'No', 'Operational'],
        ['Kickr', 'Yes', 'No', 'Operational'],
      ],
    },
    {
      title: 'Active Clients (Streaming Only)',
      columns: ['Client', 'Batch', 'Streaming', 'Status'],
      rows: [
        ['HardRock', 'No', 'Yes', 'Operational'],
        ['DraftKings', 'No', 'Yes', 'Operational'],
        ['FanDuel', 'No', 'Yes', 'Operational'],
        ['RushStreet', 'No', 'Yes', 'Operational'],
      ],
    },
    {
      title: 'POC Completed (Not Yet Active)',
      columns: ['Client', 'Batch', 'Streaming', 'Status'],
      rows: [
        ['Mistplay', 'No', 'No', 'POC Completed'],
        ['Betano', 'No', 'No', 'POC Completed'],
        ['Skillz', 'No', 'No', 'POC Completed'],
        ['WPT', 'No', 'No', 'POC Completed'],
        ['Sniit', 'No', 'No', 'POC Completed'],
        ['Sweeper Casino US', 'No', 'No', 'POC Completed'],
        ['Bet99', 'No', 'No', 'POC Completed'],
        ['Moonspin US', 'No', 'No', 'POC Completed'],
        ['Evoke', 'No', 'No', 'POC Completed'],
        ['Intralot', 'No', 'No', 'POC Completed'],
        ['Stake', 'No', 'No', 'POC Completed'],
      ],
    },
  ],
  changeReport: {
    columns: ['Field', 'Value'],
    rows: [
      ['Change Type', 'UNKNOWN VALUE'],
      ['What Changed', 'UNKNOWN VALUE'],
      ['Why', 'UNKNOWN VALUE'],
      ['Expected Impact', 'UNKNOWN VALUE'],
      ['Actual Impact', 'UNKNOWN VALUE'],
      ['Comparison to Previous Version', 'UNKNOWN VALUE'],
    ],
  },
  usage: [
    {
      title: '2.1 Area of Detection',
      body: 'The objective is to identify transactions originating from high-risk geographic locations and detect users or devices associated with suspicious patterns. This allows the business to catch fraud early, reducing the impact of organized fraud rings and automated bot networks.',
    },
    {
      title: '2.2 How It Is Used',
      body: 'The system operates in two modes: a batch pipeline that identifies risky locations for manual review and a streaming mode that flags any new user signing up from a recently identified high-risk location in real time.',
    },
  ],
  outputBands: {
    columns: ['Score Range', 'Interpretation', 'Action'],
    rows: [
      ['0.85 - 1.00', 'High', 'Manual review is recommended'],
      ['0.50 - 0.85', 'Medium', 'Enhanced monitoring is required'],
      ['0.20 - 0.50', 'Low', 'No action or monitor only'],
    ],
  },
  dataInputsText:
    'Inputs include GC transaction records (geohash, user, device), historical blocks, and transaction failure logs.',
  investigativeTables: {
    columns: ['Table Name', 'Description'],
    rows: [
      ['hrl_combined_scores', 'Primary output table with unified risk scores and logic reasons'],
      ['cms_case_notification_v2', 'Client signal log of alerts delivered to clients with HRL tags'],
      ['fraud_groundtruth_entities', 'Confirmed fraud cases used for calibration and validation'],
      [
        'online_high_risk_locations_lb',
        'Real-time table containing geohashes under active 48-hour proactive monitoring',
      ],
    ],
  },
  sqlQueries: [
    {
      title: 'Identify High-Confidence Fraud Clusters',
      code: `SELECT geohash, client, risk_score, primary_reason, new_user_count, timestamp
FROM gc_prod_mlproduct.mlp_high_risk_location.hrl_combined_scores
WHERE risk_score >= 0.85 AND timestamp >= date_sub(current_date(), 7)
ORDER BY risk_score DESC;`,
    },
    {
      title: 'Audit Delivered Client Alerts',
      code: `SELECT username, tag, priority, created_at AS alert_time
FROM gc_prod_mlproduct.mlp_cms_label_store.cms_case_notification_v2
WHERE tag = 'high_risk_location_model' AND created_at >= date_sub(current_date(), 1);`,
    },
    {
      title: 'Cross-Reference Flags with Known Fraud',
      code: `SELECT h.geohash, h.risk_score, gt.label AS known_fraud_type
FROM gc_prod_mlproduct.mlp_high_risk_location.hrl_combined_scores h
JOIN gc_groundtruth.label_data.silver_layer gt ON h.geohash = gt.geohash
WHERE h.risk_score >= 0.50;`,
    },
    {
      title: 'Monitor Proactive Real-Time Traps',
      code: `SELECT geohash, flagged_reason, expiry_timestamp
FROM gc_prod_mlproduct.mlp_high_risk_location.online_high_risk_locations_lb
WHERE expiry_timestamp > current_timestamp();`,
    },
  ],
  lifecycle: [
    ['Environment', 'Databricks (gc-prod)'],
    ['Schedule', 'Daily at 8:00 AM UTC'],
    ['Parallel Detection', 'Signup spikes, block spikes, and financial spikes run concurrently'],
    ['Aggregation', 'risk_scores_task merges dimensions into a final Bayesian score'],
    ['Delivery', 'uhre_submissions_task pushes flagged locations to the review engine via gRPC'],
    ['Config Management', 'Git-versioned YAML files'],
    [
      'Rollback',
      'Revert YAML changes in Git and redeploy the Databricks Asset Bundle (DAB)',
    ],
    ['Update Cadence', 'Sprint-based code cycles with quarterly threshold reviews'],
  ],
  limitations: [
    'The system produces probabilistic scores rather than guaranteed outcomes.',
    'The model can be sensitive to legitimate high-traffic locations such as stadiums.',
    'Concept drift can occur as fraud tactics evolve and is mitigated by Bayesian calibration and 90-day rolling baselines.',
  ],
  technicalCards: [
    [
      'Technical Classification',
      'Hybrid system combining statistical analysis, Bayesian inference, and rule-based logic',
    ],
    [
      'Core Framework',
      'Bayesian adaptive inference blending global priors with location-specific history',
    ],
    [
      'Detection Logic',
      'Five dimensions: sign-up spikes, sustained blocks, failed transaction spikes, login spikes, and deposit or withdrawal spikes',
    ],
    ['Output Type', 'Calibrated probability score from 0 to 1'],
    [
      'Calibration',
      'Quantile-based sigmoid transformation keeps the top 5% of locations above 0.90',
    ],
    [
      'Feature Engineering',
      'Relative spikes, diversity ratios, failure-rate patterns, rolling baselines, adaptive Bayesian blending, and geospatial enrichment',
    ],
    ['Precision Rate', 'Maintained at > 80%'],
    ['Geohash Coverage', 'Over 8 million unique geohashes globally'],
    ['Throughput', 'Over 100 million transactions daily'],
    ['Latency', 'Approximately 10 minutes'],
    ['Geospatial Precision', '7-character geohash (~150m x 150m)'],
    [
      'Infrastructure',
      'Databricks gc-prod using m5d.4xlarge and r5d.4xlarge nodes with Photon acceleration',
    ],
    ['Software Stack', 'PySpark 4.0.1, Delta Lake, and Pydantic'],
    ['Tracking', 'MLflow Run IDs and Experiment IDs (Jira Epic: MLP-2431)'],
    [
      'Auditability',
      'Delta table persistence with write-ahead tracking for gRPC submissions to UHRE',
    ],
  ],
  modelDevelopment: {
    metrics: {
      columns: ['Metric', 'Purpose'],
      rows: [
        ['Precision', 'Measures fraud-detection accuracy and minimizes alert fatigue'],
        ['Recall', 'Measures fraud-case coverage'],
        ['Accuracy', 'Measures overall quality of the model'],
        ['Latency', 'Keeps runtime near the 10-minute target'],
        ['Time to Detection', 'Ensures fraud is surfaced quickly in batch or streaming flows'],
      ],
    },
    validation: [
      '90-day rolling history establishes location-specific baselines.',
      'Aggregated geohash-level statistics are computed at 7-character precision.',
      'Validation uses fraud_groundtruth_entities, historical block data, and transaction logs.',
      'Rolling windows cover 3-day, 7-day, and 90-day periods.',
      'Full feature list and feature importance still require additional information.',
    ],
  },
  impactReport: {
    evaluation: {
      columns: ['Field', 'Value', 'Evaluation Type'],
      rows: [
        ['Start Date', '[Please fill in] Date', 'Shadow / Production'],
        ['End Date', '[Please fill in] Date', 'Shadow / Production'],
        ['Duration', '[Please fill in] Time', 'Shadow / Production'],
        ['Clients Covered', '[Please fill in] Client number', 'Shadow / Production'],
      ],
    },
    summary: [
      ['Transactions Evaluated', '100M+ Daily'],
      ['Alerts Generated', '[ Please Fill in ]'],
      ['Fraud Cases Identified', '[ Please Fill in ]'],
      ['Predicted Business Impact ($)', '[ Please Fill in ]'],
    ],
    metrics: {
      columns: ['Metric', 'Shadow Value', 'Production Value'],
      rows: [
        ['Precision', '[Please fill in]', '> 80%'],
        ['Recall', '[Please fill in]', '[Please fill in]'],
        ['False Positive Rate', '[Please fill in]', '[Please fill in]'],
        ['Daily Volume', '[Please fill in]', '100M+ transactions'],
        ['Latency', '[Please fill in]', '~10 minutes'],
      ],
    },
    breakdown: [
      'Per-client performance: [Please fill in]',
      'Per-region performance: [Please fill in]',
      'Edge-case regression: [Please fill in]',
    ],
    versionChange: {
      columns: ['Field', 'Value'],
      rows: [
        ['Change Type', '[Please fill in] (ex. Latency reduction)'],
        ['What Changed', '[Please fill in] (ex. Daily batch -> hourly batch)'],
        ['Why', '[Please fill in] (ex. Ensure faster detection)'],
        ['Expected Impact', '[Please fill in] (ex. 20% higher recall)'],
        ['Actual Impact', '[Please fill in] (ex. 18% higher recall)'],
        ['Comparison', '[Please fill in] (ex. v1 -> 10% recall; v1.1 -> 28% recall)'],
      ],
    },
  },
  shadowValidation: [
    ['Objective', 'Validate model performance against impact reports in shadow mode'],
    [
      'Validation Method',
      'Compare shadow outputs against impact report metrics using historical data and verify UHRE gRPC outputs with Delta persistence',
    ],
    ['Shadow Period', '[Please fill in]'],
    ['Clients Included', '[Please fill in]'],
    ['Traffic Type', 'Historical Data'],
    ['Data Source', '[Please fill in]'],
    ['Shadow validation completed', 'Yes / No'],
    ['Approved for deployment', 'Yes / No'],
  ],
  monitoring: [
    'Databricks job monitoring tracks scheduled 8:00 AM UTC runs.',
    'Spark runtime metrics cover the approximately 10-minute execution window.',
    'Error monitoring sends job-failure notifications to system owners.',
    'Data quality is protected through Pydantic schema enforcement and Spark DDL casting.',
    'Rollback steps: revert YAML config in Git, redeploy the DAB, optionally pause the pipeline, and validate in preprod before re-enabling production.',
  ],
  topChecklist: [
    ['Precision >= 80%', 'Fulfilled / In progress'],
    ['Recall 60-80%', 'Fulfilled / In progress'],
    ['Accuracy 70-90%', 'Fulfilled / In progress'],
    ['Latency 70th percentile', 'Fulfilled / In progress'],
    ['Time to Detection 65th percentile', 'Fulfilled / In progress'],
  ],
  crossProductValidation: {
    columns: ['Validation Type', 'Description', 'Status'],
    rows: [
      ['UHRE Signal Alignment', 'HRL outputs correctly integrate into UHRE workflows', 'Fulfilled / In progress'],
      ['Cross-Model Consistency', 'Signals align with other fraud models where applicable', 'Fulfilled / In progress'],
      ['Conflict Detection', 'No contradictory signals between systems', 'Fulfilled / In progress'],
      ['Incremental Value', 'HRL provides added detection value versus existing signals', 'Fulfilled / In progress'],
    ],
  },
  dependencies: {
    upstream: {
      columns: ['Dependency', 'Type', 'Description', 'Criticality'],
      rows: [
        ['GC Transaction Pipeline', 'Data Source', 'Core transaction data including geohash, user, and device', 'High'],
        ['Historical Block Data', 'Data Source', 'User and device block records for behavioral risk', 'High'],
        ['Transaction Failure Logs', 'Data Source', 'Failed transaction signals used in detection logic', 'High'],
        ['fraud_groundtruth_entities', 'Truth Table', 'Labeled fraud cases used for calibration and validation', 'High'],
        ['Delta Tables', 'Feature Store', 'Stores aggregated rolling-window and ratio features', 'High'],
        ['Nominatim', 'Enrichment', 'Provides building-type geospatial enrichment', 'Medium'],
      ],
    },
    core: {
      columns: ['Dependency', 'Type', 'Description', 'Criticality'],
      rows: [
        ['Databricks (gc-prod)', 'Compute', 'Executes batch pipelines and model computations', 'High'],
        ['PySpark', 'Engine', 'Handles large-scale data transformations', 'High'],
        ['Delta Lake', 'Storage', 'Manages structured storage and versioning', 'High'],
        ['Pydantic', 'Validation', 'Ensures data quality and schema consistency', 'Medium'],
      ],
    },
    downstream: {
      columns: ['Dependency', 'Type', 'Description', 'Criticality'],
      rows: [
        ['UHRE API', 'API', 'Consumes HRL outputs and triggers actions', 'High'],
        ['CMS', 'Management', 'Receives alerts and supports investigation workflows', 'High'],
        ['cms_case_notification_v2', 'Output Table', 'Stores alerts sent to clients', 'High'],
        ['online_high_risk_locations_lb', 'Real-Time Table', 'Stores active high-risk geohashes for streaming', 'High'],
      ],
    },
    failures: {
      columns: ['Failure Scenario', 'Impact', 'Mitigation'],
      rows: [
        ['Missing upstream data', 'Model cannot compute features and produces no detection', 'Validate data availability before each run'],
        ['Schema mismatch', 'Incorrect scoring or full pipeline failure', 'Enforce schema validation through Pydantic and DDL rules'],
        ['UHRE integration failure', 'Cases are not generated or delivered', 'Monitor downstream delivery and retry'],
        ['Config errors (YAML)', 'Incorrect thresholds or client impact', 'Use version control and rollback procedures'],
        ['Pipeline failure', 'No daily detection output', 'Use job monitoring and alerting'],
      ],
    },
  },
  workflow: {
    daily: [
      'Run the high-risk geohash query for scores >= 0.85.',
      'Review newly flagged locations in hrl_combined_scores.',
      'Validate alerts delivered to clients via cms_case_notification_v2.',
    ],
    weekly: [
      'Analyze medium-risk clusters between 0.50 and 0.85.',
      'Identify repeated geohashes across multiple clients.',
      'Investigate clusters that may indicate coordinated fraud activity.',
    ],
  },
  decisionRules: [
    ['If risk_score >= 0.85', 'Send for immediate manual review'],
    ['If fraud is confirmed', 'Log the case in fraud_groundtruth_entities'],
    ['If false positive', 'Submit feedback for model recalibration'],
    ['If unusual patterns are observed but not flagged', 'Escalate to the ML team for investigation'],
    ['If a client requests customization', 'Check configurability guidance before escalating'],
  ],
  sqlGuidance: [
    'Use the high-confidence fraud query to identify top-risk geohashes.',
    'Use the client-alert audit query to validate alerts sent to clients.',
    'Use the ground-truth cross-reference query to evaluate model accuracy.',
    'Use the real-time trap monitoring query to track active high-risk locations.',
  ],
  collaboration: {
    intro:
      'Collaboration between the FARM and ML teams is critical because it breaks a reactive operating loop, improves transparency, and keeps the model aligned to high-stakes fraud-prevention goals.',
    outcome:
      'Reduced FARM to ML tickets, earlier fraud detection, and tighter alignment on business goals.',
    stakeholders: {
      columns: ['Stakeholder', 'Core Responsibilities and Next Moves'],
      rows: [
        [
          'FARM Team (Expert Direction)',
          'Submit labeled data to fraud_groundtruth_entities, research current outputs via SQL before requesting logic changes, and flag legitimate high-traffic edge cases for exclusion.',
        ],
        [
          'ML Team (Scale and Engine)',
          'Update this model card monthly, communicate upcoming model priorities, and incorporate FARM feedback into Groundtruth while closing the loop with the team.',
        ],
      ],
    },
  },
  labeledData: {
    intro: 'To improve model performance, FARM should provide confirmed fraud cases, false positives, and missed fraud cases.',
    fields: ['geohash', 'user_id / device_id', 'label (fraud / legitimate)', 'reason or context'],
    submission: 'fraud_groundtruth_entities',
  },
  faq: [
    [
      'Can we deploy the model immediately? How long would that take?',
      'The HRL pipeline is already operational for 13 clients. A new client deployment requires YAML configuration that maps the client to its unique data environment.',
    ],
    [
      'What is reconfigurable vs. not?',
      'Configurable: daily thresholds, history windows, monitored location types, and risk score thresholds. Not configurable: the core Bayesian scoring framework and the 7-character geohash resolution.',
    ],
    [
      'What changes are difficult to implement?',
      'Significant structural changes to the modular architecture or upstream dependency model are the hardest changes to implement safely.',
    ],
    [
      'What is the SLA?',
      'The pipeline runs at 8:00 AM UTC with a measured runtime of about 10 minutes.',
    ],
    [
      'What labeled data is required?',
      'The hybrid system relies on historical user and device block records, security error logs, and continuous review feedback to refine calibration.',
    ],
    [
      'What is required for deployment approval?',
      'Validation status must be approved, including formal sign-off from the FARM team and the Release Team.',
    ],
    [
      'What are the next steps in iteration?',
      'The immediate focus is expanding full daily batch processing and broadening platform coverage.',
    ],
    [
      'What labeled data does the team currently need?',
      'The team needs continuous feedback on precision rates and actual manual-review outcomes to refine Bayesian calibration.',
    ],
  ],
};

const models = [
  {
    id: 'deviceguard',
    name: 'deviceguard',
    domain: 'Device Integrity',
    summary:
      'Production directory prepared for governance artifacts and monitoring history.',
    owner: 'Trust Engineering',
    status: 'Inventory only',
    version: null,
    lastReview: null,
    metricsHistory: [],
    modelCards: [],
    docs: null,
  },
  {
    id: 'hrl',
    name: 'HRL',
    domain: 'High Risk Location Detection',
    summary:
      'Classifies sessions with elevated geolocation risk using device, network, and behavioral signals.',
    owner: 'Ali Jalalifar',
    status: 'Active',
    version: '1.0',
    lastReview: '2026-03-20',
    lastUpdated: '2026-03-20',
    approvalStatus: 'Pending sign-off',
    riskTier: 'Tier 1',
    metricsHistory: [
      { month: 'Oct', precision: 0.92, recall: 0.78, auc: 0.94, drift: 0.08 },
      { month: 'Nov', precision: 0.93, recall: 0.8, auc: 0.95, drift: 0.09 },
      { month: 'Dec', precision: 0.94, recall: 0.81, auc: 0.95, drift: 0.11 },
      { month: 'Jan', precision: 0.94, recall: 0.83, auc: 0.96, drift: 0.1 },
      { month: 'Feb', precision: 0.95, recall: 0.84, auc: 0.96, drift: 0.12 },
      { month: 'Mar', precision: 0.95, recall: 0.85, auc: 0.97, drift: 0.1 },
    ],
    modelCards: [
      {
        id: 'v3-4-2',
        version: '1.0',
        releaseDate: '2026-03-20',
        status: 'Current',
        changeSummary:
          'Initial formal governance card for the HRL platform rollout, including technical design, client coverage, monitoring, and deployment controls.',
        approval: 'Pending FARM and Release sign-off',
        detail: hrlLatestCardDetail,
      },
      {
        id: 'v3-3-0',
        version: '0.9',
        releaseDate: '2025-12-08',
        status: 'Archived',
        changeSummary:
          'Added VPN anomaly features and reduced false positives on commuter clusters.',
        approval: 'Approved',
      },
      {
        id: 'v3-1-4',
        version: 'v3.1.4',
        releaseDate: '2025-08-21',
        status: 'Retired',
        changeSummary:
          'Legacy production card retained for audit reference and traceability.',
        approval: 'Superseded',
      },
    ],
    docs: {
      overview:
        'HRL is a supervised classification model used to rank and flag sessions exhibiting signals consistent with spoofed, masked, or otherwise unreliable location behavior. It supports operational review queues and automated controls across regulated markets.',
      purpose:
        'The model is designed to improve detection coverage for high-risk sessions while maintaining analyst efficiency and minimizing unnecessary customer friction.',
      inputs: [
        'Device-level telemetry including emulator indicators, sensor consistency, and device reuse patterns',
        'Network and routing indicators such as proxy probability, ASN reputation, and latency mismatches',
        'Behavioral aggregates including session velocity, repeat location variance, and prior enforcement outcomes',
      ],
      governance: [
        'Primary owner: Risk Science',
        'Second line review: Model Risk Management Committee',
        'Monitoring cadence: Monthly performance review, weekly drift scan',
        'Fallback process: Rule-based review path remains available if monitoring thresholds breach',
      ],
      limitations: [
        'Performance is lower in newly launched jurisdictions with sparse labeled history',
        'Analyst feedback latency can delay label freshness during peak event periods',
        'The model is intended for decision support and controlled automation, not standalone adjudication in all flows',
      ],
    },
  },
  {
    id: 'sharp-bettor',
    name: 'sharp bettor',
    domain: 'Behavioral Segmentation',
    summary:
      'Directory scaffold available for future model cards, approvals, and monitoring artifacts.',
    owner: 'Trading Analytics',
    status: 'Inventory only',
    version: null,
    lastReview: null,
    metricsHistory: [],
    modelCards: [],
    docs: null,
  },
];

function App() {
  const [selectedModelId, setSelectedModelId] = useState('hrl');
  const [selectedCardId, setSelectedCardId] = useState('v3-4-2');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === selectedModelId) ?? models[0],
    [selectedModelId],
  );

  const selectedCard = useMemo(
    () =>
      selectedModel.modelCards.find((card) => card.id === selectedCardId) ??
      selectedModel.modelCards[0] ??
      null,
    [selectedCardId, selectedModel],
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">G</div>
          <div>
            <p className="eyebrow">GeoComply</p>
            <h1>ML Governance Hub</h1>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="section-label">Model Directories</p>
          <div className="directory-list">
            {models.map((model) => {
              const isActive = model.id === selectedModel.id;
              return (
                <button
                  key={model.id}
                  className={`directory-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setSelectedCardId(model.modelCards[0]?.id ?? '');
                  }}
                >
                  <div className="folder-row">
                    <div className="folder-icon" />
                    <span>{model.name}</span>
                  </div>
                  <p>{model.domain}</p>
                  <div className="directory-meta">
                    <span>{model.status}</span>
                    <span>{model.version ?? 'No card yet'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="dashboard">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Governance Workspace</p>
            <h2>{selectedModel.name}</h2>
            <p className="hero-copy">{selectedModel.summary}</p>
            {selectedCard?.detail ? (
              <nav className="workspace-nav" aria-label="Document shortcuts">
                <a className="workspace-nav-link" href="#documentation">
                  Overview
                </a>
                <a className="workspace-nav-link" href="#sql-queries">
                  Queries
                </a>
                <a className="workspace-nav-link" href="#model-dependencies">
                  Dependencies
                </a>
                <a className="workspace-nav-link" href="#deployment-checklist">
                  Check List
                </a>
              </nav>
            ) : null}
          </div>

          <div className="hero-stats">
            <Stat label="Owner" value={selectedModel.owner} />
            <Stat label="Current Version" value={selectedModel.version ?? 'Pending'} />
            <Stat label="Last Review" value={selectedModel.lastReview ?? 'Not available'} />
            <Stat
              label="Approval Status"
              value={selectedModel.approvalStatus ?? 'Documentation pending'}
            />
          </div>
        </section>

        {selectedCard?.detail ? (
          <Panel
            title="Summary"
            subtitle="Core model attributes surfaced upfront for faster review."
          >
            <SummaryOverview items={selectedCard.detail.summaryFields} />
          </Panel>
        ) : null}

        {selectedCard?.detail ? (
          <Panel
            title="FARM And Release Team Sign-Off"
            subtitle="Approval checkpoints surfaced separately for quick review."
          >
            <SignOffOverview items={selectedCard.detail.summaryFields} />
          </Panel>
        ) : null}

        <section className="content-grid">
          <div className="primary-column">
            <Panel
              title="Current Model Snapshot"
              subtitle="Latest governance status, ownership, and operational guardrails."
            >
              {selectedModel.docs ? (
                <div className="snapshot-grid">
                  <InfoTile label="Model Domain" value={selectedModel.domain} />
                  <InfoTile label="Risk Tier" value={selectedModel.riskTier} />
                  <InfoTile label="Version" value={selectedModel.version} />
                  <InfoTile label="Last Updated" value={selectedModel.lastUpdated} />
                </div>
              ) : (
                <EmptyState />
              )}
            </Panel>

            <Panel
              title="Metrics History"
              subtitle="Monthly mock monitoring results for governance review."
            >
              {selectedModel.metricsHistory.length ? (
                <>
                  <MetricsChart data={selectedModel.metricsHistory} />
                  <MetricsTable data={selectedModel.metricsHistory} />
                </>
              ) : (
                <EmptyState />
              )}
            </Panel>
          </div>

          <div className="secondary-column">
            <Panel
              title="Model Cards"
              subtitle="Select a previous card to review version history."
            >
              {selectedModel.modelCards.length ? (
                <div className="card-stack">
                  {selectedModel.modelCards.map((card) => (
                    <button
                      key={card.id}
                      className={`model-card-link ${
                        selectedCard?.id === card.id ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <div>
                        <strong>{card.version}</strong>
                        <p>{card.releaseDate}</p>
                      </div>
                      <span className={`status-pill ${card.status.toLowerCase()}`}>
                        {card.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </Panel>

            <Panel
              title="Selected Card"
              subtitle="Archived governance details for the chosen version."
            >
              {selectedCard ? (
                <div className="selected-card-detail">
                  <div className="selected-card-header">
                    <h3>{selectedCard.version}</h3>
                    <span className="status-pill neutral">{selectedCard.approval}</span>
                  </div>
                  <p>{selectedCard.changeSummary}</p>
                  <dl className="detail-list">
                    <div>
                      <dt>Release Date</dt>
                      <dd>{selectedCard.releaseDate}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{selectedCard.status}</dd>
                    </div>
                    <div>
                      <dt>Approval Trail</dt>
                      <dd>{selectedCard.approval}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <EmptyState />
              )}
            </Panel>
          </div>

            <Panel
              title="Documentation"
              subtitle="Model purpose, inputs, governance notes, and limitations."
              sectionId="documentation"
            >
              {selectedModel.docs ? <Documentation docs={selectedModel.docs} /> : <EmptyState />}
            </Panel>
        </section>

        {selectedCard?.detail ? (
          <Panel
            title={selectedCard.detail.title}
            subtitle="Detailed governance documentation for the selected HRL model card."
          >
            <ModelCardDetail detail={selectedCard.detail} />
          </Panel>
        ) : null}
      </main>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}

function Panel({ title, subtitle, children, sectionId }) {
  return (
    <section className="panel" id={sectionId}>
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Documentation({ docs }) {
  const sections = [
    ['Overview', docs.overview],
    ['Purpose', docs.purpose],
    ['Inputs', docs.inputs],
    ['Governance Controls', docs.governance],
    ['Known Limitations', docs.limitations],
  ];

  return (
    <div className="doc-sections">
      {sections.map(([title, content], index) => (
        <article key={title} className={`doc-card doc-card-${index + 1}`}>
          <div className="doc-card-accent" />
          <h4>{title}</h4>
          {Array.isArray(content) ? (
            <ul>
              {content.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{content}</p>
          )}
        </article>
      ))}
    </div>
  );
}

function MetricsChart({ data }) {
  const chartHeight = 220;
  const stepX = 92;
  const width = stepX * (data.length - 1) + 40;

  const toPoint = (metric) =>
    data
      .map((entry, index) => {
        const x = 20 + index * stepX;
        const y = chartHeight - entry[metric] * 170 - 20;
        return `${x},${y}`;
      })
      .join(' ');

  const driftPoints = data
    .map((entry, index) => {
      const x = 20 + index * stepX;
      const y = chartHeight - entry.drift * 800 - 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <Legend color="var(--accent)" label="Precision" />
        <Legend color="var(--teal)" label="Recall" />
        <Legend color="var(--gold)" label="AUC" />
        <Legend color="var(--red)" label="Drift" />
      </div>
      <svg viewBox={`0 0 ${width} ${chartHeight}`} className="metrics-chart" role="img">
        {[0.2, 0.4, 0.6, 0.8, 1].map((tick) => {
          const y = chartHeight - tick * 170 - 20;
          return <line key={tick} x1="0" y1={y} x2={width} y2={y} className="grid-line" />;
        })}
        <polyline points={toPoint('precision')} className="line precision" />
        <polyline points={toPoint('recall')} className="line recall" />
        <polyline points={toPoint('auc')} className="line auc" />
        <polyline points={driftPoints} className="line drift" />
        {data.map((entry, index) => (
          <g key={entry.month}>
            <text x={20 + index * stepX} y={chartHeight - 2} className="axis-label">
              {entry.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="legend-item">
      <span className="legend-swatch" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function MetricsTable({ data }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>AUC</th>
            <th>Drift</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.month}>
              <td>{entry.month}</td>
              <td>{entry.precision.toFixed(2)}</td>
              <td>{entry.recall.toFixed(2)}</td>
              <td>{entry.auc.toFixed(2)}</td>
              <td>{entry.drift.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModelCardDetail({ detail }) {
  const normalizeDeploymentStatus = (items) =>
    Object.fromEntries(
      items.map(([label, status]) => [
        label,
        status === 'Fulfilled / In progress' ? 'In progress' : status,
      ]),
    );

  const [deploymentStatuses, setDeploymentStatuses] = useState(() =>
    normalizeDeploymentStatus(detail.topChecklist),
  );

  useEffect(() => {
    setDeploymentStatuses(normalizeDeploymentStatus(detail.topChecklist));
  }, [detail]);

  return (
    <div className="model-card-detail">
      <SectionBlock title="Deployment Checklist Status" sectionId="deployment-checklist">
        <p className="section-copy">
          A quick read on launch readiness so stakeholders can see where deployment stands before
          reviewing the full documentation.
        </p>
        <DeploymentChecklist
          items={detail.topChecklist.map(([label]) => [label, deploymentStatuses[label]])}
          onToggle={(label, nextStatus) =>
            setDeploymentStatuses((current) => ({
              ...current,
              [label]: nextStatus,
            }))
          }
        />
      </SectionBlock>

      <SectionBlock title="Summary">
        <KeyValueGrid items={detail.summaryFields} />
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Change Log">
          <DataTable columns={['Version', 'Date']} rows={detail.changeLog} compact />
        </SectionBlock>
        <SectionBlock title="Document Structure">
          <BulletList items={detail.documentStructure} />
        </SectionBlock>
      </div>

      <SectionBlock title="Overview">
        <NarrativeGrid items={detail.overview} />
      </SectionBlock>

      <SectionBlock title="Client Coverage Summary">
        <MetricStrip items={detail.clientSummary} />
      </SectionBlock>

      {detail.clientGroups.map((group) => (
        <SectionBlock key={group.title} title={group.title}>
          <DataTable columns={group.columns} rows={group.rows} />
        </SectionBlock>
      ))}

      <SectionBlock title="Change Report">
        <DataTable columns={detail.changeReport.columns} rows={detail.changeReport.rows} />
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Area of Detection and Usage">
          <NarrativeGrid items={detail.usage} />
        </SectionBlock>
        <SectionBlock title="Model Output and Interpretation">
          <p className="section-copy">
            The model outputs a probability-based risk score from 0 to 1 that maps to business
            actions.
          </p>
          <DataTable columns={detail.outputBands.columns} rows={detail.outputBands.rows} />
        </SectionBlock>
      </div>

      <SectionBlock title="Data and Inputs">
        <p className="section-copy">{detail.dataInputsText}</p>
        <DataTable
          columns={detail.investigativeTables.columns}
          rows={detail.investigativeTables.rows}
        />
      </SectionBlock>

      <SectionBlock title="Example SQL Queries" sectionId="sql-queries">
        <div className="query-grid">
          {detail.sqlQueries.map((query) => (
            <article key={query.title} className="query-card">
              <h4>{query.title}</h4>
              <div className="code-shell">
                <div className="code-shell-bar">
                  <span className="code-dot code-dot-red" />
                  <span className="code-dot code-dot-gold" />
                  <span className="code-dot code-dot-green" />
                  <span className="code-shell-label">SQL</span>
                </div>
                <pre>
                  <code>{query.code}</code>
                </pre>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Deployment and Lifecycle">
          <KeyValueGrid items={detail.lifecycle} />
        </SectionBlock>
        <SectionBlock title="Limitations and Considerations">
          <BulletList items={detail.limitations} />
        </SectionBlock>
      </div>

      <SectionBlock title="Technical Details and Deployment">
        <KeyValueGrid items={detail.technicalCards} />
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Model Development Metrics">
          <DataTable
            columns={detail.modelDevelopment.metrics.columns}
            rows={detail.modelDevelopment.metrics.rows}
          />
        </SectionBlock>
        <SectionBlock title="Validation Setup">
          <BulletList items={detail.modelDevelopment.validation} />
        </SectionBlock>
      </div>

      <SectionBlock title="Impact and Evaluation Report">
        <div className="stacked-detail-sections">
          <DataTable
            columns={detail.impactReport.evaluation.columns}
            rows={detail.impactReport.evaluation.rows}
          />
          <MetricStrip items={detail.impactReport.summary} />
          <DataTable
            columns={detail.impactReport.metrics.columns}
            rows={detail.impactReport.metrics.rows}
          />
          <BulletList items={detail.impactReport.breakdown} />
          <DataTable
            columns={detail.impactReport.versionChange.columns}
            rows={detail.impactReport.versionChange.rows}
          />
        </div>
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Shadow Validation">
          <KeyValueGrid items={detail.shadowValidation} />
        </SectionBlock>
        <SectionBlock title="Production Monitoring and Operations">
          <BulletList items={detail.monitoring} />
        </SectionBlock>
      </div>

      <SectionBlock title="Cross-Product Validation">
        <DataTable
          columns={detail.crossProductValidation.columns}
          rows={detail.crossProductValidation.rows}
        />
      </SectionBlock>

      <SectionBlock title="Model Dependencies" sectionId="model-dependencies">
        <div className="stacked-detail-sections">
          <h4>Upstream Dependencies</h4>
          <DataTable
            columns={detail.dependencies.upstream.columns}
            rows={detail.dependencies.upstream.rows}
          />
          <h4>Core Processing Dependencies</h4>
          <DataTable columns={detail.dependencies.core.columns} rows={detail.dependencies.core.rows} />
          <h4>Downstream Dependencies</h4>
          <DataTable
            columns={detail.dependencies.downstream.columns}
            rows={detail.dependencies.downstream.rows}
          />
          <h4>Failure Impact Mapping</h4>
          <DataTable
            columns={detail.dependencies.failures.columns}
            rows={detail.dependencies.failures.rows}
          />
        </div>
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Daily and Weekly Workflow">
          <h4>Daily</h4>
          <BulletList items={detail.workflow.daily} />
          <div className="subsection-spacer" />
          <h4>Weekly</h4>
          <BulletList items={detail.workflow.weekly} />
        </SectionBlock>
        <SectionBlock title="Decision Rules and SQL Guidance">
          <DataTable columns={['Rule', 'Action']} rows={detail.decisionRules} />
          <div className="subsection-spacer" />
          <h4>SQL Usage Guidance</h4>
          <BulletList items={detail.sqlGuidance} />
        </SectionBlock>
      </div>

      <SectionBlock title="Feedback and Collaboration">
        <p className="section-copy">{detail.collaboration.intro}</p>
        <p className="section-copy section-copy-strong">{detail.collaboration.outcome}</p>
        <DataTable
          columns={detail.collaboration.stakeholders.columns}
          rows={detail.collaboration.stakeholders.rows}
        />
      </SectionBlock>

      <div className="detail-two-column">
        <SectionBlock title="Required Labeled Data">
          <p className="section-copy">{detail.labeledData.intro}</p>
          <BulletList items={detail.labeledData.fields} />
          <p className="section-copy">
            Submission location: <strong>{detail.labeledData.submission}</strong>
          </p>
        </SectionBlock>
        <SectionBlock title="FAQ">
          <FAQList items={detail.faq} />
        </SectionBlock>
      </div>
    </div>
  );
}

function SectionBlock({ title, children, sectionId }) {
  return (
    <section className="detail-section" id={sectionId}>
      <div className="detail-section-header">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function KeyValueGrid({ items }) {
  return (
    <div className="key-value-grid">
      {items.map(([label, value]) => (
        <div key={label} className="key-value-card">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function SummaryOverview({ items }) {
  const priorityLabels = new Set([
    'Team',
    'Model Name',
    'Model Type',
    'Owner',
    'Version',
    'Metrics',
  ]);

  const highlightItem = items.find(([label]) => label === 'Area of Detection');
  const signOffLabels = new Set(['FARM team sign off (2)', 'Release team sign off (1)']);
  const priorityItems = items.filter(
    ([label]) => priorityLabels.has(label) && label !== 'Area of Detection',
  );
  const secondaryItems = items.filter(
    ([label]) =>
      !priorityLabels.has(label) &&
      label !== 'Area of Detection' &&
      !signOffLabels.has(label),
  );

  return (
    <div className="summary-overview">
      <div className="summary-primary-grid">
        {priorityItems.map(([label, value]) => (
          <article key={label} className="summary-primary-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      {highlightItem ? (
        <article className="summary-spotlight">
          <span>{highlightItem[0]}</span>
          <p>{highlightItem[1]}</p>
        </article>
      ) : null}

      <div className="summary-secondary-list">
        {secondaryItems.map(([label, value]) => (
          <article key={label} className="summary-secondary-item">
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function SignOffOverview({ items }) {
  const signOffLabels = new Set(['FARM team sign off (2)', 'Release team sign off (1)']);
  const signOffItems = items.filter(([label]) => signOffLabels.has(label));

  return (
    <div className="summary-secondary-list signoff-grid">
      {signOffItems.map(([label, value]) => (
        <article key={label} className="summary-secondary-item signoff-item">
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}

function MetricStrip({ items }) {
  return (
    <div className="metric-strip">
      {items.map(([label, value]) => (
        <div key={label} className="metric-pill">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function NarrativeGrid({ items }) {
  return (
    <div className="narrative-grid">
      {items.map((item) => (
        <article key={item.title} className="narrative-card">
          <h4>{item.title}</h4>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function DataTable({ columns, rows, compact = false }) {
  return (
    <div className={`data-table-wrap ${compact ? 'compact' : ''}`}>
      <table className="detail-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function FAQList({ items }) {
  return (
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <article key={question} className="faq-item">
          <h4>{question}</h4>
          <p>{answer}</p>
        </article>
      ))}
    </div>
  );
}

function DeploymentChecklist({ items, onToggle }) {
  return (
    <div className="deployment-checklist">
      {items.map(([label, status]) => (
        <div key={label} className="deployment-item">
          <div className="deployment-copy">
            <strong>{label}</strong>
            <span>{status}</span>
          </div>
          <div className="status-radio-group" role="radiogroup" aria-label={`${label} status`}>
            <button
              type="button"
              role="radio"
              aria-checked={status === 'In progress'}
              className={`status-radio ${status === 'In progress' ? 'selected' : ''}`}
              onClick={() => status !== 'In progress' && onToggle(label, 'In progress')}
            >
              <span className="status-radio-dot" />
              <span>In progress</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={status === 'Fulfilled'}
              className={`status-radio ${status === 'Fulfilled' ? 'selected' : ''}`}
              onClick={() => status !== 'Fulfilled' && onToggle(label, 'Fulfilled')}
            >
              <span className="status-radio-dot" />
              <span>Fulfilled</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function statusClassName(status) {
  const normalized = status.toLowerCase();
  if (normalized === 'completed') return 'current';
  if (normalized === 'in progress') return 'archived';
  if (normalized === 'fulfilled') return 'current';
  return 'retired';
}

function EmptyState() {
  return (
    <div className="empty-state">
      <p>Directory scaffold ready. Governance artifacts can be added when documentation is available.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

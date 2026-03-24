export const models = [
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
    name: 'hrl',
    domain: 'High Risk Location Detection',
    summary:
      'Classifies sessions with elevated geolocation risk using device, network, and behavioral signals.',
    owner: 'Risk Science',
    status: 'Active',
    version: 'v3.4.2',
    lastReview: '2026-02-18',
    lastUpdated: '2026-03-12',
    approvalStatus: 'Approved with monitoring',
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
        version: 'v3.4.2',
        releaseDate: '2026-03-12',
        status: 'Current',
        changeSummary:
          'Recalibrated thresholds for APAC traffic and refreshed training labels through February 2026.',
        approval: 'MRMC approved',
      },
      {
        id: 'v3-3-0',
        version: 'v3.3.0',
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

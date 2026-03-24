const { useMemo, useState } = React;

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

function App() {
  const [selectedModelId, setSelectedModelId] = useState('hrl');
  const [selectedCardId, setSelectedCardId] = useState('v3-4-2');

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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">G</div>
          <div>
            <p className="eyebrow">GeoComply</p>
            <h1>Model Governance</h1>
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

            <Panel
              title="Documentation"
              subtitle="Model purpose, inputs, governance notes, and limitations."
            >
              {selectedModel.docs ? (
                <Documentation docs={selectedModel.docs} />
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
        </section>
      </main>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="panel">
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
  return (
    <div className="doc-sections">
      <article>
        <h4>Overview</h4>
        <p>{docs.overview}</p>
      </article>
      <article>
        <h4>Purpose</h4>
        <p>{docs.purpose}</p>
      </article>
      <article>
        <h4>Inputs</h4>
        <ul>
          {docs.inputs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article>
        <h4>Governance Controls</h4>
        <ul>
          {docs.governance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article>
        <h4>Known Limitations</h4>
        <ul>
          {docs.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
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

function EmptyState() {
  return (
    <div className="empty-state">
      <p>Directory scaffold ready. Governance artifacts can be added when documentation is available.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

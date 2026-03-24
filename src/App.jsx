import { useMemo, useState } from 'react';
import { models } from './mockData';

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

export default App;

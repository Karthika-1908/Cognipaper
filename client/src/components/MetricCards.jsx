
import { PapersIcon, CheckIcon, CompareIcon, InfoIcon } from './Icons';

export const MetricCards = ({
  totalPapers,
  samplePapersCount,
  userPapersCount,
  analyzedCount,
  comparisonsCount = 2,
  onSelectTab,
}) => {
  return (
    <section className="metrics-grid" aria-label="Research Metrics Overview">
      {/* Metric 1: Total Papers */}
      <div className="metric-card metric-card-total">
        <div className="metric-header">
          <div className="metric-icon-box cyan-soft">
            <PapersIcon size={18} />
          </div>
          <span className="metric-label">TOTAL PAPERS</span>
        </div>
        <div className="metric-value-row">
          <span className="metric-number">{totalPapers}</span>
          <span className="metric-unit">DOCS</span>
        </div>
        <div className="metric-breakdown">
          <div className="breakdown-tag sample-tag">
            <span className="dot sample-dot"></span>
            <span>{samplePapersCount} Sample Benchmarks</span>
          </div>
          {userPapersCount > 0 ? (
            <div className="breakdown-tag user-tag">
              <span className="dot user-dot"></span>
              <span>{userPapersCount} User Upload{userPapersCount > 1 ? 's' : ''}</span>
            </div>
          ) : (
            <span className="metric-subtext">Drop your PDF below to ingest</span>
          )}
        </div>
      </div>

      {/* Metric 2: Papers Analyzed */}
      <div className="metric-card metric-card-analyzed">
        <div className="metric-header">
          <div className="metric-icon-box lime-soft">
            <CheckIcon size={18} />
          </div>
          <span className="metric-label">PAPERS ANALYZED</span>
        </div>
        <div className="metric-value-row">
          <span className="metric-number">{analyzedCount}</span>
          <span className="metric-unit">VERIFIED</span>
        </div>
        <div className="metric-status-box">
          <div className="metric-status-item">
            <span className="status-badge sample-badge">VERIFIED SAMPLE DATA</span>
            <span className="metric-note">Full embedding &amp; benchmark extraction complete</span>
          </div>
          {userPapersCount > 0 && (
            <div className="metric-status-warning" title="Backend offline">
              <InfoIcon size={13} />
              <span>{userPapersCount} uploaded file awaiting Gemini backend</span>
            </div>
          )}
        </div>
      </div>

      {/* Metric 3: Comparisons */}
      <div className="metric-card metric-card-comparisons">
        <div className="metric-header">
          <div className="metric-icon-box slate-soft">
            <CompareIcon size={18} />
          </div>
          <span className="metric-label">COMPARATIVE SYNTHESES</span>
        </div>
        <div className="metric-value-row">
          <span className="metric-number">{comparisonsCount}</span>
          <span className="metric-unit">MATRICES</span>
        </div>
        <div className="metric-compare-preview">
          <button
            type="button"
            className="metric-link-btn"
            onClick={() => onSelectTab('compare')}
          >
            <span>Open 3-way Architecture Matrix</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
          <span className="metric-subtext">Transformer vs. ResNet vs. RAG</span>
        </div>
      </div>
    </section>
  );
};

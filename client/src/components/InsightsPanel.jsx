
import { InfoIcon, ArrowRightIcon } from './Icons';

export const InsightsPanel = ({ onSelectTab }) => {
  return (
    <aside className="insights-panel" aria-label="Synthesis Insights and Cross-Literature Correlations">
      {/* Panel Top Header */}
      <div className="insights-header">
        <div className="insights-tag">
          <span className="insights-dot"></span>
          <span className="insights-tag-label">NEURAL LAB SYNTHESIS</span>
        </div>
        <h3 className="insights-heading">Cross-Paper Intelligence</h3>
      </div>

      {/* Main Insight Editorial Block */}
      <div className="insight-feature-block">
        <span className="feature-kicker">ARCHITECTURAL CONVERGENCE</span>
        <h4 className="feature-title">
          The Path from Residual Shortcuts to Self-Attention Foundations
        </h4>
        <p className="feature-text">
          Synthesizing <em>He et al. (2015)</em> with <em>Vaswani et al. (2017)</em> reveals that
          Transformer layer normalization and multi-head attention rely crucially on the residual identity
          mapping formulation:
        </p>
        <div className="feature-formula" role="note" aria-label="Residual layer formula">
          <code>LayerOutput = LayerNorm(x + Sublayer(x))</code>
        </div>
        <p className="feature-subtext">
          Without He et al.’s identity bypass discovery, deep Transformer stacks (&gt;12 layers) suffer
          from catastrophic gradient attenuation during backpropagation.
        </p>
      </div>

      {/* Concept Cluster Frequency Breakdown */}
      <div className="cluster-frequency-block">
        <span className="cluster-label">ACTIVE LITERATURE CLUSTERS</span>
        <div className="cluster-bars">
          <div className="cluster-item">
            <div className="cluster-info">
              <span className="cluster-name">Self-Attention &amp; Transformers</span>
              <span className="cluster-pct">45%</span>
            </div>
            <div className="cluster-track">
              <div className="cluster-fill fill-cyan" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="cluster-item">
            <div className="cluster-info">
              <span className="cluster-name">Residual Optimization &amp; CNNs</span>
              <span className="cluster-pct">35%</span>
            </div>
            <div className="cluster-track">
              <div className="cluster-fill fill-lime" style={{ width: '35%' }}></div>
            </div>
          </div>

          <div className="cluster-item">
            <div className="cluster-info">
              <span className="cluster-name">Dense Retrieval &amp; MIPS Indexing</span>
              <span className="cluster-pct">20%</span>
            </div>
            <div className="cluster-track">
              <div className="cluster-fill fill-slate" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="insights-footer">
        <button
          type="button"
          className="insights-matrix-btn"
          onClick={() => onSelectTab('compare')}
        >
          <span>Explore 3-way Comparative Matrix</span>
          <ArrowRightIcon size={14} />
        </button>
        <div className="insights-disclaimer">
          <InfoIcon size={12} />
          <span>Synthesis derived from indexed sample literature.</span>
        </div>
      </div>
    </aside>
  );
};

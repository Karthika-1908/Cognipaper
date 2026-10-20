import { useState } from 'react';
import { NeuralConstellation } from './NeuralConstellation';
import { LogoIcon, ArrowRightIcon, NetworkIcon, InfoIcon, CloseIcon } from './Icons';

export const Hero = ({
  onExplorePaper,
  onOpenResearchMap,
  backendStatus = { isOnline: false, statusText: 'Local Client', engine: 'Gemini 1.5 Pro' },
  isStatusModalOpen,
  onToggleStatusModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const showModal = isStatusModalOpen !== undefined ? isStatusModalOpen : internalModalOpen;
  const setModalOpen = onToggleStatusModal || setInternalModalOpen;

  return (
    <header className="research-hero" aria-label="Research Intelligence Introduction">
      {/* Background ambient mesh and coordinates */}
      <div className="hero-grid-ambient" aria-hidden="true"></div>

      <div className="hero-content-wrapper">
        {/* Top Brand Bar inside Hero */}
        <div className="hero-top-band">
          <div className="hero-brand">
            <LogoIcon size={32} />
            <div className="brand-text-group">
              <span className="brand-title">Cognipaper</span>
              <span className="brand-badge">NEURAL RESEARCH LAB</span>
            </div>
          </div>

          {/* Honest System Status Treatment */}
          <button
            type="button"
            className="hero-system-status"
            onClick={() => setModalOpen(true)}
            title="Inspect backend connectivity status"
            aria-label="System status: Offline. Click to inspect backend parameters"
          >
            <span className="status-indicator-dot offline" aria-hidden="true"></span>
            <span className="status-text">
              NODE STATUS: <strong className="status-highlight">{backendStatus.statusText.toUpperCase()}</strong>
            </span>
            <span className="status-pill">OFFLINE</span>
          </button>
        </div>

        {/* Hero Main Body: Split into Editorial Content and Constellation */}
        <div className="hero-body-grid">
          <div className="hero-text-column">
            {/* Small uppercase eyebrow */}
            <div className="hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span className="eyebrow-text">RESEARCH INTELLIGENCE SYSTEM</span>
            </div>

            {/* Large editorial headline */}
            <h1 className="hero-headline">
              Think deeper.
              <br />
              <span className="headline-italic">Discover what connects.</span>
            </h1>

            {/* Supporting text */}
            <p className="hero-description">
              Autonomous cross-literature synthesis, topological concept mapping, and multi-document
              comparative intelligence. Analyze preprints, verify citations, and discover hidden correlations
              at the speed of thought.
            </p>

            {/* Actions: Primary & Secondary */}
            <div className="hero-actions">
              <button
                type="button"
                className="btn-lime hero-btn-primary"
                onClick={onExplorePaper}
                id="hero-explore-btn"
              >
                <span>Explore a paper</span>
                <ArrowRightIcon size={16} />
              </button>

              <button
                type="button"
                className="btn-cyan-outline hero-btn-secondary"
                onClick={onOpenResearchMap}
                id="hero-map-btn"
              >
                <NetworkIcon size={16} />
                <span>Research map</span>
              </button>
            </div>

            {/* Hero Micro-Telemetry Strip */}
            <div className="hero-telemetry-strip" aria-label="Platform telemetry">
              <div className="telemetry-item">
                <span className="tel-label">ANALYSIS ENGINE</span>
                <span className="tel-val">Gemini 1.5 Pro</span>
              </div>
              <div className="telemetry-separator">/</div>
              <div className="telemetry-item">
                <span className="tel-label">INDEXED LATENTS</span>
                <span className="tel-val">3 Milestone Papers</span>
              </div>
              <div className="telemetry-separator">/</div>
              <div className="telemetry-item">
                <span className="tel-label">TOPOLOGY</span>
                <span className="tel-val">Concept Graph v4</span>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Neural Constellation */}
          <div className="hero-visualization-column">
            <NeuralConstellation />
          </div>
        </div>
      </div>

      {/* Backend Status Details Modal */}
      {showModal && (
        <div className="status-modal-backdrop" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="status-modal-title">
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <InfoIcon size={20} className="modal-icon-cyan" />
                <h3 id="status-modal-title">System Status &amp; Integration Diagnostics</h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close status dialog"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="diagnostic-row">
                <span className="diag-key">Frontend Client:</span>
                <span className="diag-val diag-ok">Online (React 19 + Vite HMR)</span>
              </div>
              <div className="diagnostic-row">
                <span className="diag-key">AI Backend Server:</span>
                <span className="diag-val diag-offline">
                  Disconnected (No active API server detected on localhost)
                </span>
              </div>
              <div className="diagnostic-row">
                <span className="diag-key">Gemini Neural Engine:</span>
                <span className="diag-val diag-warn">Awaiting GEMINI_API_KEY / Server route</span>
              </div>
              <div className="diagnostic-row">
                <span className="diag-key">Client Storage &amp; Cache:</span>
                <span className="diag-val diag-ok">Active (Local document buffer)</span>
              </div>

              <div className="diagnostic-notice">
                <strong>Integrity Policy:</strong> Cognipaper never fabricates AI analysis or generates hallucinated
                citations. Sample papers are pre-synthesized from verified peer-reviewed publications. Uploaded papers
                will remain in <em>Local File • Pending Analysis</em> status until an authentic backend endpoint is configured.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-lime modal-dismiss-btn"
                onClick={() => setModalOpen(false)}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import { useEffect } from 'react';
import { CloseIcon, CheckIcon, InfoIcon, CompareIcon, QuestionIcon } from './Icons';

export const PaperDetailModal = ({
  paper,
  onClose,
  onCompare,
  onAskAssistant,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!paper) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paper-detail-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="modal-header">
          <div className="modal-badges-group">
            {paper.isSample ? (
              <span className="academic-badge badge-analyzed">
                <CheckIcon size={12} />
                <span>Sample Data • Analyzed</span>
              </span>
            ) : (
              <span className="academic-badge badge-pending">
                <InfoIcon size={12} />
                <span>Uploaded File • Pending Analysis</span>
              </span>
            )}
            <span className="modal-cat-tag">{paper.category}</span>
          </div>

          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Paper Title & Authors */}
        <div className="modal-title-area">
          <h2 id="paper-detail-title" className="modal-paper-title">
            {paper.title}
          </h2>
          <p className="modal-paper-authors">
            {paper.authors ? paper.authors.join(', ') : 'Unknown Authors'}
          </p>
          <div className="modal-specs-strip">
            <span><strong>Venue:</strong> {paper.venue}</span>
            <span>•</span>
            <span><strong>Year:</strong> {paper.year}</span>
            <span>•</span>
            <span><strong>Pages:</strong> {paper.pages}</span>
            <span>•</span>
            <span><strong>File size:</strong> {paper.fileSize}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-scroll-body">
          {!paper.isAnalyzed && (
            <div className="pending-analysis-box" role="status">
              <div className="pending-box-header">
                <InfoIcon size={16} />
                <h3>Analysis Ready</h3>
              </div>
              <p>
                This PDF is staged in your library. Once connected to the Gemini backend,
                automated extraction will populate the structured problem statement, methodology,
                and empirical findings below.
              </p>
            </div>
          )}

          {/* Abstract */}
          <section className="modal-section">
            <h3 className="modal-section-title">Summary &amp; Objectives</h3>
            <p className="modal-text">{paper.summary}</p>
          </section>

          {/* Key Findings */}
          {paper.keyFindings && (
            <section className="modal-section">
              <h3 className="modal-section-title">Key Scientific Contributions</h3>
              <ul className="modal-bullet-list">
                {paper.keyFindings.map((finding, idx) => (
                  <li key={idx}>
                    <span className="bullet" aria-hidden="true">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Methodology */}
          {paper.methodology && (
            <section className="modal-section">
              <h3 className="modal-section-title">Methodology</h3>
              <p className="modal-text">{paper.methodology}</p>
            </section>
          )}

          {/* Limitations */}
          {paper.comparisonData?.limitations && (
            <section className="modal-section">
              <h3 className="modal-section-title">Limitations &amp; Constraints</h3>
              <p className="modal-text text-limitations">
                {paper.comparisonData.limitations}
              </p>
            </section>
          )}

          {/* Empirical Benchmarks */}
          {paper.benchmarks && (
            <section className="modal-section">
              <h3 className="modal-section-title">Empirical Results</h3>
              <div className="benchmarks-table-wrap">
                <table className="benchmarks-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(paper.benchmarks).map(([k, v]) => (
                      <tr key={k}>
                        <td className="metric-name">{k}</td>
                        <td className="metric-result">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              onClose();
              onCompare(paper);
            }}
          >
            <CompareIcon size={15} />
            <span>Compare research</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose();
              onAskAssistant(paper);
            }}
          >
            <QuestionIcon size={15} />
            <span>Ask questions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

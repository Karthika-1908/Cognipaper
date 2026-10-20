import { useState } from 'react';
import { CheckIcon, InfoIcon, CloseIcon } from './Icons';

export const CompareView = ({
  papers,
  selectedPaperIds = [],
  onToggleSelectPaper,
  onInspectPaper,
}) => {
  const initialSelected =
    selectedPaperIds.length >= 2
      ? selectedPaperIds
      : papers.slice(0, 2).map((p) => p.id);

  const [activeIds, setActiveIds] = useState(initialSelected);

  const handleToggle = (id) => {
    let next;
    if (activeIds.includes(id)) {
      if (activeIds.length <= 1) return; // Keep at least one paper
      next = activeIds.filter((item) => item !== id);
    } else {
      if (activeIds.length >= 3) {
        // Limit to 3 columns for optimal side-by-side readability
        next = [...activeIds.slice(1), id];
      } else {
        next = [...activeIds, id];
      }
    }
    setActiveIds(next);
    if (onToggleSelectPaper) {
      onToggleSelectPaper(next);
    }
  };

  const selectedPapers = papers.filter((p) => activeIds.includes(p.id));

  return (
    <div className="compare-view-container" aria-label="Compare Research Papers">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Compare Papers</h1>
          <p className="page-subtitle">
            Compare research approaches, methods, empirical results, and limitations across papers.
          </p>
        </div>
      </div>

      {/* Paper Selection Bar */}
      <div className="compare-selection-card">
        <span className="selector-instruction">Select papers to compare (choose up to 3):</span>
        <div className="selector-pills-row">
          {papers.map((paper) => {
            const isSelected = activeIds.includes(paper.id);
            return (
              <button
                key={paper.id}
                type="button"
                className={`compare-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggle(paper.id)}
                aria-pressed={isSelected}
              >
                <span className="pill-check-icon">
                  {isSelected ? <CheckIcon size={12} /> : '+'}
                </span>
                <span className="pill-title">{paper.title}</span>
                <span className={`pill-type-badge ${paper.isSample ? 'badge-sample' : 'badge-user'}`}>
                  {paper.isSample ? 'Analyzed' : 'Uploaded'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="matrix-card">
        <div className="matrix-overflow">
          <table className="academic-table">
            <thead>
              <tr>
                <th className="dim-column">Comparison Dimension</th>
                {selectedPapers.map((paper) => (
                  <th key={paper.id} className="paper-column">
                    <div className="th-paper-header">
                      <div className="th-badges">
                        {paper.isSample ? (
                          <span className="academic-badge badge-analyzed">
                            <CheckIcon size={11} />
                            <span>Sample Data</span>
                          </span>
                        ) : (
                          <span className="academic-badge badge-pending">
                            <InfoIcon size={11} />
                            <span>Uploaded File</span>
                          </span>
                        )}
                        <span className="th-year">{paper.year}</span>
                      </div>

                      <h3
                        className="th-title"
                        onClick={() => onInspectPaper && onInspectPaper(paper)}
                      >
                        {paper.title}
                      </h3>
                      <p className="th-authors">
                        {paper.authors ? paper.authors.slice(0, 2).join(', ') : 'Unknown'}
                        {paper.authors && paper.authors.length > 2 ? ' et al.' : ''}
                      </p>

                      {selectedPapers.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-column"
                          onClick={() => handleToggle(paper.id)}
                          aria-label={`Remove ${paper.title} from comparison`}
                          title="Remove column"
                        >
                          <CloseIcon size={13} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Row 1: Core Innovation */}
              <tr>
                <td className="dim-cell">
                  <strong>Core Innovation</strong>
                  <span className="dim-sub">Primary breakthrough &amp; thesis</span>
                </td>
                {selectedPapers.map((paper) => (
                  <td key={paper.id} className="data-cell">
                    {paper.isAnalyzed ? (
                      <p>{paper.comparisonData.innovation}</p>
                    ) : (
                      <div className="pending-cell-box">
                        <span className="pending-badge">Pending Analysis</span>
                        <p>Awaiting automated analysis run.</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 2: Architecture & Methodology */}
              <tr>
                <td className="dim-cell">
                  <strong>Methodology &amp; Architecture</strong>
                  <span className="dim-sub">Underlying technical design</span>
                </td>
                {selectedPapers.map((paper) => (
                  <td key={paper.id} className="data-cell">
                    {paper.isAnalyzed ? (
                      <p>{paper.comparisonData.architecture}</p>
                    ) : (
                      <div className="pending-cell-box">
                        <span className="pending-badge">Pending Analysis</span>
                        <p>Architecture details will appear after analysis.</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 3: Computational Complexity */}
              <tr>
                <td className="dim-cell">
                  <strong>Complexity &amp; Scaling</strong>
                  <span className="dim-sub">Compute and memory bounds</span>
                </td>
                {selectedPapers.map((paper) => (
                  <td key={paper.id} className="data-cell">
                    {paper.isAnalyzed ? (
                      <code className="academic-code">
                        {paper.comparisonData.computationalComplexity}
                      </code>
                    ) : (
                      <div className="pending-cell-box">
                        <span className="pending-badge">Pending Analysis</span>
                        <p>Complexity profiling pending.</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 4: Primary Benchmark */}
              <tr>
                <td className="dim-cell">
                  <strong>Primary Results</strong>
                  <span className="dim-sub">Evaluation benchmarks</span>
                </td>
                {selectedPapers.map((paper) => (
                  <td key={paper.id} className="data-cell">
                    {paper.isAnalyzed ? (
                      <div>
                        <p className="primary-bench-desc">
                          {paper.comparisonData.primaryEvaluation}
                        </p>
                        {paper.benchmarks && (
                          <div className="bench-chips-wrap">
                            {Object.entries(paper.benchmarks).map(([k, v]) => (
                              <div key={k} className="bench-pair">
                                <span className="k">{k}:</span>
                                <span className="v">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pending-cell-box">
                        <span className="pending-badge">Pending Analysis</span>
                        <p>Results will be extracted upon analysis.</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 5: Limitations */}
              <tr>
                <td className="dim-cell">
                  <strong>Identified Limitations</strong>
                  <span className="dim-sub">Constraints &amp; open problems</span>
                </td>
                {selectedPapers.map((paper) => (
                  <td key={paper.id} className="data-cell">
                    {paper.isAnalyzed ? (
                      <p className="limitations-text">{paper.comparisonData.limitations}</p>
                    ) : (
                      <div className="pending-cell-box">
                        <span className="pending-badge">Pending Analysis</span>
                        <p>Limitations analysis pending.</p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

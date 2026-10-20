import { useState, useEffect } from 'react';
import {
  FilePdfIcon,
  CheckIcon,
  InfoIcon,
  CompareIcon,
  QuestionIcon,
  ArrowRightIcon,
} from './Icons';
import { analyzePaperApi } from '../services/api';

export const AnalyzeView = ({
  papers,
  activePaperId,
  onSelectPaper,
  onComparePaper,
  onAskPaper,
  onOpenUpload,
  onUpdatePaper,
}) => {
  const currentPaperId = activePaperId || papers[0]?.id;
  const [selectedId, setSelectedId] = useState(currentPaperId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    if (activePaperId) {
      setSelectedId(activePaperId);
      setAnalysisError(null);
    }
  }, [activePaperId]);

  const selectedPaper =
    papers.find((p) => p.id === selectedId) || papers[0];

  const handlePaperChange = (id) => {
    setSelectedId(id);
    setAnalysisError(null);
    if (onSelectPaper) onSelectPaper(id);
  };

  const handleRunAutomatedAnalysis = async () => {
    if (!selectedPaper || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Use raw file if available, or paper metadata as payload
      const payload = selectedPaper.file || {
        title: selectedPaper.title,
        fileName: selectedPaper.fileName,
      };

      const analysis = await analyzePaperApi(payload, {
        id: selectedPaper.id,
        title: selectedPaper.title,
        fileName: selectedPaper.fileName,
      });

      const updatedPaper = {
        ...selectedPaper,
        isAnalyzed: true,
        title: analysis.title || selectedPaper.title,
        authors:
          Array.isArray(analysis.authors) && analysis.authors.length
            ? analysis.authors
            : selectedPaper.authors,
        year: analysis.year || selectedPaper.year,
        venue: analysis.venue || selectedPaper.venue,
        category: analysis.category || selectedPaper.category,
        statusLabel: 'ANALYZED • GEMINI RESEARCH',
        summary: analysis.summary || selectedPaper.summary,
        methodology: analysis.methodology || selectedPaper.methodology,
        keyFindings:
          Array.isArray(analysis.keyFindings) && analysis.keyFindings.length
            ? analysis.keyFindings
            : selectedPaper.keyFindings,
        benchmarks:
          analysis.benchmarks && typeof analysis.benchmarks === 'object'
            ? analysis.benchmarks
            : selectedPaper.benchmarks,
        concepts:
          Array.isArray(analysis.concepts) && analysis.concepts.length
            ? analysis.concepts
            : selectedPaper.concepts,
        comparisonData: {
          innovation:
            analysis.comparisonData?.innovation ||
            analysis.innovation ||
            'Novel research formulation.',
          architecture:
            analysis.comparisonData?.architecture ||
            analysis.architecture ||
            'Proposed architectural framework.',
          computationalComplexity:
            analysis.comparisonData?.computationalComplexity ||
            analysis.computationalComplexity ||
            'Computational scaling defined in methodology.',
          primaryEvaluation:
            analysis.comparisonData?.primaryEvaluation ||
            analysis.primaryEvaluation ||
            'Empirical benchmarks.',
          limitations:
            analysis.comparisonData?.limitations ||
            analysis.limitations ||
            'Identified limitations described in analysis.',
        },
      };

      if (onUpdatePaper) {
        onUpdatePaper(updatedPaper);
      }
    } catch (err) {
      console.error('[Automated Analysis Error]:', err);
      setAnalysisError(err.message || 'Failed to complete automated Gemini analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="analyze-view-container" aria-label="Paper Analysis Workspace">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Analyze Paper</h1>
          <p className="page-subtitle">
            Generate a structured summary, research objectives, methodology, key findings, and limitations.
          </p>
        </div>

        {/* Paper Selector Dropdown & Upload Action */}
        <div className="page-controls-group">
          <label htmlFor="paper-select" className="control-label">
            Select document:
          </label>
          <select
            id="paper-select"
            className="academic-select"
            value={selectedPaper?.id || ''}
            onChange={(e) => handlePaperChange(e.target.value)}
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.isSample ? '(Analyzed Sample)' : (p.isAnalyzed ? '(Analyzed Research)' : '(Uploaded - Pending)')}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenUpload}
          >
            Upload new PDF
          </button>
        </div>
      </div>

      {selectedPaper ? (
        <div className="analyze-content-grid">
          {/* Main Analysis Document Card */}
          <article className="analyze-main-card">
            {/* Document Header Line */}
            <div className="doc-meta-header">
              <div className="doc-status-strip">
                {selectedPaper.isAnalyzed ? (
                  <span className="academic-badge badge-analyzed">
                    <CheckIcon size={12} />
                    <span>Analyzed Research</span>
                  </span>
                ) : (
                  <span className="academic-badge badge-pending">
                    <InfoIcon size={12} />
                    <span>Staged File • Analysis Pending</span>
                  </span>
                )}
                <span className="doc-category-tag">{selectedPaper.category}</span>
                <span className="doc-year-tag">{selectedPaper.year}</span>
              </div>

              <h2 className="doc-title">{selectedPaper.title}</h2>
              <p className="doc-authors">
                {selectedPaper.authors ? selectedPaper.authors.join(', ') : 'Unknown authors'}
              </p>
              <div className="doc-file-specs">
                <span>{selectedPaper.venue}</span>
                <span>•</span>
                <span>{selectedPaper.fileSize}</span>
                <span>•</span>
                <span>{selectedPaper.pages} pages</span>
                {selectedPaper.citationsCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{selectedPaper.citationsCount.toLocaleString()} citations</span>
                  </>
                )}
              </div>
            </div>

            {/* If Paper is Not Yet Analyzed: Live Trigger for Gemini Automated Extraction */}
            {!selectedPaper.isAnalyzed && (
              <div className="pending-analysis-box" role="status">
                <div className="pending-box-header">
                  <InfoIcon size={18} />
                  <h3>Structured AI Analysis Ready to Dispatch</h3>
                </div>
                <p>
                  This research paper has been staged locally in your browser session. In production,
                  the backend Express server connects to the Google Gemini API to parse the full document text,
                  extract methodology formulas, and summarize findings.
                </p>
                <div className="pending-box-action">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={isAnalyzing}
                    onClick={handleRunAutomatedAnalysis}
                    id="run-automated-analysis-btn"
                  >
                    {isAnalyzing ? (
                      <>
                        <span
                          className="btn-spinner"
                          style={{
                            display: 'inline-block',
                            width: 14,
                            height: 14,
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#ffffff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginRight: 8,
                            verticalAlign: 'middle',
                          }}
                        />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      'Run Automated Analysis'
                    )}
                  </button>
                  <span className="pending-note">
                    {isAnalyzing
                      ? 'Extracting document text and neural insights...'
                      : selectedPaper.file
                      ? 'Original PDF loaded • Powered by Google Gemini API'
                      : 'Session restored • Powered by Google Gemini API'}
                  </span>
                </div>
                {!selectedPaper.file && (
                  <div className="re-attach-note" style={{ marginTop: 8, fontSize: '12px', color: '#64748B' }}>
                    <span>PDF file handle expired after page refresh. Run analysis directly, or </span>
                    <label
                      htmlFor="re-attach-pdf-input"
                      style={{
                        color: 'var(--primary-blue, #245D91)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    >
                      re-attach {selectedPaper.fileName || 'PDF'}
                    </label>
                    <input
                      id="re-attach-pdf-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && onUpdatePaper) {
                          onUpdatePaper({
                            ...selectedPaper,
                            file,
                            fileName: file.name,
                          });
                        }
                      }}
                    />
                  </div>
                )}
                {analysisError && (
                  <div
                    className="analysis-error-message"
                    role="alert"
                    style={{
                      marginTop: 10,
                      padding: '8px 12px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      borderRadius: 6,
                      color: '#B91C1C',
                      fontSize: 13,
                    }}
                  >
                    <strong>Analysis Failed: </strong>
                    <span>{analysisError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Section 1: Summary & Core Objectives */}
            <section className="analysis-section">
              <h3 className="section-label">1. Summary &amp; Research Problem</h3>
              <p className="section-body-text">{selectedPaper.summary}</p>
            </section>

            {/* Section 2: Methodology & Formulation */}
            <section className="analysis-section">
              <h3 className="section-label">2. Methodology &amp; Mathematical Formulation</h3>
              <p className="section-body-text">{selectedPaper.methodology}</p>
            </section>

            {/* Section 3: Key Findings */}
            {selectedPaper.keyFindings && (
              <section className="analysis-section">
                <h3 className="section-label">3. Key Findings &amp; Contributions</h3>
                <ul className="findings-bullet-list">
                  {selectedPaper.keyFindings.map((finding, idx) => (
                    <li key={idx} className="finding-bullet-item">
                      <span className="bullet-point" aria-hidden="true">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Section 4: Limitations & Failure Modes */}
            {selectedPaper.comparisonData?.limitations && (
              <section className="analysis-section">
                <h3 className="section-label">4. Identified Limitations &amp; Future Scope</h3>
                <p className="section-body-text text-limitations">
                  {selectedPaper.comparisonData.limitations}
                </p>
              </section>
            )}

            {/* Section 5: Empirical Benchmarks */}
            {selectedPaper.benchmarks && (
              <section className="analysis-section">
                <h3 className="section-label">5. Empirical Benchmarks &amp; Performance</h3>
                <div className="benchmarks-table-wrap">
                  <table className="benchmarks-table">
                    <thead>
                      <tr>
                        <th>Metric / Task</th>
                        <th>Evaluation Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedPaper.benchmarks).map(([k, v]) => (
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
          </article>

          {/* Quick Actions Sidebar */}
          <aside className="analyze-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Next Actions</h3>
              <p className="sidebar-desc">
                Explore this research paper across other tools in Cognipaper.
              </p>

              <div className="sidebar-action-buttons">
                <button
                  type="button"
                  className="sidebar-btn"
                  onClick={() => onAskPaper(selectedPaper)}
                >
                  <QuestionIcon size={16} />
                  <span>Ask questions about this paper</span>
                  <ArrowRightIcon size={12} className="sidebar-arrow" />
                </button>

                <button
                  type="button"
                  className="sidebar-btn"
                  onClick={() => onComparePaper(selectedPaper)}
                >
                  <CompareIcon size={16} />
                  <span>Compare with another paper</span>
                  <ArrowRightIcon size={12} className="sidebar-arrow" />
                </button>
              </div>
            </div>

            {/* Concept Tags Card */}
            {selectedPaper.concepts && selectedPaper.concepts.length > 0 && (
              <div className="sidebar-card">
                <h3 className="sidebar-title">Grounded Concepts</h3>
                <div className="concepts-pills-wrap">
                  {selectedPaper.concepts.map((c, i) => (
                    <span key={i} className="concept-pill">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="empty-analysis-state">
          <FilePdfIcon size={36} />
          <h3>No research papers selected</h3>
          <p>Upload a PDF document to generate an automated structured analysis.</p>
          <button type="button" className="btn-primary" onClick={onOpenUpload}>
            Choose PDF file
          </button>
        </div>
      )}
    </div>
  );
};

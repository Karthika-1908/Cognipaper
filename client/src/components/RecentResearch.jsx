import { useState } from 'react';
import {
  FilePdfIcon,
  CheckIcon,
  InfoIcon,
  CompareIcon,
  QuestionIcon,
  AnalyzeIcon,
  TrashIcon,
} from './Icons';

export const RecentResearch = ({
  papers,
  onInspectPaper,
  onComparePaper,
  onAskPaper,
  onDeletePaper,
  onOpenUpload,
  searchQuery = '',
  isCompact = false,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPapers = papers.filter((paper) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.category.toLowerCase().includes(q) ||
      (paper.authors && paper.authors.some((a) => a.toLowerCase().includes(q)));

    if (!matchesSearch) return false;

    if (activeFilter === 'sample') return paper.isSample;
    if (activeFilter === 'user') return !paper.isSample;
    if (activeFilter === 'analyzed') return paper.isAnalyzed;
    return true;
  });

  return (
    <section className="recent-papers-section" aria-label="Recent Research Papers">
      <div className="recent-header-row">
        <div>
          <h2 className="recent-heading">
            {isCompact ? 'Recent Research Papers' : 'My Research Papers Library'}
          </h2>
          <p className="recent-sub">
            {isCompact
              ? 'Browse indexed milestone papers and your uploaded research documents.'
              : 'View and manage uploaded papers, review extraction summaries, and compare findings.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="filter-tabs-row" role="tablist">
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({papers.length})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'sample' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sample')}
          >
            Sample Papers ({papers.filter((p) => p.isSample).length})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'user' ? 'active' : ''}`}
            onClick={() => setActiveFilter('user')}
          >
            My Uploads ({papers.filter((p) => !p.isSample).length})
          </button>
        </div>
      </div>

      {/* Papers Table/List */}
      {filteredPapers.length === 0 ? (
        <div className="papers-empty-card">
          <FilePdfIcon size={32} />
          <h3>No research papers found</h3>
          <p>
            {searchQuery
              ? `No documents match "${searchQuery}". Try a different keyword.`
              : 'Your library is empty. Select a PDF document above to get started.'}
          </p>
          {onOpenUpload && (
            <button type="button" className="btn-primary" onClick={onOpenUpload}>
              Upload a research paper
            </button>
          )}
        </div>
      ) : (
        <div className="papers-list-table-card">
          <table className="papers-summary-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Paper Title &amp; Authors</th>
                <th style={{ width: '25%' }}>Status &amp; Category</th>
                <th style={{ width: '15%' }}>Specs</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.map((paper) => (
                <tr key={paper.id} className="paper-row-item">
                  {/* Title & Authors */}
                  <td className="paper-title-cell">
                    <div className="title-lead-group">
                      <FilePdfIcon size={20} className="row-pdf-icon" />
                      <div className="title-text-group">
                        <button
                          type="button"
                          className="paper-table-title-btn"
                          onClick={() => onInspectPaper(paper)}
                        >
                          {paper.title}
                        </button>
                        <span className="paper-table-authors">
                          {paper.authors ? paper.authors.slice(0, 3).join(', ') : 'Unknown'}
                          {paper.authors && paper.authors.length > 3 ? ' et al.' : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge & Category */}
                  <td>
                    <div className="status-cell-group">
                      {paper.isAnalyzed ? (
                        <span className="academic-badge badge-analyzed">
                          <CheckIcon size={11} />
                          <span>{paper.isSample ? 'Sample Data • Analyzed' : 'Analyzed Research'}</span>
                        </span>
                      ) : (
                        <span className="academic-badge badge-pending">
                          <InfoIcon size={11} />
                          <span>Uploaded • Pending</span>
                        </span>
                      )}
                      <span className="category-text">{paper.category}</span>
                    </div>
                  </td>

                  {/* Specs (pages & size) */}
                  <td className="specs-cell">
                    <span>{paper.pages}p</span>
                    <span>•</span>
                    <span>{paper.fileSize}</span>
                  </td>

                  {/* Actions */}
                  <td className="actions-cell">
                    <div className="actions-cluster">
                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={() => onInspectPaper(paper)}
                        title="Analyze paper details"
                      >
                        <AnalyzeIcon size={15} />
                        <span>Analyze</span>
                      </button>

                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={() => onAskPaper(paper)}
                        title="Ask questions grounded in this paper"
                      >
                        <QuestionIcon size={15} />
                        <span>Ask</span>
                      </button>

                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={() => onComparePaper(paper)}
                        title="Compare with other papers"
                      >
                        <CompareIcon size={15} />
                        <span>Compare</span>
                      </button>

                      {!paper.isSample && (
                        <button
                          type="button"
                          className="btn-table-action btn-delete"
                          onClick={() => onDeletePaper(paper.id)}
                          title="Remove document from library"
                          aria-label={`Remove ${paper.title}`}
                        >
                          <TrashIcon size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

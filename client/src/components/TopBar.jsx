import { SearchIcon, UploadIcon, InfoIcon } from './Icons';

export const TopBar = ({
  currentTab,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenStatusModal,
  totalPapers,
}) => {
  const getContextTitle = () => {
    switch (currentTab) {
      case 'papers':
        return { section: 'Literature Repository', title: `My Papers & Preprints (${totalPapers})` };
      case 'compare':
        return { section: 'Comparative Matrix', title: 'Cross-Paper Evaluation' };
      case 'assistant':
        return { section: 'Neural Synthesis Console', title: 'Research Assistant' };
      case 'map':
        return { section: 'Topological Analysis', title: 'Concept Connections Map' };
      case 'dashboard':
      default:
        return { section: 'Research Workspace', title: `Synthesis & Ingestion Hub (${totalPapers} indexed)` };
    }
  };

  const context = getContextTitle();

  return (
    <header className="workspace-topbar" aria-label="Workspace Top Bar">
      {/* Breadcrumb Context */}
      <div className="topbar-context">
        <span className="context-eyebrow">{context.section}</span>
        <h2 className="context-title">{context.title}</h2>
      </div>

      {/* Center Search Bar */}
      <div className="topbar-search-wrapper">
        <label htmlFor="global-search" className="sr-only">
          Search papers, concepts, or authors
        </label>
        <div className="search-input-group">
          <SearchIcon size={16} className="search-icon" />
          <input
            id="global-search"
            type="search"
            className="search-input"
            placeholder="Search papers, authors, concepts (e.g. attention, residual)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-actions">
        {/* Status Indicator */}
        <button
          type="button"
          className="topbar-status-chip"
          onClick={onOpenStatusModal}
          title="Backend offline (click for diagnostics)"
          aria-label="System status: Offline. Click for integration diagnostics"
        >
          <span className="status-chip-dot"></span>
          <span className="status-chip-text">Backend Standalone</span>
          <InfoIcon size={13} className="status-chip-info" />
        </button>

        {/* Quick Upload Button */}
        <button
          type="button"
          className="btn-lime topbar-upload-btn"
          onClick={onOpenUpload}
          id="topbar-upload-btn"
        >
          <UploadIcon size={16} />
          <span>Upload PDF</span>
        </button>
      </div>
    </header>
  );
};

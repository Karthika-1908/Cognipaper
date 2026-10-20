import { useState, useEffect } from 'react';
import { SAMPLE_PAPERS } from './data/samplePapers';
import { TopNav } from './components/TopNav';
import { UploadSection } from './components/UploadSection';
import { FeatureCards } from './components/FeatureCards';
import { RecentResearch } from './components/RecentResearch';
import { AnalyzeView } from './components/AnalyzeView';
import { CompareView } from './components/CompareView';
import { AssistantView } from './components/AssistantView';
import { PaperDetailModal } from './components/PaperDetailModal';
import './App.css';

const STORAGE_KEY = 'cognipaper_user_papers';

function loadStoredUserPapers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only return valid user-uploaded paper records (not sample papers)
    return parsed.filter((p) => p && typeof p === 'object' && p.id && !p.isSample);
  } catch (err) {
    console.warn('[Cognipaper] Could not load saved papers from localStorage:', err);
    return [];
  }
}

function App() {
  const [papers, setPapers] = useState(() => {
    const stored = loadStoredUserPapers();
    return [...stored, ...SAMPLE_PAPERS];
  });
  const [currentTab, setCurrentTab] = useState('home');
  const [activePaperId, setActivePaperId] = useState(() => {
    const stored = loadStoredUserPapers();
    return stored[0]?.id || SAMPLE_PAPERS[0].id;
  });
  const [selectedPaperForModal, setSelectedPaperForModal] = useState(null);
  const [comparePaperIds, setComparePaperIds] = useState(['sample-1', 'sample-2']);

  // Sync user uploaded papers to localStorage whenever papers state updates
  useEffect(() => {
    try {
      const userPapers = papers.filter((p) => p && !p.isSample);
      // Strip non-serializable properties (such as File or Blob instances)
      const serializablePapers = userPapers.map((paper) => {
        const { file: _f, raw: _r, ...clean } = paper;
        return clean;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePapers));
    } catch (err) {
      console.warn('[Cognipaper] Failed to save user papers to localStorage:', err);
    }
  }, [papers]);

  // Handle uploaded papers
  const handlePaperUploaded = (newPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
    setActivePaperId(newPaper.id);
  };

  // Update paper after analysis
  const handleUpdatePaper = (updatedPaper) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === updatedPaper.id ? updatedPaper : p))
    );
  };

  // Delete user uploaded paper
  const handleDeletePaper = (paperId) => {
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    setComparePaperIds((prev) => prev.filter((id) => id !== paperId));
    if (activePaperId === paperId) {
      setActivePaperId(SAMPLE_PAPERS[0].id);
    }
  };

  // Navigation handlers
  const handleInspectPaper = (paper) => {
    setSelectedPaperForModal(paper);
  };

  const handleComparePaper = (paper) => {
    if (!comparePaperIds.includes(paper.id)) {
      setComparePaperIds((prev) => [...prev.slice(-2), paper.id]);
    }
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskPaper = (paper) => {
    setActivePaperId(paper.id);
    setCurrentTab('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAnalyze = (paper) => {
    if (paper) {
      setActivePaperId(paper.id);
    }
    setCurrentTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUpload = () => {
    setCurrentTab('home');
    setTimeout(() => {
      const btn = document.getElementById('choose-pdf-btn');
      if (btn) btn.click();
    }, 100);
  };

  return (
    <div className="app-shell">
      {/* 1. Responsive Horizontal Top Navigation */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        papersCount={papers.length}
      />

      {/* 2. Main Page Container */}
      <main className="main-content-container">
        {/* VIEW 1: HOME */}
        {currentTab === 'home' && (
          <>
            {/* A. Welcome Section */}
            <section className="home-welcome-section" aria-label="Welcome">
              <h1 className="welcome-heading">Understand research, simply.</h1>
              <p className="welcome-description">
                Upload a research paper. Discover its key ideas, explore its findings, and compare it with other papers.
              </p>
            </section>

            {/* B. Main PDF Upload Section */}
            <UploadSection
              onPaperUploaded={handlePaperUploaded}
              onNavigateToAnalyze={handleNavigateToAnalyze}
            />

            {/* C. Four Feature Cards */}
            <FeatureCards onSelectTab={setCurrentTab} />

            {/* D. Recent Papers Section */}
            <RecentResearch
              papers={papers}
              onInspectPaper={handleInspectPaper}
              onComparePaper={handleComparePaper}
              onAskPaper={handleAskPaper}
              onDeletePaper={handleDeletePaper}
              onOpenUpload={handleOpenUpload}
              isCompact={true}
            />
          </>
        )}

        {/* VIEW 2: ANALYZE PAPER */}
        {currentTab === 'analyze' && (
          <AnalyzeView
            papers={papers}
            activePaperId={activePaperId}
            onSelectPaper={setActivePaperId}
            onComparePaper={handleComparePaper}
            onAskPaper={handleAskPaper}
            onOpenUpload={handleOpenUpload}
            onUpdatePaper={handleUpdatePaper}
          />
        )}

        {/* VIEW 3: ASK QUESTIONS */}
        {currentTab === 'ask' && (
          <AssistantView
            papers={papers}
            initialPaperId={activePaperId}
            onInspectPaper={handleInspectPaper}
          />
        )}

        {/* VIEW 4: COMPARE PAPERS */}
        {currentTab === 'compare' && (
          <CompareView
            papers={papers}
            selectedPaperIds={comparePaperIds}
            onToggleSelectPaper={setComparePaperIds}
            onInspectPaper={handleInspectPaper}
          />
        )}

        {/* VIEW 5: MY PAPERS */}
        {currentTab === 'papers' && (
          <RecentResearch
            papers={papers}
            onInspectPaper={handleInspectPaper}
            onComparePaper={handleComparePaper}
            onAskPaper={handleAskPaper}
            onDeletePaper={handleDeletePaper}
            onOpenUpload={handleOpenUpload}
            isCompact={false}
          />
        )}
      </main>

      {/* Paper Inspection Modal */}
      {selectedPaperForModal && (
        <PaperDetailModal
          paper={selectedPaperForModal}
          onClose={() => setSelectedPaperForModal(null)}
          onCompare={handleComparePaper}
          onAskAssistant={handleAskPaper}
        />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { SAMPLE_ASSISTANT_QA, SAMPLE_PAPERS } from '../data/samplePapers';
import { InfoIcon, ArrowRightIcon } from './Icons';
import { askPaperQuestionApi } from '../services/api';

let globalMessageSeq = 100;
function generateMsgId(prefix) {
  globalMessageSeq += 1;
  return `${prefix}-${globalMessageSeq}`;
}

function getFormattedTime() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hrs}:${mins}`;
}

export const AssistantView = ({ papers, initialPaperId = null, onInspectPaper }) => {
  const [selectedContextPaperId, setSelectedContextPaperId] = useState(initialPaperId || 'all');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Ask any question about your research papers. Questions will be grounded directly in the literature methodology, theorems, and benchmarks.',
      isSampleGrounded: true,
      timestamp: 'Session Active',
    },
    {
      id: 'sample-qa-1',
      sender: 'user',
      text: SAMPLE_ASSISTANT_QA[0].query,
      timestamp: 'Example Query',
    },
    {
      id: 'sample-qa-1-resp',
      sender: 'assistant',
      text: SAMPLE_ASSISTANT_QA[0].answer,
      isSampleGrounded: true,
      papersReferenced: SAMPLE_ASSISTANT_QA[0].papersReferenced,
      timestamp: 'Verified Academic Citation',
    },
  ]);

  useEffect(() => {
    if (initialPaperId) {
      setSelectedContextPaperId(initialPaperId);
    }
  }, [initialPaperId]);

  const handleSendQuery = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const timeStr = getFormattedTime();

    const userMessage = {
      id: generateMsgId('user-msg'),
      sender: 'user',
      text: query,
      timestamp: timeStr,
    };

    const contextPaper =
      selectedContextPaperId === 'all'
        ? null
        : papers.find((p) => p.id === selectedContextPaperId);

    // If an unanalyzed paper has neither raw file nor extracted text, inform user
    if (contextPaper && !contextPaper.isAnalyzed && !contextPaper.file) {
      const noticeResponse = {
        id: generateMsgId('asst-msg'),
        sender: 'assistant',
        isBackendNotice: true,
        text: `Analysis required: "${contextPaper.title}" has been uploaded but has not yet been processed with automated extraction. Once backend Gemini integration is configured in server/.env, grounded answers can be generated.`,
        timestamp: timeStr,
      };
      setChatLog((prev) => [...prev, userMessage, noticeResponse]);
      setInputQuery('');
      return;
    }

    // Set loading message in chat
    const loadingId = generateMsgId('loading-msg');
    const loadingMessage = {
      id: loadingId,
      sender: 'assistant',
      isLoading: true,
      text: 'Analyzing research context and generating grounded answer...',
      timestamp: 'Thinking...',
    };

    setChatLog((prev) => [...prev, userMessage, loadingMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const result = await askPaperQuestionApi({
        question: query,
        contextPaper,
        allPapers: selectedContextPaperId === 'all' ? papers : undefined,
        file: contextPaper?.file,
      });

      const assistantResponse = {
        id: generateMsgId('asst-msg'),
        sender: 'assistant',
        text: result.answer,
        papersReferenced:
          result.papersReferenced && result.papersReferenced.length > 0
            ? result.papersReferenced
            : contextPaper
            ? [contextPaper.id]
            : [],
        timestamp: getFormattedTime(),
      };

      setChatLog((prev) =>
        prev.map((msg) => (msg.id === loadingId ? assistantResponse : msg))
      );
    } catch (err) {
      console.error('[Ask Question Error]:', err);

      const fallbackResponse = {
        id: generateMsgId('asst-msg'),
        sender: 'assistant',
        isBackendNotice: true,
        isError: true,
        text: `Standalone Mode: Custom generative answers require an active Gemini backend connection. You can test the verified research queries below or configure GEMINI_API_KEY in server/.env.`,
        timestamp: getFormattedTime(),
      };

      setChatLog((prev) =>
        prev.map((msg) => (msg.id === loadingId ? fallbackResponse : msg))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className="assistant-view-container" aria-label="Research Paper Q&A Console">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Ask Questions</h1>
          <p className="page-subtitle">
            Ask questions and get answers grounded in the selected research paper.
          </p>
        </div>

        {/* Paper Grounding Selector */}
        <div className="page-controls-group">
          <label htmlFor="qa-paper-select" className="control-label">
            Ground answer in:
          </label>
          <select
            id="qa-paper-select"
            className="academic-select"
            value={selectedContextPaperId}
            onChange={(e) => setSelectedContextPaperId(e.target.value)}
          >
            <option value="all">All Indexed Papers (Cross-Literature)</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.isSample ? '(Verified Sample)' : (p.isAnalyzed ? '(Analyzed Research)' : '(Uploaded File)')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Questions Strip */}
      <div className="suggested-questions-card">
        <span className="suggested-label">Example research questions:</span>
        <div className="suggested-pills-wrap">
          {SAMPLE_ASSISTANT_QA.map((qa, idx) => (
            <button
              key={idx}
              type="button"
              className="suggested-pill"
              onClick={() => handleSendQuery(qa.query)}
            >
              <span>{qa.query}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Log */}
      <div className="qa-chat-box">
        <div className="qa-thread" role="log" aria-live="polite">
          {chatLog.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`qa-message-row ${isUser ? 'msg-user' : 'msg-assistant'}`}
              >
                <div className="qa-bubble">
                  <div className="qa-bubble-header">
                    <span className="qa-sender-name">
                      {isUser ? 'Your Question' : 'Cognipaper Assistant'}
                    </span>
                    <span className="qa-time-stamp">{msg.timestamp}</span>
                  </div>

                  {msg.isLoading ? (
                    <div
                      className="qa-loading-indicator"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'var(--primary-blue, #245D91)',
                        fontStyle: 'italic',
                        fontSize: 13,
                        padding: '4px 0',
                      }}
                    >
                      <span
                        className="qa-spinner"
                        style={{
                          display: 'inline-block',
                          width: 14,
                          height: 14,
                          border: '2px solid rgba(36, 93, 145, 0.25)',
                          borderTopColor: '#245D91',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      <span>Analyzing research context and generating grounded answer...</span>
                    </div>
                  ) : (
                    <p className="qa-body-text" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </p>
                  )}

                  {/* Citations Footer */}
                  {msg.papersReferenced && msg.papersReferenced.length > 0 && (
                    <div className="qa-citations-strip">
                      <span className="citations-label">Grounded in:</span>
                      {msg.papersReferenced.map((refId) => {
                        const refPaper =
                          papers.find((p) => p.id === refId) ||
                          SAMPLE_PAPERS.find((p) => p.id === refId);
                        if (!refPaper) return null;
                        return (
                          <button
                            key={refId}
                            type="button"
                            className="citation-tag-btn"
                            onClick={() => onInspectPaper && onInspectPaper(refPaper)}
                          >
                            <span>{refPaper.title}</span>
                            <span className="cite-year">({refPaper.year})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Backend Notice */}
                  {msg.isBackendNotice && (
                    <div className="qa-notice-alert">
                      <InfoIcon size={14} />
                      <span>Notice: Cognipaper does not simulate answers without active model grounding.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <div className="qa-input-form">
          <textarea
            rows={2}
            className="qa-textarea"
            placeholder="Type your question about methodology, formulas, or results..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            type="button"
            className="btn-primary qa-submit-btn"
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: 6,
                  }}
                />
                <span>Asking...</span>
              </>
            ) : (
              <>
                <span>Ask</span>
                <ArrowRightIcon size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

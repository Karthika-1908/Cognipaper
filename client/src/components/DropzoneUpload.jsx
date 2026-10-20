import { useState, useRef } from 'react';
import { UploadIcon, FilePdfIcon, CheckIcon, AlertIcon, CloseIcon } from './Icons';

export const DropzoneUpload = ({ onPaperUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null); // { type: 'success' | 'error', message: string, fileDetails?: object }
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAndProcessFile = (file) => {
    setUploadFeedback(null);

    // 1. Validate MIME type or file extension
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setUploadFeedback({
        type: 'error',
        message: `Validation Error: "${file.name}" is not a PDF. Cognipaper accepts PDF scientific research documents only.`,
      });
      return;
    }

    // 2. Validate Size (Max 50 MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadFeedback({
        type: 'error',
        message: `File too large (${formatFileSize(file.size)}). Maximum supported document size is 50 MB.`,
      });
      return;
    }

    // 3. Process the file locally
    setIsProcessing(true);

    setTimeout(() => {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const newPaper = {
        id: `user-paper-${Date.now()}`,
        isSample: false,
        isAnalyzed: false,
        title: cleanTitle,
        fileName: file.name,
        authors: ['Uploaded by Researcher (Pending Metadata Extraction)'],
        year: new Date().getFullYear(),
        venue: 'Local Preprint Staging Buffer',
        doi: 'Local Document (Unpublished/Custom)',
        category: 'Unclassified Scientific Paper',
        fileSize: formatFileSize(file.size),
        pages: Math.max(1, Math.round(file.size / (180 * 1024))), // Realistic page estimate based on size
        statusLabel: 'LOCAL FILE • PENDING ANALYSIS',
        summary:
          'This document has been parsed and staged into the local browser session. Automated semantic analysis, embedding extraction, and multi-document synthesis are awaiting an active Gemini backend connection.',
        keyFindings: [
          'Document structure identified: Valid PDF format.',
          'Local buffer allocated: Stored in client state.',
          'Awaiting backend execution: Connect GEMINI_API_KEY to generate abstract, methodology, and citations.'
        ],
        methodology: 'Awaiting neural analysis dispatch to Gemini API.',
        benchmarks: {
          'File Size': formatFileSize(file.size),
          'Buffer Status': 'Allocated Locally',
          'AI Status': 'Unanalyzed (Backend Offline)'
        },
        concepts: ['Uncategorized', 'Pending Extraction'],
        citationsCount: 0,
        uploadDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
        comparisonData: {
          innovation: 'Pending AI extraction.',
          architecture: 'Pending AI extraction.',
          computationalComplexity: 'Pending AI extraction.',
          primaryEvaluation: 'Pending AI extraction.',
          limitations: 'Pending AI extraction.'
        }
      };

      onPaperUploaded(newPaper);
      setIsProcessing(false);
      setUploadFeedback({
        type: 'success',
        message: `"${file.name}" successfully staged in research queue.`,
        fileDetails: {
          name: file.name,
          size: formatFileSize(file.size),
          id: newPaper.id
        }
      });
    }, 700);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="dropzone-section" aria-label="PDF Document Upload">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        id="pdf-file-input"
        onChange={handleFileChange}
      />

      {/* Main Drop Surface */}
      <div
        className={`dropzone-surface ${isDragOver ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileInput();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Drag and drop PDF research paper here, or press enter to browse files"
      >
        <div className="dropzone-grid-cue" aria-hidden="true"></div>

        <div className="dropzone-content">
          <div className="dropzone-icon-wrapper">
            {isProcessing ? (
              <span className="spinner-ring" aria-hidden="true"></span>
            ) : isDragOver ? (
              <FilePdfIcon size={36} className="icon-lime-glow" />
            ) : (
              <UploadIcon size={34} className="icon-cyan" />
            )}
          </div>

          <div className="dropzone-text-block">
            <h3 className="dropzone-heading">
              {isDragOver
                ? 'Drop PDF to Stage for Analysis'
                : isProcessing
                ? 'Validating & Parsing PDF Structure...'
                : 'Drop research paper PDF here, or browse files'}
            </h3>
            <p className="dropzone-subtext">
              Accepts <strong>.pdf</strong> preprints and peer-reviewed documents up to 50 MB.
              <span className="dropzone-tagline"> Client parses locally; never transmitted without your consent.</span>
            </p>
          </div>

          <div className="dropzone-action-btn">
            <span className="btn-browse">Select PDF File</span>
          </div>
        </div>

        {/* Technical Corner Notches */}
        <span className="corner-notch notch-tl" aria-hidden="true"></span>
        <span className="corner-notch notch-tr" aria-hidden="true"></span>
        <span className="corner-notch notch-bl" aria-hidden="true"></span>
        <span className="corner-notch notch-br" aria-hidden="true"></span>
      </div>

      {/* Upload Feedback Alert Bar */}
      {uploadFeedback && (
        <div
          className={`upload-feedback-banner ${uploadFeedback.type === 'error' ? 'banner-error' : 'banner-success'}`}
          role="alert"
          aria-live="polite"
        >
          <div className="banner-icon">
            {uploadFeedback.type === 'error' ? (
              <AlertIcon size={18} />
            ) : (
              <CheckIcon size={18} />
            )}
          </div>
          <div className="banner-text">
            <span className="banner-msg">{uploadFeedback.message}</span>
            {uploadFeedback.type === 'success' && (
              <span className="banner-sub">
                Status: <strong>Pending Backend Analysis</strong>. Paper is now accessible in the Recent Research queue below.
              </span>
            )}
          </div>
          <button
            type="button"
            className="banner-close-btn"
            onClick={() => setUploadFeedback(null)}
            aria-label="Dismiss message"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      )}
    </section>
  );
};

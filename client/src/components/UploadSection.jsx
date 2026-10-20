import { useState, useRef } from 'react';
import { UploadIcon, FilePdfIcon, CheckIcon, AlertIcon, ArrowRightIcon, CloseIcon } from './Icons';

export const UploadSection = ({ onPaperUploaded, onNavigateToAnalyze }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleValidateAndStage = (file) => {
    setErrorMessage('');
    setSuccessMessage('');
    setSelectedFile(null);

    if (!file) return;

    // Validate PDF MIME type or extension
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setErrorMessage(`Invalid format: "${file.name}". Please upload PDF files only.`);
      return;
    }

    // Size limit check (max 50 MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File exceeds 50 MB limit (${formatFileSize(file.size)}). Please choose a smaller research PDF.`);
      return;
    }

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const stagedPaper = {
      id: `user-doc-${Date.now()}`,
      file: file,
      isSample: false,
      isAnalyzed: false,
      title: cleanTitle,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      pages: Math.max(1, Math.round(file.size / (160 * 1024))),
      authors: ['Researcher Upload (Metadata pending analysis)'],
      year: new Date().getFullYear(),
      venue: 'Staged Document Library',
      doi: 'Local file',
      category: 'Research Paper',
      statusLabel: 'Uploaded • Pending Analysis',
      summary:
        'This research PDF has been staged successfully. AI-powered extraction will generate a structured summary, research objectives, methodology, and limitations when analyzed.',
      keyFindings: [
        'Document successfully staged in your local session.',
        'File format and structure validated: PDF.',
        'Ready for structured analysis.'
      ],
      methodology: 'Awaiting analysis processing.',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      benchmarks: {
        'File Size': formatFileSize(file.size),
        'Validation': 'Passed (Valid PDF)',
        'Analysis Status': 'Ready for processing'
      },
      concepts: ['Uploaded Paper'],
      citationsCount: 0,
      comparisonData: {
        innovation: 'Analysis pending.',
        architecture: 'Analysis pending.',
        computationalComplexity: 'Analysis pending.',
        primaryEvaluation: 'Analysis pending.',
        limitations: 'Analysis pending.'
      }
    };

    setSelectedFile({
      name: file.name,
      size: formatFileSize(file.size),
      raw: file,
      paperRecord: stagedPaper,
    });

    onPaperUploaded(stagedPaper);
    setSuccessMessage(`"${file.name}" ready. File selected and staged — not yet analyzed.`);
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
      handleValidateAndStage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndStage(e.target.files[0]);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleProceedToAnalyze = () => {
    if (selectedFile && onNavigateToAnalyze) {
      onNavigateToAnalyze(selectedFile.paperRecord);
    }
  };

  return (
    <section className="upload-card-wrapper" aria-label="PDF Upload Section">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        id="home-pdf-file-input"
        onChange={handleFileInputChange}
      />

      <div
        className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-circle">
          <UploadIcon size={26} className="upload-icon-primary" />
        </div>

        <h2 className="upload-heading">Upload your research paper</h2>
        <p className="upload-description">
          Select a PDF from your device to get started.
        </p>

        <div className="upload-action-row">
          <button
            type="button"
            className="btn-primary upload-btn"
            onClick={openFilePicker}
            id="choose-pdf-btn"
          >
            <UploadIcon size={16} />
            <span>Choose PDF file</span>
          </button>
        </div>

        <span className="upload-format-note">PDF files only (up to 50 MB)</span>
      </div>

      {/* Selected File Details Box */}
      {selectedFile && (
        <div className="selected-file-panel" role="status" aria-live="polite">
          <div className="file-info-group">
            <div className="file-badge-icon">
              <FilePdfIcon size={22} />
            </div>
            <div className="file-meta">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-specs">
                {selectedFile.size} • Status: <strong>Staged (Analysis not yet run)</strong>
              </span>
            </div>
          </div>

          <div className="file-actions">
            <button
              type="button"
              className="btn-primary btn-analyze-now"
              onClick={handleProceedToAnalyze}
            >
              <span>Analyze this paper</span>
              <ArrowRightIcon size={14} />
            </button>
            <button
              type="button"
              className="btn-clear-selection"
              onClick={() => {
                setSelectedFile(null);
                setSuccessMessage('');
              }}
              title="Clear selection"
              aria-label="Clear selected file"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Error Message Box */}
      {errorMessage && (
        <div className="upload-alert alert-error" role="alert">
          <AlertIcon size={16} />
          <span>{errorMessage}</span>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => setErrorMessage('')}
            aria-label="Dismiss error"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}

      {/* Success Notification Box */}
      {successMessage && !selectedFile && (
        <div className="upload-alert alert-success" role="status">
          <CheckIcon size={16} />
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss message"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

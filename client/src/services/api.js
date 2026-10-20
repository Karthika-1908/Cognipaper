/**
 * Cognipaper Frontend API Client
 * Configured via VITE_API_BASE_URL
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';

/**
 * Helper to make requests with an automatic timeout to prevent UI hangs
 */
async function fetchWithTimeout(endpoint, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Checks health of the Express backend server
 */
export async function checkBackendHealth() {
  try {
    const res = await fetchWithTimeout('/api/health', { method: 'GET' });
    if (!res.ok) {
      return { isOnline: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { isOnline: true, data };
  } catch (err) {
    return { isOnline: false, error: err.message };
  }
}

/**
 * Fetches detailed system and Gemini configuration status
 */
export async function fetchBackendStatus() {
  try {
    const res = await fetchWithTimeout('/api/status', { method: 'GET' });
    if (!res.ok) {
      return { isOnline: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { isOnline: true, data };
  } catch (err) {
    return { isOnline: false, error: err.message };
  }
}

/**
 * Queries model availability via the backend Google GenAI SDK
 */
export async function fetchAvailableModels() {
  try {
    const res = await fetchWithTimeout('/api/models', { method: 'GET' });
    if (!res.ok) {
      return { isOnline: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { isOnline: true, data };
  } catch (err) {
    return { isOnline: false, error: err.message };
  }
}

/**
 * Dispatches a research paper document to the Express backend for Gemini AI extraction
 */
export async function analyzePaperApi(fileOrData, metadata = {}) {
  try {
    const isFile =
      fileOrData instanceof File ||
      fileOrData instanceof Blob ||
      (fileOrData && typeof fileOrData === 'object' && typeof fileOrData.size === 'number' && fileOrData.name);

    let response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout for neural analysis

    const url = `${API_BASE_URL}/api/analyze`;

    if (isFile) {
      const formData = new FormData();
      formData.append('file', fileOrData, fileOrData.name || 'research_document.pdf');
      if (metadata.id) formData.append('paperId', metadata.id);
      if (metadata.title) formData.append('title', metadata.title);

      response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
    } else {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metadata,
          ...(typeof fileOrData === 'object' ? fileOrData : { text: String(fileOrData) }),
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Analysis failed with HTTP ${response.status}`);
    }
    return data.analysis;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Automated analysis timed out. Please check your backend connection.');
    }
    throw error;
  }
}

/**
 * Submits a question to the backend to get a Gemini-grounded response for a paper or all papers
 */
export async function askPaperQuestionApi({ question, contextPaper, allPapers, file }) {
  try {
    const url = `${API_BASE_URL}/api/ask`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    let response;

    const fileToUpload = file || contextPaper?.file;
    const isFile =
      fileToUpload instanceof File ||
      fileToUpload instanceof Blob ||
      (fileToUpload && typeof fileToUpload === 'object' && typeof fileToUpload.size === 'number' && fileToUpload.name);

    if (isFile) {
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name || 'document.pdf');
      formData.append('question', question);
      if (contextPaper) {
        const { file: _f, ...paperMeta } = contextPaper;
        formData.append('contextPaper', JSON.stringify(paperMeta));
      }
      if (allPapers && Array.isArray(allPapers)) {
        const cleanAll = allPapers.map(({ file: _f, ...rest }) => rest);
        formData.append('allPapers', JSON.stringify(cleanAll));
      }

      response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
    } else {
      const cleanContext = contextPaper
        ? (({ file: _f, ...rest }) => rest)(contextPaper)
        : null;
      const cleanAll = allPapers
        ? allPapers.map(({ file: _f, ...rest }) => rest)
        : null;

      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          contextPaper: cleanContext,
          allPapers: cleanAll,
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeoutId);

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Question answering failed with HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Question answering request timed out. Please check your backend connection.');
    }
    throw error;
  }
}



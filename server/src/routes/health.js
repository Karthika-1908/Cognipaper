import { Router } from 'express';
import multer from 'multer';
import {
  discoverAvailableModels,
  analyzePaperWithGemini,
  answerQuestionWithGemini,
} from '../services/gemini.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
});

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'cognipaper-neural-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

/**
 * Detailed status endpoint
 * GET /api/status
 */
router.get('/status', async (req, res) => {
  const isKeyConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());

  res.json({
    status: 'ok',
    service: 'cognipaper-neural-backend',
    version: '1.0.0',
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    gemini: {
      configured: isKeyConfigured,
      sdk: '@google/genai (v2.30.0)',
      status: isKeyConfigured
        ? 'Key detected and operational.'
        : 'GEMINI_API_KEY is not set in server/.env (Standalone mode active).',
    },
    capabilities: {
      healthCheck: true,
      modelDiscovery: true,
      pdfAnalysis: isKeyConfigured
        ? 'Active (Google Gemini Neural Engine)'
        : 'Requires GEMINI_API_KEY in server/.env',
      questionAnswering: isKeyConfigured
        ? 'Active (Google Gemini Grounded Assistant)'
        : 'Requires GEMINI_API_KEY in server/.env',
    },
  });
});

/**
 * Model discovery and verification endpoint
 * GET /api/models
 */
router.get('/models', async (req, res) => {
  try {
    const modelInfo = await discoverAvailableModels();
    res.json(modelInfo);
  } catch (error) {
    res.status(500).json({
      configured: false,
      available: false,
      error: error.message || 'Internal server error while discovering models',
    });
  }
});

/**
 * Document analysis endpoint
 * POST /api/analyze
 */
router.post('/analyze', upload.single('file'), async (req, res) => {
  const isKeyConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());

  if (!isKeyConfigured) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_BACKEND_OFFLINE',
      message:
        'Cognipaper AI Engine: GEMINI_API_KEY is not configured in server/.env. Please configure your key to enable automated neural extraction.',
    });
  }

  try {
    const file = req.file;
    const body = req.body || {};

    let fileBuffer = file?.buffer;
    let mimeType = file?.mimetype || 'application/pdf';
    let fileName = file?.originalname || body.fileName || body.title;
    let textContent = body.text || body.content;

    // Support base64 payloads if passed via JSON
    if (!fileBuffer && body.fileBase64) {
      fileBuffer = Buffer.from(body.fileBase64, 'base64');
      if (body.mimeType) mimeType = body.mimeType;
    }

    if (!fileBuffer && !textContent && !fileName) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'No document file or content provided for automated analysis.',
      });
    }

    const analysis = await analyzePaperWithGemini({
      fileBuffer,
      mimeType,
      fileName,
      textContent,
    });

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('[Document Analysis Error]:', error.message);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: error.message || 'Failed to analyze research paper with Gemini.',
    });
  }
});

/**
 * Research Paper Q&A endpoint
 * POST /api/ask
 */
router.post('/ask', upload.single('file'), async (req, res) => {
  const isKeyConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());

  if (!isKeyConfigured) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_BACKEND_OFFLINE',
      message:
        'Standalone Mode: Custom generative answers require an active Gemini backend connection. You can test the verified research queries below or configure GEMINI_API_KEY in server/.env.',
    });
  }

  try {
    const file = req.file;
    const body = req.body || {};

    const question = body.question?.trim();
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Question query is required.',
      });
    }

    let fileBuffer = file?.buffer;
    let mimeType = file?.mimetype || 'application/pdf';

    if (!fileBuffer && body.fileBase64) {
      fileBuffer = Buffer.from(body.fileBase64, 'base64');
      if (body.mimeType) mimeType = body.mimeType;
    }

    let contextPaper = null;
    if (body.contextPaper) {
      try {
        contextPaper =
          typeof body.contextPaper === 'string'
            ? JSON.parse(body.contextPaper)
            : body.contextPaper;
      } catch (e) {
        contextPaper = body.contextPaper;
      }
    }

    let allPapers = null;
    if (body.allPapers) {
      try {
        allPapers =
          typeof body.allPapers === 'string'
            ? JSON.parse(body.allPapers)
            : body.allPapers;
      } catch (e) {
        allPapers = body.allPapers;
      }
    }

    const result = await answerQuestionWithGemini({
      question,
      contextPaper,
      allPapers,
      fileBuffer,
      mimeType,
    });

    res.json({
      success: true,
      answer: result.answer,
      papersReferenced: result.papersReferenced,
      modelUsed: result.modelUsed,
    });
  } catch (error) {
    console.error('[Document Q&A Error]:', error.message);
    res.status(500).json({
      success: false,
      error: 'QA_FAILED',
      message: error.message || 'Failed to generate answer with Gemini.',
    });
  }
});

// Alias /api/chat to /api/ask
router.post('/chat', upload.single('file'), (req, res, next) => {
  req.url = '/ask';
  router.handle(req, res, next);
});

export default router;



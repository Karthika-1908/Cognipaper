import { GoogleGenAI } from '@google/genai';

/**
 * Returns an initialized GoogleGenAI instance if GEMINI_API_KEY is set.
 * Returns null if the key is missing or blank.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Verifies model availability dynamically using the Google GenAI SDK.
 * Does not assume any specific model is available.
 */
export async function discoverAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      configured: false,
      available: false,
      selectedModel: null,
      models: [],
      message: 'GEMINI_API_KEY is not set in server/.env. Backend is running in standalone mode.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.list();

    const modelsList = [];
    // response can be an iterable or array of models
    for await (const model of response) {
      modelsList.push({
        name: model.name,
        displayName: model.displayName || model.name,
        description: model.description || '',
        supportedGenerationMethods: model.supportedGenerationMethods || [],
      });
    }

    if (modelsList.length === 0) {
      return {
        configured: true,
        available: false,
        selectedModel: null,
        models: [],
        message: 'No models returned from Google GenAI API for the configured credentials.',
      };
    }

    // Filter models supporting text/content generation
    const contentModels = modelsList.filter(
      (m) =>
        !m.supportedGenerationMethods.length ||
        m.supportedGenerationMethods.includes('generateContent')
    );

    // Candidates in priority order; dynamically pick the first one present
    const preferredCandidates = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ];

    let selected = null;
    for (const candidate of preferredCandidates) {
      const match = contentModels.find(
        (m) => m.name.includes(candidate) || (m.displayName && m.displayName.includes(candidate))
      );
      if (match) {
        selected = match.name;
        break;
      }
    }

    // Fallback to the first available content generation model
    if (!selected && contentModels.length > 0) {
      selected = contentModels[0].name;
    }

    return {
      configured: true,
      available: true,
      selectedModel: selected,
      totalModels: modelsList.length,
      models: contentModels.slice(0, 15), // Return first 15 for concise inspection
      message: `Verified ${modelsList.length} models. Selected active model: ${selected}`,
    };
  } catch (error) {
    return {
      configured: true,
      available: false,
      selectedModel: null,
      models: [],
      error: error.message || 'Failed to query models from Google GenAI API.',
      message: 'Error communicating with Google GenAI API. Verify GEMINI_API_KEY validity.',
    };
  }
}

/**
 * Analyzes a research paper document (PDF buffer or text) using Gemini.
 * Employs automatic model failover across flash models for maximum reliability.
 */
export async function analyzePaperWithGemini({ fileBuffer, mimeType, fileName, textContent }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server/.env.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are Cognipaper Neural Analysis Engine, an expert academic research analyst.
Thoroughly examine this research document and return a structured JSON response matching this schema:
{
  "title": "Exact title of the paper or a concise academic title",
  "authors": ["Author 1", "Author 2", ...],
  "year": 2024,
  "venue": "Publication venue, conference, journal, or arXiv (e.g. arXiv preprint, NeurIPS, IEEE)",
  "category": "Primary research domain (e.g. Deep Learning, Computer Vision, Quantum Computing, NLP)",
  "summary": "A rigorous 2-3 paragraph summary detailing the core research problem, why it is challenging, and how the authors solve it.",
  "methodology": "In-depth technical breakdown of the methodology, algorithms, mathematical formulations, or model architecture.",
  "keyFindings": [
    "Specific technical or empirical finding / breakthrough 1",
    "Specific technical or empirical finding / breakthrough 2",
    "Specific technical or empirical finding / breakthrough 3"
  ],
  "limitations": "Honest assessment of limitations, assumptions, compute bottlenecks, or failure modes.",
  "benchmarks": {
    "Primary Metric / Benchmark": "Score or observation",
    "Baseline Comparison": "Score or observation"
  },
  "concepts": [
    "Technical Concept 1",
    "Technical Concept 2",
    "Technical Concept 3",
    "Technical Concept 4"
  ],
  "innovation": "Key conceptual or algorithmic innovation.",
  "architecture": "Architecture and design specifications.",
  "computationalComplexity": "Computational, time, or memory complexity.",
  "primaryEvaluation": "Evaluation protocol and datasets."
}

CRITICAL: Return ONLY valid, parseable JSON. Do not wrap in markdown code blocks or add introductory or concluding text.`;

  const contents = [];

  if (fileBuffer && fileBuffer.length > 0) {
    contents.push({
      inlineData: {
        mimeType: mimeType || 'application/pdf',
        data: fileBuffer.toString('base64'),
      },
    });
  }

  if (textContent && textContent.trim()) {
    contents.push({
      text: `Document Content:\n${textContent}\n\n`,
    });
  } else if (fileName) {
    contents.push({
      text: `File name: ${fileName}\n\n`,
    });
  }

  contents.push({ text: prompt });



  let lastError = null;
  let rawText = '';
  let modelUsed = '';

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        rawText = response.text.trim();
        modelUsed = model;
        break;
      }
    } catch (err) {
      lastError = err;
      // Continue to next candidate model
    }
  }

  if (!rawText) {
    throw new Error(
      lastError?.message ||
      'Failed to generate analysis from Google Gemini API across candidate models.'
    );
  }

  let cleanText = rawText;
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleanText);
  } catch (parseErr) {
    throw new Error(`Failed to parse Gemini JSON output: ${parseErr.message}`);
  }

  return {
    title: parsed.title || fileName || 'Analyzed Research Paper',
    authors:
      Array.isArray(parsed.authors) && parsed.authors.length
        ? parsed.authors
        : ['Identified Research Authors'],
    year: typeof parsed.year === 'number' ? parsed.year : new Date().getFullYear(),
    venue: parsed.venue || 'Peer-Reviewed Preprint',
    category: parsed.category || 'Computer Science & AI',
    summary: parsed.summary || 'Summary generated by Cognipaper Neural Engine.',
    methodology: parsed.methodology || 'Methodology formulated in paper.',
    keyFindings:
      Array.isArray(parsed.keyFindings) && parsed.keyFindings.length
        ? parsed.keyFindings
        : ['Empirical and theoretical evaluation completed.'],
    limitations: parsed.limitations || 'No explicit limitations noted in document.',
    benchmarks:
      parsed.benchmarks && typeof parsed.benchmarks === 'object'
        ? parsed.benchmarks
        : { 'Validation': 'Completed', 'Engine': 'Gemini' },
    concepts:
      Array.isArray(parsed.concepts) && parsed.concepts.length
        ? parsed.concepts
        : ['Machine Learning', 'Research Paper'],
    comparisonData: {
      innovation: parsed.innovation || 'Novel algorithmic formulation.',
      architecture: parsed.architecture || 'Proposed architectural paradigm.',
      computationalComplexity:
        parsed.computationalComplexity || 'Standard computational complexity.',
      primaryEvaluation:
        parsed.primaryEvaluation || 'Evaluated across experimental benchmarks.',
      limitations: parsed.limitations || 'Identified limitations described in analysis.',
    },
    modelUsed,
  };
}

/**
 * Answers a research question grounded in a specific paper or cross-literature context.
 * Utilizes multi-model fallback across active Gemini models for high availability.
 */
export async function answerQuestionWithGemini({
  question,
  contextPaper,
  allPapers,
  fileBuffer,
  mimeType,
}) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server/.env.');
  }

  const ai = new GoogleGenAI({ apiKey });

  let contextDescription = '';

  if (contextPaper) {
    contextDescription += `GROUNDING RESEARCH PAPER:\n`;
    contextDescription += `Title: ${contextPaper.title || 'Unknown Title'}\n`;
    if (contextPaper.authors) {
      contextDescription += `Authors: ${Array.isArray(contextPaper.authors) ? contextPaper.authors.join(', ') : contextPaper.authors}\n`;
    }
    if (contextPaper.year) contextDescription += `Year: ${contextPaper.year}\n`;
    if (contextPaper.venue) contextDescription += `Venue: ${contextPaper.venue}\n`;
    if (contextPaper.category) contextDescription += `Category: ${contextPaper.category}\n`;
    if (contextPaper.summary) contextDescription += `Summary & Research Problem: ${contextPaper.summary}\n`;
    if (contextPaper.methodology) contextDescription += `Methodology & Formulation: ${contextPaper.methodology}\n`;
    if (contextPaper.keyFindings) {
      contextDescription += `Key Findings & Contributions:\n${Array.isArray(contextPaper.keyFindings) ? contextPaper.keyFindings.map((f) => `- ${f}`).join('\n') : contextPaper.keyFindings}\n`;
    }
    if (contextPaper.comparisonData?.limitations || contextPaper.limitations) {
      contextDescription += `Limitations: ${contextPaper.comparisonData?.limitations || contextPaper.limitations}\n`;
    }
    if (contextPaper.benchmarks) {
      contextDescription += `Empirical Benchmarks: ${JSON.stringify(contextPaper.benchmarks)}\n`;
    }
    if (contextPaper.concepts) {
      contextDescription += `Grounded Concepts: ${Array.isArray(contextPaper.concepts) ? contextPaper.concepts.join(', ') : contextPaper.concepts}\n`;
    }
    if (contextPaper.comparisonData?.innovation) {
      contextDescription += `Key Innovation: ${contextPaper.comparisonData.innovation}\n`;
    }
    if (contextPaper.comparisonData?.architecture) {
      contextDescription += `Architecture: ${contextPaper.comparisonData.architecture}\n`;
    }
  } else if (Array.isArray(allPapers) && allPapers.length > 0) {
    contextDescription += `CROSS-LITERATURE LIBRARY CONTEXT (${allPapers.length} Indexed Papers):\n`;
    allPapers.forEach((p, idx) => {
      contextDescription += `\n[Paper ${idx + 1}]: "${p.title}" (${p.year || 'N/A'})\n`;
      if (p.authors) contextDescription += `Authors: ${Array.isArray(p.authors) ? p.authors.join(', ') : p.authors}\n`;
      if (p.summary) contextDescription += `Summary: ${p.summary}\n`;
      if (p.methodology) contextDescription += `Methodology: ${p.methodology}\n`;
      if (p.keyFindings) {
        contextDescription += `Key Findings: ${Array.isArray(p.keyFindings) ? p.keyFindings.join('; ') : p.keyFindings}\n`;
      }
      if (p.benchmarks) contextDescription += `Benchmarks: ${JSON.stringify(p.benchmarks)}\n`;
    });
  }

  const promptText = `You are Cognipaper Neural Research Assistant, an expert academic AI assistant.
Answer the user's research question accurately, thoroughly, and strictly grounded in the provided research paper material and context above.

Guidelines:
1. Ground your response in the paper's actual methodology, theorems, equations, benchmarks, architecture, and empirical findings.
2. If the user asks about methodology, explain the specific architectural components, mathematical models, training objectives, or algorithms from the document.
3. If the paper does not mention the requested information, state clearly that the paper does not provide that detail rather than speculating.
4. Keep the tone academic, clear, precise, and well-structured with bullet points or formatted sections where helpful for readability.

User Question: ${question}`;

  const contents = [];

  if (fileBuffer && fileBuffer.length > 0) {
    contents.push({
      inlineData: {
        mimeType: mimeType || 'application/pdf',
        data: fileBuffer.toString('base64'),
      },
    });
  }

  if (contextDescription) {
    contents.push({
      text: contextDescription,
    });
  }

  contents.push({
    text: promptText,
  });

  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-2.5-flash',
  ];

  let lastError = null;
  let rawText = '';
  let modelUsed = '';

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
      });

      if (response && response.text) {
        rawText = response.text.trim();
        modelUsed = model;
        break;
      }
    } catch (err) {
      lastError = err;
      // Continue to next candidate
    }
  }

  if (!rawText) {
    throw new Error(
      lastError?.message ||
      'Failed to generate answer from Google Gemini API across candidate models.'
    );
  }

  let papersReferenced = [];
  if (contextPaper?.id) {
    papersReferenced = [contextPaper.id];
  } else if (Array.isArray(allPapers) && allPapers.length > 0) {
    papersReferenced = allPapers
      .filter((p) => p.title && rawText.toLowerCase().includes(p.title.toLowerCase()))
      .map((p) => p.id);
    if (papersReferenced.length === 0) {
      papersReferenced = allPapers.slice(0, 3).map((p) => p.id);
    }
  }

  return {
    answer: rawText,
    papersReferenced,
    modelUsed,
  };
}



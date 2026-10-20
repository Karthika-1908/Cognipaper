/**
 * Cognipaper - Curated Sample Research Papers
 * All items in this dataset are strictly flagged with `isSample: true`
 * and `isAnalyzed: true` to distinguish them from user-uploaded documents.
 */

export const SAMPLE_PAPERS = [
  {
    id: 'sample-1',
    isSample: true,
    isAnalyzed: true,
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: 2017,
    venue: 'NeurIPS 2017',
    doi: '10.48550/arXiv.1706.03762',
    category: 'Transformer Architecture',
    fileSize: '2.1 MB',
    pages: 15,
    statusLabel: 'SAMPLE DATA • ANALYZED',
    summary: 'Proposes the Transformer architecture, replacing recurrent and convolutional neural networks entirely with multi-head self-attention mechanisms for sequence transduction.',
    keyFindings: [
      'Self-attention reduces path length between distant tokens to O(1) operations.',
      'Achieves 28.4 BLEU on WMT 2014 English-to-German, improving by over 2 BLEU over best results.',
      'Parallelizes training significantly, reducing training time from weeks to 3.5 days on 8 P100 GPUs.'
    ],
    methodology: 'Multi-Head Scaled Dot-Product Attention combined with sinusoidal positional encodings and feed-forward point-wise layers with residual connections.',
    benchmarks: {
      'WMT 14 En-De': '28.4 BLEU',
      'WMT 14 En-Fr': '41.8 BLEU',
      'Training Flops': '3.3 × 10¹⁸ FLOPs',
      'Inference Complexity': 'O(n² · d) per layer'
    },
    concepts: ['Multi-Head Attention', 'Self-Attention', 'Transformer', 'Positional Encoding', 'Layer Normalization'],
    citationsCount: 138400,
    uploadDate: 'Pre-indexed Sample',
    comparisonData: {
      innovation: 'Complete elimination of recurrent layers in favor of all-attention sequence mapping.',
      architecture: '6-layer Encoder-Decoder stack with 8 attention heads and sinusoidal positional embeddings.',
      computationalComplexity: 'O(n² · d) memory and compute complexity per self-attention layer.',
      primaryEvaluation: 'WMT 2014 English-to-German and English-to-French machine translation.',
      limitations: 'Quadratic memory scaling with sequence length n restricts very long context processing.'
    }
  },
  {
    id: 'sample-2',
    isSample: true,
    isAnalyzed: true,
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2015,
    venue: 'CVPR 2016 (Best Paper)',
    doi: '10.48550/arXiv.1512.03385',
    category: 'Computer Vision & Deep Learning',
    fileSize: '4.6 MB',
    pages: 12,
    statusLabel: 'SAMPLE DATA • ANALYZED',
    summary: 'Introduces a residual learning framework to ease the training of networks that are substantially deeper than those used previously, overcoming the vanishing/exploding gradient degradation problem.',
    keyFindings: [
      'Explicitly reformulates layers as learning residual functions F(x) = H(x) - x with shortcut identity connections.',
      'Enables training of 152-layer networks (ResNet-152)—8x deeper than VGG while maintaining lower complexity.',
      'Won 1st place in ILSVRC 2015 classification with 3.57% top-5 error rate.'
    ],
    methodology: 'Identity shortcut mappings that perform identity mapping without adding extra parameters or computation.',
    benchmarks: {
      'ImageNet Top-5 Error': '3.57%',
      'COCO Detection mAP': '28.0% (+28% relative gain)',
      'Model Depth': '152 layers',
      'Inference Complexity': 'O(k² · c · h · w)'
    },
    concepts: ['Residual Connections', 'Shortcut Mappings', 'Vanishing Gradients', 'Identity Projection', 'Convolutional Networks'],
    citationsCount: 215000,
    uploadDate: 'Pre-indexed Sample',
    comparisonData: {
      innovation: 'Identity shortcut connections allowing direct gradient propagation through hundreds of layers.',
      architecture: 'Deep convolutional residual blocks with bottleneck (1x1, 3x3, 1x1) transformations.',
      computationalComplexity: 'Linear in image resolution O(H · W · C · K²), constant parameter count per stage.',
      primaryEvaluation: 'ILSVRC & COCO object detection and classification benchmarks.',
      limitations: 'Representation redundancy in very deep layers; does not natively handle non-grid token sequences.'
    }
  },
  {
    id: 'sample-3',
    isSample: true,
    isAnalyzed: true,
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: ['Patrick Lewis', 'Ethan Perez', 'Aleksandra Piktus', 'Fabio Petroni', 'Vladimir Karpukhin', 'et al.'],
    year: 2020,
    venue: 'NeurIPS 2020',
    doi: '10.48550/arXiv.2005.11401',
    category: 'Information Retrieval & LLMs',
    fileSize: '1.8 MB',
    pages: 19,
    statusLabel: 'SAMPLE DATA • ANALYZED',
    summary: 'Builds a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) combining pre-trained parametric (BART) and non-parametric (DPR index over Wikipedia) memory.',
    keyFindings: [
      'RAG models generate more specific, diverse, and factual language than state-of-the-art parametric-only models.',
      'Achieves state-of-the-art results on open-domain QA benchmarks: Natural Questions, WebQuestions, CuratedTREC.',
      'Allows updating external factual knowledge by simply updating the underlying document index without retraining.'
    ],
    methodology: 'Dense Passage Retriever (DPR) coupled with a seq2seq generator (BART) optimized end-to-end via marginalizing retrieved top-K document latents.',
    benchmarks: {
      'Natural Questions Exact Match': '44.5%',
      'WebQuestions EM': '45.5%',
      'TriviaQA EM': '56.1%',
      'Retrieval Index': '21 Million Wikipedia Passages'
    },
    concepts: ['Dense Retrieval', 'RAG', 'Parametric Memory', 'Vector Search', 'Sequence Generation', 'Factuality'],
    citationsCount: 4210,
    uploadDate: 'Pre-indexed Sample',
    comparisonData: {
      innovation: 'Joint training of non-parametric dense vector retriever and parametric generative language model.',
      architecture: 'Dual-encoder Dense Passage Retriever (DPR) + BART encoder-decoder generator.',
      computationalComplexity: 'MIPS index search O(log N) + generative decoding O(K · n² · d).',
      primaryEvaluation: 'Open-domain question answering and knowledge-grounded dialogue generation.',
      limitations: 'Susceptible to retrieval failures when passages lack context or query contains domain misalignment.'
    }
  }
];

export const INITIAL_METRICS = {
  totalPapers: SAMPLE_PAPERS.length,
  analyzedPapers: SAMPLE_PAPERS.filter(p => p.isAnalyzed).length,
  comparisonsCount: 2,
};

export const RESEARCH_CONCEPTS = [
  {
    id: 'c-attn',
    name: 'Multi-Head Attention',
    domain: 'Neural Architecture',
    connectedPapers: ['sample-1'],
    degree: 4,
    x: 28,
    y: 32,
    summary: 'Parallel subspace projections computing pairwise scaled dot-product affinities across token sequences.'
  },
  {
    id: 'c-res',
    name: 'Residual Pathways',
    domain: 'Optimization',
    connectedPapers: ['sample-1', 'sample-2'],
    degree: 5,
    x: 52,
    y: 24,
    summary: 'Skip-connections providing identity routing for uninterrupted backpropagation through ultra-deep graphs.'
  },
  {
    id: 'c-rag',
    name: 'Dense Vector Retrieval',
    domain: 'Information Retrieval',
    connectedPapers: ['sample-3'],
    degree: 3,
    x: 74,
    y: 42,
    summary: 'Dual-encoder embedding spaces mapped to maximum inner product search (MIPS) for sub-millisecond document recall.'
  },
  {
    id: 'c-norm',
    name: 'Layer Normalization',
    domain: 'Optimization',
    connectedPapers: ['sample-1'],
    degree: 3,
    x: 35,
    y: 68,
    summary: 'Feature-wise normalization across hidden dimensions stabilizing hidden activation dynamics.'
  },
  {
    id: 'c-mips',
    name: 'Non-Parametric Memory',
    domain: 'Knowledge Systems',
    connectedPapers: ['sample-3'],
    degree: 3,
    x: 82,
    y: 72,
    summary: 'Decoupled persistent knowledge stores enabling zero-shot external fact retrieval without model parameter updating.'
  },
  {
    id: 'c-conv',
    name: 'Convolutional Kernels',
    domain: 'Computer Vision',
    connectedPapers: ['sample-2'],
    degree: 2,
    x: 60,
    y: 80,
    summary: 'Translation-invariant localized spatial filters extracting multi-scale hierarchical feature maps.'
  }
];

export const SAMPLE_ASSISTANT_QA = [
  {
    query: 'How does self-attention complexity compare to residual convolutional networks?',
    answer: 'In "Attention Is All You Need" (Vaswani et al.), self-attention requires O(n² · d) operations per layer, where n is sequence length and d is representation dimensionality. This provides an O(1) maximum path length between any two distant tokens. In contrast, "Deep Residual Learning" (He et al.) uses convolutional layers with complexity O(k² · c · h · w), requiring O(L/k) steps for information to traverse receptive field depths.',
    papersReferenced: ['sample-1', 'sample-2'],
    type: 'synthesis'
  },
  {
    query: 'What is the role of non-parametric memory in RAG architectures?',
    answer: 'In Lewis et al. (2020), non-parametric memory refers to external text passages indexed via Dense Passage Retrieval (DPR) with FAISS. Unlike parametric weights which require costly retraining to update, the non-parametric store can be replaced, appended, or audited dynamically without modifying a single generative weight.',
    papersReferenced: ['sample-3'],
    type: 'fact-verification'
  },
  {
    query: 'Why do identity shortcut connections prevent vanishing gradients?',
    answer: 'In He et al. (2015), the residual formulation H(x) = F(x) + x ensures that during backpropagation via the chain rule, ∂E/∂x = ∂E/∂H · (∂F/∂x + 1). The constant term "1" guarantees that error gradients can flow directly back to early layers without being multiplied by terms strictly less than one, preventing attenuation even in 1000-layer depths.',
    papersReferenced: ['sample-2'],
    type: 'theoretical'
  }
];

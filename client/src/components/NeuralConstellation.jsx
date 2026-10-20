import { useState } from 'react';

const NODES = [
  // Layer 1: Input Projections
  { id: 'in-1', x: 120, y: 110, r: 4.5, type: 'input', label: 'TOKEN_EMBED_D768', latency: '0.4ms', role: 'Input Token Embedding' },
  { id: 'in-2', x: 130, y: 220, r: 4, type: 'input', label: 'POS_ENCODE_PE', latency: '0.2ms', role: 'Sinusoidal Positional Encoding' },
  { id: 'in-3', x: 120, y: 340, r: 5, type: 'input', label: 'CROSS_MODAL_PRIOR', latency: '0.7ms', role: 'Context Prior Vector' },

  // Layer 2: Self-Attention & Residual Hubs
  { id: 'attn-1', x: 280, y: 90, r: 5.5, type: 'attention', label: 'MHA_HEAD_01..04', latency: '1.2ms', role: 'Multi-Head Attention (Subspaces 1-4)' },
  { id: 'attn-2', x: 290, y: 190, r: 6.5, type: 'attention', label: 'MHA_HEAD_05..08', latency: '1.1ms', role: 'Multi-Head Attention (Subspaces 5-8)' },
  { id: 'attn-3', x: 270, y: 290, r: 4.5, type: 'residual', label: 'RESIDUAL_BYPASS_α', latency: '0.1ms', role: 'Identity Shortcut Stream' },
  { id: 'attn-4', x: 300, y: 390, r: 5, type: 'attention', label: 'KV_CACHE_COMPACT', latency: '0.6ms', role: 'Key-Value Cache Buffer' },

  // Layer 3: Latent Manifold & Representation
  { id: 'lat-1', x: 470, y: 120, r: 6, type: 'manifold', label: 'FFN_GELU_PROJECTION', latency: '1.8ms', role: 'Feed-Forward Expansion [Dim: 3072]' },
  { id: 'lat-2', x: 480, y: 240, r: 7.5, type: 'manifold', label: 'TOPOLOGICAL_CORE', latency: '2.1ms', role: 'Neural Representation Manifold' },
  { id: 'lat-3', x: 460, y: 360, r: 5, type: 'residual', label: 'LAYER_NORM_RMS', latency: '0.3ms', role: 'RMS Normalization Gate' },

  // Layer 4: Synthesis & Output
  { id: 'out-1', x: 650, y: 150, r: 5.5, type: 'output', label: 'SEMANTIC_SIMILARITY', latency: '0.9ms', role: 'Cosine Topology Projection' },
  { id: 'out-2', x: 670, y: 260, r: 6.5, type: 'output', label: 'SYNTHESIS_REASONER', latency: '3.4ms', role: 'Multi-Document Synthesis Node' },
  { id: 'out-3', x: 640, y: 370, r: 4.5, type: 'output', label: 'CONFIDENCE_BOUNDS', latency: '0.5ms', role: 'Epistemic Uncertainty Calibrator' },
];

const EDGES = [
  // Inputs to Attention
  ['in-1', 'attn-1', 0.9],
  ['in-1', 'attn-2', 0.6],
  ['in-2', 'attn-2', 0.85],
  ['in-2', 'attn-3', 0.7],
  ['in-3', 'attn-3', 0.5],
  ['in-3', 'attn-4', 0.8],
  // Attention to Latent
  ['attn-1', 'lat-1', 0.95],
  ['attn-2', 'lat-1', 0.6],
  ['attn-2', 'lat-2', 0.9],
  ['attn-3', 'lat-2', 0.8],
  ['attn-3', 'lat-3', 0.75],
  ['attn-4', 'lat-3', 0.85],
  // Residual jump connections (cross-layer shortcuts)
  ['in-1', 'lat-2', 0.35],
  ['attn-3', 'out-2', 0.4],
  // Latent to Outputs
  ['lat-1', 'out-1', 0.9],
  ['lat-2', 'out-1', 0.7],
  ['lat-2', 'out-2', 0.95],
  ['lat-3', 'out-2', 0.65],
  ['lat-3', 'out-3', 0.85],
];

export const NeuralConstellation = () => {
  const [activeNodeId, setActiveNodeId] = useState('lat-2');
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[7];

  return (
    <div className="neural-constellation-container" aria-label="Neural Network Constellation Visualization">
      {/* HUD Telemetry Header */}
      <div className="constellation-hud">
        <div className="hud-metric">
          <span className="hud-label">TOPOLOGY</span>
          <span className="hud-val">TRANSFORMER_GNN_V4</span>
        </div>
        <div className="hud-metric">
          <span className="hud-label">LATENT_DIM</span>
          <span className="hud-val">768-D DENSE</span>
        </div>
        <div className="hud-metric">
          <span className="hud-label">ACTIVE_NODE</span>
          <span className="hud-val hud-highlight">{activeNode.label}</span>
        </div>
        <div className="hud-metric">
          <span className="hud-label">INFERENCE_SYNC</span>
          <span className="hud-val hud-lime">NOMINAL</span>
        </div>
      </div>

      <svg
        viewBox="0 0 800 480"
        className="neural-svg"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Abstract Neural Topology Graph"
      >
        <defs>
          {/* Subtle cyan glow filter */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="limeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#49E6F5" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#49E6F5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B8F36B" stopOpacity="0.2" />
          </linearGradient>

          <pattern id="scientificGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#243746" strokeWidth="0.5" strokeOpacity="0.35" />
            <circle cx="0" cy="0" r="0.8" fill="#49E6F5" fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* Scientific Cartesian Grid */}
        <rect width="800" height="480" fill="url(#scientificGrid)" />

        {/* Coordinate tick marks and telemetry markers */}
        <g className="grid-telemetry" fill="#647786" fontSize="8" fontFamily="var(--mono)" letterSpacing="1">
          <text x="20" y="24">SEC_01 // REF: 10.48550/NEURAL</text>
          <text x="680" y="24">λ: 1.042e-4</text>
          <text x="20" y="468">AFFINITY_THRESHOLD: 0.72</text>
          <text x="690" y="468">DIM: [B, L, 768]</text>

          {/* Reference Axis Guides */}
          <line x1="200" y1="40" x2="200" y2="450" stroke="#243746" strokeWidth="0.5" strokeDasharray="3 4" strokeOpacity="0.4" />
          <line x1="380" y1="40" x2="380" y2="450" stroke="#243746" strokeWidth="0.5" strokeDasharray="3 4" strokeOpacity="0.4" />
          <line x1="560" y1="40" x2="560" y2="450" stroke="#243746" strokeWidth="0.5" strokeDasharray="3 4" strokeOpacity="0.4" />
          <line x1="30" y1="240" x2="770" y2="240" stroke="#243746" strokeWidth="0.5" strokeDasharray="2 6" strokeOpacity="0.3" />

          {/* Layer Headers */}
          <text x="110" y="55" fill="#49E6F5" opacity="0.6">LAYER 0: INPUT</text>
          <text x="260" y="55" fill="#49E6F5" opacity="0.6">LAYER 1: ATTENTION</text>
          <text x="440" y="55" fill="#49E6F5" opacity="0.6">LAYER 2: LATENT</text>
          <text x="630" y="55" fill="#B8F36B" opacity="0.7">LAYER 3: SYNTHESIS</text>
        </g>

        {/* Synapse Edges */}
        <g className="synapse-edges">
          {EDGES.map(([srcId, dstId, weight], idx) => {
            const src = NODES.find((n) => n.id === srcId);
            const dst = NODES.find((n) => n.id === dstId);
            if (!src || !dst) return null;
            const isConnectedToActive = activeNodeId === srcId || activeNodeId === dstId;
            const isShortcut = Math.abs(src.x - dst.x) > 200;

            // Generate slight bezier curve for scientific elegance
            const midX = (src.x + dst.x) / 2;
            const midY = (src.y + dst.y) / 2 + (isShortcut ? (src.y > dst.y ? -25 : 25) : 0);
            const pathData = `M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`;

            return (
              <path
                key={`edge-${idx}`}
                d={pathData}
                fill="none"
                stroke={isConnectedToActive ? '#49E6F5' : '#243746'}
                strokeWidth={isConnectedToActive ? 1.6 : 0.9}
                strokeOpacity={isConnectedToActive ? 0.85 : weight * 0.4}
                strokeDasharray={isShortcut ? '4 3' : undefined}
                className={isConnectedToActive ? 'active-synapse' : 'synapse-line'}
                style={{
                  transition: 'stroke 0.3s ease, stroke-width 0.3s ease, stroke-opacity 0.3s ease'
                }}
              />
            );
          })}
        </g>

        {/* Flow Particles for subtle organic life */}
        <g className="flow-particles" opacity="0.6">
          <circle cx="205" cy="100" r="1.5" fill="#49E6F5" className="particle-pulse particle-1" />
          <circle cx="380" cy="180" r="1.5" fill="#49E6F5" className="particle-pulse particle-2" />
          <circle cx="560" cy="250" r="1.8" fill="#B8F36B" className="particle-pulse particle-3" />
        </g>

        {/* Network Nodes */}
        <g className="network-nodes">
          {NODES.map((node) => {
            const isActive = activeNodeId === node.id;
            const isCore = node.id === 'lat-2';

            return (
              <g
                key={node.id}
                className="node-group"
                tabIndex={0}
                role="button"
                aria-label={`Node ${node.label}: ${node.role}`}
                onClick={() => setActiveNodeId(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveNodeId(node.id);
                  }
                }}
                onMouseEnter={() => setActiveNodeId(node.id)}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {/* Node Outer Halo for active state */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r * 2.8}
                    fill="none"
                    stroke={isCore ? '#B8F36B' : '#49E6F5'}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    strokeDasharray="2 3"
                    className="pulse-halo"
                  />
                )}

                {/* Ambient Glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + (isActive ? 3 : 1)}
                  fill={isCore ? '#B8F36B' : '#49E6F5'}
                  fillOpacity={isActive ? 0.35 : 0.15}
                  filter={isCore ? 'url(#limeGlow)' : 'url(#cyanGlow)'}
                />

                {/* Node Solid Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={isCore ? '#B8F36B' : isActive ? '#49E6F5' : '#0C1D2A'}
                  stroke={isCore ? '#07121D' : isActive ? '#B8F36B' : '#49E6F5'}
                  strokeWidth={isActive ? 2 : 1.2}
                  className="node-circle"
                />

                {/* Node Identifier Label */}
                <text
                  x={node.x}
                  y={node.y + node.r + 13}
                  textAnchor="middle"
                  fill={isActive ? '#FFFFFF' : '#647786'}
                  fontSize="7.5"
                  fontFamily="var(--mono)"
                  letterSpacing="0.5"
                  className="node-caption"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Node Details Callout */}
      <div className="constellation-callout" role="status" aria-live="polite">
        <div className="callout-indicator">
          <span className="callout-dot"></span>
          <span className="callout-type">{activeNode.type.toUpperCase()} NODE</span>
        </div>
        <div className="callout-role">{activeNode.role}</div>
        <div className="callout-footer">
          <span className="callout-meta">LATENCY: {activeNode.latency}</span>
          <span className="callout-meta">AFFINITY: OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};

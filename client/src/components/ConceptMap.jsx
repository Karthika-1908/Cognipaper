import { useState } from 'react';
import { RESEARCH_CONCEPTS, SAMPLE_PAPERS } from '../data/samplePapers';
import { NetworkIcon, ArrowRightIcon } from './Icons';

export const ConceptMap = ({ onInspectPaper }) => {
  const [selectedConceptId, setSelectedConceptId] = useState('c-res');
  const [activeFilter, setActiveFilter] = useState('all');

  const selectedConcept =
    RESEARCH_CONCEPTS.find((c) => c.id === selectedConceptId) || RESEARCH_CONCEPTS[0];

  const connectedPapers = SAMPLE_PAPERS.filter((paper) =>
    selectedConcept.connectedPapers.includes(paper.id)
  );

  return (
    <section className="concept-map-section" aria-label="Topological Research Concept Connections">
      <div className="concept-header-bar">
        <div className="concept-title-group">
          <div className="concept-badge">
            <NetworkIcon size={16} />
            <span>TOPOLOGICAL MAP</span>
          </div>
          <h3 className="concept-main-title">Concept Connections &amp; Literature Topology</h3>
          <p className="concept-subtitle">
            Interactive neural graph mapping shared methodologies, mathematical formulations, and citation pathways.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="concept-filters" role="tablist" aria-label="Concept domain filters">
          {['all', 'Neural Architecture', 'Optimization', 'Information Retrieval'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`concept-filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all' ? 'All Domains' : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="concept-map-layout">
        {/* Interactive SVG Graph Area */}
        <div className="concept-graph-canvas" role="region" aria-label="Interactive concept node diagram">
          <svg viewBox="0 0 700 420" className="concept-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="conceptEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#49E6F5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#B8F36B" stopOpacity="0.3" />
              </linearGradient>
              <pattern id="dotMatrix" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="0.75" fill="#243746" fillOpacity="0.5" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="700" height="420" fill="url(#dotMatrix)" />

            {/* Central Synthesis Meridian */}
            <line x1="350" y1="20" x2="350" y2="400" stroke="#243746" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.5" />
            <line x1="20" y1="210" x2="680" y2="210" stroke="#243746" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.5" />

            {/* Connection Lines between concepts */}
            <g className="concept-edges">
              {/* Residual to Attention */}
              <line x1="196" y1="134" x2="364" y2="100" stroke="#49E6F5" strokeWidth="1.5" strokeOpacity="0.6" />
              {/* Residual to LayerNorm */}
              <line x1="364" y1="100" x2="245" y2="285" stroke="#49E6F5" strokeWidth="1.2" strokeOpacity="0.5" />
              {/* Residual to CNN */}
              <line x1="364" y1="100" x2="420" y2="336" stroke="#B8F36B" strokeWidth="1.2" strokeOpacity="0.5" />
              {/* Dense Retrieval to MIPS */}
              <line x1="518" y1="176" x2="574" y2="302" stroke="#49E6F5" strokeWidth="1.4" strokeOpacity="0.5" />
              {/* Attention to Dense Retrieval (Cross-modal bridge) */}
              <path
                d="M 196 134 Q 350 180 518 176"
                fill="none"
                stroke="#49E6F5"
                strokeWidth="1"
                strokeDasharray="4 3"
                strokeOpacity="0.4"
              />
            </g>

            {/* Render Concept Nodes */}
            <g className="concept-nodes-group">
              {RESEARCH_CONCEPTS.map((concept) => {
                const cx = (concept.x / 100) * 700;
                const cy = (concept.y / 100) * 420;
                const isSelected = selectedConceptId === concept.id;
                const isFilteredOut = activeFilter !== 'all' && concept.domain !== activeFilter;

                return (
                  <g
                    key={concept.id}
                    className={`concept-node-anchor ${isSelected ? 'selected' : ''} ${isFilteredOut ? 'dimmed' : ''}`}
                    onClick={() => setSelectedConceptId(concept.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Concept: ${concept.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedConceptId(concept.id);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {/* Outer Ring */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="22"
                        fill="none"
                        stroke="#B8F36B"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="spin-ring"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '14' : '10'}
                      fill={isSelected ? '#0C1D2A' : '#07121D'}
                      stroke={isSelected ? '#B8F36B' : '#49E6F5'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />

                    {/* Center Glyph */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '5' : '3'}
                      fill={isSelected ? '#B8F36B' : '#49E6F5'}
                    />

                    {/* Node Label */}
                    <text
                      x={cx}
                      y={cy + 22}
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#8A9DAE'}
                      fontSize="9.5"
                      fontFamily="var(--sans)"
                      fontWeight={isSelected ? '600' : '500'}
                    >
                      {concept.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Concept Inspector Sidebar */}
        <div className="concept-inspector-card" role="region" aria-label="Concept Inspector">
          <div className="inspector-header">
            <span className="inspector-eyebrow">{selectedConcept.domain.toUpperCase()}</span>
            <h4 className="inspector-title">{selectedConcept.name}</h4>
          </div>

          <p className="inspector-summary">{selectedConcept.summary}</p>

          <div className="inspector-connected-section">
            <span className="connected-label">GROUNDED IN LITERATURE:</span>
            <div className="connected-papers-list">
              {connectedPapers.map((paper) => (
                <div key={paper.id} className="connected-paper-item">
                  <div className="connected-paper-info">
                    <span className="conn-title">{paper.title}</span>
                    <span className="conn-authors">
                      {paper.authors[0]} et al. ({paper.year})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="conn-view-btn"
                    onClick={() => onInspectPaper(paper)}
                    title="View paper analysis"
                  >
                    <span>View</span>
                    <ArrowRightIcon size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="inspector-telemetry">
            <div className="telemetry-box">
              <span className="t-key">CENTRALITY</span>
              <span className="t-val">{selectedConcept.degree} Connected Hubs</span>
            </div>
            <div className="telemetry-box">
              <span className="t-key">AFFINITY</span>
              <span className="t-val t-lime">0.94 Cosine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

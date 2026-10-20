import {
  AnalyzeIcon,
  QuestionIcon,
  CompareIcon,
  LibraryIcon,
  ArrowRightIcon,
} from './Icons';

export const FeatureCards = ({ onSelectTab }) => {
  const features = [
    {
      id: 'analyze',
      title: 'Analyze Paper',
      description:
        'Generate a structured summary, objectives, methodology, key findings, and limitations.',
      actionLabel: 'Analyze a PDF',
      icon: AnalyzeIcon,
      accentClass: 'feature-blue',
    },
    {
      id: 'ask',
      title: 'Ask Questions',
      description:
        'Ask questions and get answers grounded in the selected research paper.',
      actionLabel: 'Ask a question',
      icon: QuestionIcon,
      accentClass: 'feature-teal',
    },
    {
      id: 'compare',
      title: 'Compare Papers',
      description:
        'Compare research approaches, methods, results, and limitations across papers.',
      actionLabel: 'Compare research',
      icon: CompareIcon,
      accentClass: 'feature-indigo',
    },
    {
      id: 'papers',
      title: 'My Papers',
      description:
        'View and manage uploaded papers and their analysis status.',
      actionLabel: 'Open library',
      icon: LibraryIcon,
      accentClass: 'feature-slate',
    },
  ];

  return (
    <section className="features-grid-section" aria-label="Research Assistant Core Features">
      <div className="features-grid">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className={`feature-card ${item.accentClass}`}>
              <div className="feature-icon-wrapper">
                <Icon size={20} />
              </div>

              <div className="feature-content">
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.description}</p>
              </div>

              <div className="feature-action-footer">
                <button
                  type="button"
                  className="btn-accent feature-btn"
                  onClick={() => onSelectTab(item.id)}
                  id={`feature-btn-${item.id}`}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRightIcon size={13} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

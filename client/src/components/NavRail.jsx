
import { LogoIcon, DashboardIcon, PapersIcon, CompareIcon, AssistantIcon, NetworkIcon } from './Icons';

export const NavRail = ({ currentTab, onSelectTab, papersCount, unanalyzedCount }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      badge: null,
    },
    {
      id: 'papers',
      label: 'My Papers',
      icon: PapersIcon,
      badge: papersCount > 0 ? papersCount : null,
      badgeWarn: unanalyzedCount > 0 ? `${unanalyzedCount} new` : null,
    },
    {
      id: 'compare',
      label: 'Compare Papers',
      icon: CompareIcon,
      badge: 'Matrix',
    },
    {
      id: 'assistant',
      label: 'Research Assistant',
      icon: AssistantIcon,
      badge: 'Q&A',
    },
    {
      id: 'map',
      label: 'Concept Map',
      icon: NetworkIcon,
      badge: null,
    },
  ];

  return (
    <aside className="nav-rail" aria-label="Main Navigation">
      {/* Brand Icon Hub */}
      <div className="nav-rail-brand" title="Cognipaper Neural Lab">
        <LogoIcon size={28} />
      </div>

      {/* Navigation Links */}
      <nav className="nav-rail-menu">
        <ul className="nav-rail-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <li key={item.id} className="nav-rail-item">
                <button
                  type="button"
                  id={`nav-btn-${item.id}`}
                  className={`nav-rail-button ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                >
                  <span className="nav-icon-wrapper">
                    <Icon size={19} />
                    {isActive && <span className="nav-active-pip" aria-hidden="true"></span>}
                  </span>
                  <span className="nav-rail-label">{item.label}</span>
                  {item.badgeWarn ? (
                    <span className="nav-rail-badge warn" title={`${unanalyzedCount} uploaded files pending backend analysis`}>
                      {item.badgeWarn}
                    </span>
                  ) : item.badge ? (
                    <span className="nav-rail-badge">{item.badge}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Telemetry Status */}
      <div className="nav-rail-footer">
        <div className="nav-footer-status" title="Local Client Standalone Mode">
          <span className="nav-status-dot offline"></span>
          <span className="nav-status-label">v2.4 LOCAL</span>
        </div>
      </div>
    </aside>
  );
};

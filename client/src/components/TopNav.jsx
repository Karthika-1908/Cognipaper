import { useState } from 'react';
import {
  LogoIcon,
  HomeIcon,
  AnalyzeIcon,
  QuestionIcon,
  CompareIcon,
  LibraryIcon,
  MenuIcon,
  CloseIcon,
} from './Icons';

export const TopNav = ({ currentTab, onSelectTab, papersCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'analyze', label: 'Analyze Paper', icon: AnalyzeIcon },
    { id: 'ask', label: 'Ask Questions', icon: QuestionIcon },
    { id: 'compare', label: 'Compare Papers', icon: CompareIcon },
    {
      id: 'papers',
      label: 'My Papers',
      icon: LibraryIcon,
      badge: papersCount > 0 ? papersCount : null,
    },
  ];

  const handleNavClick = (id) => {
    onSelectTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="topnav-header" aria-label="Main Site Navigation">
      <div className="topnav-container">
        {/* Brand Area */}
        <div
          className="topnav-brand"
          onClick={() => handleNavClick('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavClick('home');
            }
          }}
          title="Cognipaper - Return to Home"
        >
          <LogoIcon size={26} />
          <div className="brand-titles">
            <span className="brand-name">Cognipaper</span>
            <span className="brand-subtitle">AI Research Paper Assistant</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="topnav-menu-desktop" aria-label="Primary Navigation">
          <ul className="topnav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <li key={item.id} className="topnav-item">
                  <button
                    type="button"
                    className={`topnav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    id={`nav-link-${item.id}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge" aria-label={`${item.badge} papers in library`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="topnav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <nav className="topnav-mobile-drawer" aria-label="Mobile Navigation">
          <ul className="topnav-mobile-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`topnav-mobile-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

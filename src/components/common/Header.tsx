import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import type { SiteSettings } from '@/types';
import BrandMark, { hasCustomLogo } from '@/components/common/BrandMark';

interface HeaderProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/coaching', label: 'Le coaching' },
  { path: '/jury', label: 'Le jury' },
  { path: '/gastronomie', label: 'La gastronomie' },
  { path: '/mes-concours', label: 'Mes concours' },
  { path: '/galerie', label: 'Galerie' },
  { path: '/temoignages', label: 'Témoignages' },
  { path: '/actualites', label: 'Actualités' },
  { path: '/contact', label: 'Contact' },
];

export default function Header({ settings, currentPath, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Empêche le défilement de la page derrière le menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}>
      <div className="header-inner">
        <button
          className="brand"
          onClick={() => handleLinkClick('/')}
          aria-label={`Accueil ${settings.site_name}`}
        >
          {hasCustomLogo(settings.logo_url) ? (
            <img src={settings.logo_url} alt="" />
          ) : (
            <BrandMark size={42} />
          )}
          <span className="brand-name">
            Couronne <i>&</i> Toque
          </span>
        </button>

        <nav className={`nav-menu ${mobileOpen ? 'open' : ''}`} aria-label="Navigation principale">
          {navLinks.map((link, index) => {
            const isActive =
              link.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.path);

            return (
              <button
                key={link.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleLinkClick(link.path)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="nav-label">{link.label}</span>
              </button>
            );
          })}

          <button
            className="nav-cta"
            onClick={() => handleLinkClick('/contact')}
          >
            <span>Me contacter</span>
            <ArrowUpRight size={15} />
          </button>
        </nav>

        <button
          className="menu-button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
        </button>
      </div>
    </header>
  );
}

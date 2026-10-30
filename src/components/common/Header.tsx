import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Facebook, Instagram, Mail, MessageCircle, Phone, Youtube } from 'lucide-react';
import type { SiteSettings } from '@/types';
import BrandMark from '@/components/common/BrandMark';
import BrandName from '@/components/common/BrandName';
import { hasCustomLogo } from '@/lib/brand';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

interface HeaderProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
}

// Les trois métiers, regroupés sous « Expertises »
const expertises = [
  { path: '/coaching', label: 'Le coaching', desc: 'Préparer les candidates aux concours de beauté' },
  { path: '/jury', label: 'Le jury', desc: 'Évaluer avec exigence et bienveillance' },
  { path: '/gastronomie', label: 'La gastronomie', desc: 'Une cuisine raffinée pour vos réceptions' },
];

// Rubriques placées après « Expertises » (l'accueil passe par le logo, le contact par le bouton)
const mainLinks = [
  { path: '/mes-concours', label: 'Concours' },
  { path: '/galerie', label: 'Galerie' },
  { path: '/temoignages', label: 'Témoignages' },
  { path: '/actualites', label: 'Actualités' },
];

export default function Header({ settings, currentPath, onNavigate }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Panneau mobile ouvert : la page ne défile plus ; Échap referme panneau et sous-menu
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDrawerOpen(false);
      setDropdownOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  // Clic en dehors du sous-menu : on le referme
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [dropdownOpen]);

  const go = (path: string) => {
    onNavigate(path);
    setDrawerOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path: string) => (path === '/' ? currentPath === '/' : currentPath.startsWith(path));
  const expertiseActive = expertises.some((e) => isActive(e.path));

  // Sur l'accueil, l'en-tête se pose en transparence sur la photo tant qu'on n'a pas défilé
  const overHero = currentPath === '/' && !scrolled;
  const whatsappUrl = settings.whatsapp_number ? `https://wa.me/${normalizeWhatsAppNumber(settings.whatsapp_number)}` : '';
  const socials = [
    { url: settings.instagram_url, label: 'Instagram', Icon: Instagram },
    { url: settings.facebook_url, label: 'Facebook', Icon: Facebook },
    { url: settings.youtube_url, label: 'YouTube', Icon: Youtube },
  ].filter((s) => s.url);
  const drawerTab = drawerOpen ? 0 : -1;

  return (
    <header className={['site-header', scrolled ? 'is-scrolled' : '', overHero ? 'is-over-hero' : ''].join(' ')}>

      {/* BARRE PRINCIPALE */}
      <div className="header-main">
        <button className="brand" onClick={() => go('/')} aria-label={`Accueil ${settings.site_name}`}>
          {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={42} />}
          <BrandName name={settings.site_name} />
        </button>

        <nav className="header-nav" aria-label="Navigation principale">
          <button
            className={`nav-link ${isActive('/a-propos') ? 'active' : ''}`}
            onClick={() => go('/a-propos')}
            aria-current={isActive('/a-propos') ? 'page' : undefined}
          >
            À propos
          </button>

          <div
            ref={dropdownRef}
            className={`nav-dropdown ${dropdownOpen ? 'open' : ''}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`nav-link ${expertiseActive ? 'active' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Expertises <ChevronDown size={13} className="nav-caret" />
            </button>
            <div className="nav-panel">
              {expertises.map((item, index) => (
                <button
                  key={item.path}
                  className={`nav-panel-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => go(item.path)}
                  tabIndex={dropdownOpen ? 0 : -1}
                >
                  <span className="nav-panel-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="nav-panel-text">
                    <strong>{item.label}</strong>
                    <small>{item.desc}</small>
                  </span>
                  <ArrowUpRight size={16} className="nav-panel-arrow" />
                </button>
              ))}
            </div>
          </div>

          {mainLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => go(link.path)}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="header-cta" onClick={() => go('/contact')}>
            <span>Prendre contact</span>
            <ArrowUpRight size={15} />
          </button>
          <button
            className="drawer-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={drawerOpen}
            aria-controls="site-drawer"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* PANNEAU LATÉRAL (tablette & mobile) */}
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside id="site-drawer" className={`site-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <span className="brand">
            {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={34} />}
            <BrandName name={settings.site_name} />
          </span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Fermer le menu" tabIndex={drawerTab}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Navigation mobile">
          <button className={`drawer-link ${isActive('/') ? 'active' : ''}`} onClick={() => go('/')} tabIndex={drawerTab}>
            Accueil
          </button>
          <button className={`drawer-link ${isActive('/a-propos') ? 'active' : ''}`} onClick={() => go('/a-propos')} tabIndex={drawerTab}>
            À propos
          </button>
          <p className="drawer-group">Expertises</p>
          {expertises.map((item) => (
            <button
              key={item.path}
              className={`drawer-link drawer-sublink ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => go(item.path)}
              tabIndex={drawerTab}
            >
              {item.label}
            </button>
          ))}
          <span className="drawer-sep" />
          {mainLinks.map((link) => (
            <button
              key={link.path}
              className={`drawer-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => go(link.path)}
              tabIndex={drawerTab}
            >
              {link.label}
            </button>
          ))}
          <button className={`drawer-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => go('/contact')} tabIndex={drawerTab}>
            Contact
          </button>
        </nav>

        <div className="drawer-foot">
          {settings.contact_phone && (
            <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} tabIndex={drawerTab}>
              <Phone size={15} /> {settings.contact_phone}
            </a>
          )}
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} tabIndex={drawerTab}>
              <Mail size={15} /> {settings.contact_email}
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" tabIndex={drawerTab}>
              <MessageCircle size={15} /> WhatsApp
            </a>
          )}
          {socials.length > 0 && (
            <div className="drawer-socials">
              {socials.map(({ url, label, Icon }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} tabIndex={drawerTab}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
          <button className="button button-ivory" onClick={() => go('/contact')} tabIndex={drawerTab}>
            <span>Prendre contact</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </aside>
    </header>
  );
}

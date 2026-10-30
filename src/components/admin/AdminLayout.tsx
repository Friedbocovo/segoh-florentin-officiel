import { useState } from 'react';
import {
  ArrowUpRight, Award, BookOpen, Crown, FileText, Globe, Image, LayoutDashboard,
  Layers, LogOut, Mail, Menu, MessageSquare, Palette, Settings2, Utensils, X
} from 'lucide-react';
import type { ContactMessage, SiteSettings, Testimonial } from '@/types';
import BrandMark from '@/components/common/BrandMark';
import BrandName from '@/components/common/BrandName';
import { hasCustomLogo } from '@/lib/brand';

export type AdminTab =
  | 'dashboard'
  | 'sections'
  | 'coaching'
  | 'jury'
  | 'gastronomie'
  | 'contests'
  | 'media'
  | 'testimonials'
  | 'articles'
  | 'messages'
  | 'seo'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  settings: SiteSettings;
  unreadMessagesCount: number;
  pendingTestimonialsCount: number;
  onExit: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  currentTab,
  onTabChange,
  settings,
  unreadMessagesCount,
  pendingTestimonialsCount,
  onExit,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-container">
      {/* MOBILE TOP BAR */}
      <div className="admin-mobile-bar">
        <button className="brand" onClick={onExit}>
          {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={36} />}
          <BrandName name={settings.site_name} />
        </button>
        <button
          className="admin-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu admin"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button className="brand sidebar-brand" onClick={onExit}>
            {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={36} />}
            <BrandName name={settings.site_name} />
          </button>
          <span className="cms-tag">Administration CMS</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="nav-group-title">Général</span>
            <button
              className={`nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSelectTab('dashboard')}
            >
              <LayoutDashboard size={17} />
              <span>Tableau de bord</span>
            </button>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Contenus du site</span>

            <button
              className={`nav-btn ${currentTab === 'sections' ? 'active' : ''}`}
              onClick={() => handleSelectTab('sections')}
            >
              <Layers size={17} />
              <span>Pages & Sections</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'coaching' ? 'active' : ''}`}
              onClick={() => handleSelectTab('coaching')}
            >
              <Crown size={17} />
              <span>Le coaching</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'jury' ? 'active' : ''}`}
              onClick={() => handleSelectTab('jury')}
            >
              <Award size={17} />
              <span>Le jury</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'gastronomie' ? 'active' : ''}`}
              onClick={() => handleSelectTab('gastronomie')}
            >
              <Utensils size={17} />
              <span>La gastronomie</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'contests' ? 'active' : ''}`}
              onClick={() => handleSelectTab('contests')}
            >
              <Crown size={17} className="text-red" />
              <span>Concours & Palmarès</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'media' ? 'active' : ''}`}
              onClick={() => handleSelectTab('media')}
            >
              <Image size={17} />
              <span>Galerie & Médias</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => handleSelectTab('testimonials')}
            >
              <MessageSquare size={17} />
              <span>Témoignages</span>
              {pendingTestimonialsCount > 0 && (
                <span className="counter-badge pulse">{pendingTestimonialsCount}</span>
              )}
            </button>

            <button
              className={`nav-btn ${currentTab === 'articles' ? 'active' : ''}`}
              onClick={() => handleSelectTab('articles')}
            >
              <BookOpen size={17} />
              <span>Actualités</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'messages' ? 'active' : ''}`}
              onClick={() => handleSelectTab('messages')}
            >
              <Mail size={17} />
              <span>Messages & Demandes</span>
              {unreadMessagesCount > 0 && (
                <span className="counter-badge">{unreadMessagesCount}</span>
              )}
            </button>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Configuration</span>

            <button
              className={`nav-btn ${currentTab === 'seo' ? 'active' : ''}`}
              onClick={() => handleSelectTab('seo')}
            >
              <Globe size={17} />
              <span>Référencement (SEO)</span>
            </button>

            <button
              className={`nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleSelectTab('settings')}
            >
              <Palette size={17} />
              <span>Apparence & Réglages</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-action-btn view-site-btn" onClick={onExit}>
            <ArrowUpRight size={16} />
            <span>Voir le site public</span>
          </button>
          <button className="sidebar-action-btn logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ZONE DE CONTENU PRINCIPALE */}
      <main className="admin-content-area">{children}</main>
    </div>
  );
}

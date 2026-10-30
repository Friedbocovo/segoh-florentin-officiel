import {
  ArrowUpRight, Award, BookOpen, CheckCircle2, ChevronRight, Clock, Crown,
  Database, Image, LoaderCircle, Mail, MessageSquare, Plus, Trophy, Utensils
} from 'lucide-react';
import { useState } from 'react';
import type { Article, ContactMessage, Contest, MediaItem, Testimonial } from '@/types';
import type { AdminTab } from './AdminLayout';
import Picture from '@/components/common/Picture';

interface AdminDashboardProps {
  contests: Contest[];
  articles: Article[];
  media: MediaItem[];
  messages: ContactMessage[];
  testimonials: Testimonial[];
  onNavigateTab: (tab: AdminTab) => void;
  onQuickAction: (action: string) => void;
  /** Fourni uniquement si une base Supabase est branchée */
  onImportDemo?: () => Promise<void>;
}

export default function AdminDashboard({
  contests,
  articles,
  media,
  messages,
  testimonials,
  onNavigateTab,
  onQuickAction,
  onImportDemo,
}: AdminDashboardProps) {
  const [importing, setImporting] = useState(false);
  const isDatabaseEmpty = contests.length === 0 && articles.length === 0;

  async function handleImportDemo() {
    if (!onImportDemo) return;
    if (!window.confirm('Importer le contenu de démonstration (sections, concours, articles, médias…) dans la base ?')) return;
    setImporting(true);
    try {
      await onImportDemo();
    } finally {
      setImporting(false);
    }
  }

  // Calcul des métriques réelles
  const publishedContests = contests.filter((c) => c.is_published).length;
  const draftContests = contests.length - publishedContests;
  const totalResults = contests.reduce((acc, c) => acc + (c.results?.length || 0), 0);
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const pendingTestimonials = testimonials.filter((t) => t.status === 'pending').length;
  const publishedArticles = articles.filter((a) => a.is_published).length;

  const recentMessages = messages.slice(0, 4);
  const recentContests = contests.slice(0, 3);

  return (
    <div className="dashboard-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Vue d’ensemble</p>
          <h1>Tableau de bord</h1>
        </div>
        <div className="quick-action-btns">
          <button className="button button-dark" onClick={() => onNavigateTab('contests')}>
            <Plus size={16} />
            <span>Nouveau concours</span>
          </button>
          <button className="button button-light" onClick={() => onNavigateTab('articles')}>
            <Plus size={16} />
            <span>Nouvel article</span>
          </button>
        </div>
      </div>

      {onImportDemo && isDatabaseEmpty && (
        <div className="admin-flash-banner">
          <Database size={16} />
          <span>Aucun concours ni article en base. Vous pouvez importer le contenu de démonstration (seules les rubriques encore vides sont remplies), puis le modifier.</span>
          <button className="button button-dark" onClick={handleImportDemo} disabled={importing}>
            {importing ? <LoaderCircle className="spin" size={15} /> : <Plus size={15} />}
            <span>{importing ? 'Import…' : 'Importer'}</span>
          </button>
        </div>
      )}

      {/* CARTES D'INDICATEURS RÉELS - SUR LA MÊME LIGNE */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigateTab('contests')} title="Voir les concours">
          <div className="kpi-icon-wrap bg-red-soft">
            <Trophy size={18} className="text-red" />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Concours</span>
            <strong className="kpi-value">{contests.length}</strong>
            <span className="kpi-sub" title={`${publishedContests} publiés · ${draftContests} brouillons`}>
              {publishedContests} pub. · {draftContests} br.
            </span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('contests')} title="Voir les distinctions">
          <div className="kpi-icon-wrap bg-gold-soft">
            <Crown size={18} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Distinctions</span>
            <strong className="kpi-value">{totalResults}</strong>
            <span className="kpi-sub" title="Candidats primés accompagnés">
              Candidats primés
            </span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('messages')} title="Voir les messages">
          <div className="kpi-icon-wrap bg-blue-soft">
            <Mail size={18} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Messages</span>
            <strong className="kpi-value">{messages.length}</strong>
            <span className={`kpi-sub ${unreadMessages > 0 ? 'text-red font-bold' : ''}`}>
              {unreadMessages > 0 ? `${unreadMessages} non lu${unreadMessages > 1 ? 's' : ''}` : 'Tous lus'}
            </span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('testimonials')} title="Voir les témoignages">
          <div className="kpi-icon-wrap bg-green-soft">
            <MessageSquare size={18} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Témoignages</span>
            <strong className="kpi-value">{testimonials.length}</strong>
            <span className={`kpi-sub ${pendingTestimonials > 0 ? 'text-orange font-bold' : ''}`}>
              {pendingTestimonials > 0 ? `${pendingTestimonials} en attente` : 'Tous validés'}
            </span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('articles')} title="Voir les articles">
          <div className="kpi-icon-wrap">
            <BookOpen size={18} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Articles</span>
            <strong className="kpi-value">{publishedArticles}</strong>
            <span className="kpi-sub">
              Sur {articles.length} au total
            </span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('media')} title="Voir la galerie">
          <div className="kpi-icon-wrap">
            <Image size={18} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Médias</span>
            <strong className="kpi-value">{media.length}</strong>
            <span className="kpi-sub">
              Photos & vidéos
            </span>
          </div>
        </div>
      </div>

      {/* DEUX COLONNES : MESSAGES RÉCENTS ET CONCOURS RÉCENTS */}
      <div className="dashboard-dual-section">
        {/* MESSAGES RÉCENTS */}
        <section className="dashboard-panel">
          <div className="panel-head">
            <h3>Dernières demandes reçues</h3>
            <button className="text-link" onClick={() => onNavigateTab('messages')}>
              <span>Voir tout</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="empty-panel-text">Aucun message pour le moment.</p>
          ) : (
            <div className="dashboard-messages-list">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`msg-summary-row ${msg.status === 'unread' ? 'unread' : ''}`}
                  onClick={() => onNavigateTab('messages')}
                >
                  <div className="msg-row-top">
                    <span className="msg-purpose-tag">{msg.purpose}</span>
                    <span className="msg-date">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h4>{msg.subject}</h4>
                  <p>{msg.message.slice(0, 95)}...</p>
                  <span className="msg-author">{msg.name} ({msg.email})</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONCOURS RÉCENTS */}
        <section className="dashboard-panel">
          <div className="panel-head">
            <h3>Derniers concours ajoutés</h3>
            <button className="text-link" onClick={() => onNavigateTab('contests')}>
              <span>Gérer les concours</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {recentContests.length === 0 ? (
            <p className="empty-panel-text">Aucun concours enregistré.</p>
          ) : (
            <div className="dashboard-contests-list">
              {recentContests.map((c) => (
                <div
                  key={c.id}
                  className="contest-summary-row"
                  onClick={() => onNavigateTab('contests')}
                >
                  <div className="contest-thumb-mini">
                    <Picture src={c.cover_image} alt="" />
                  </div>
                  <div className="contest-row-info">
                    <span className="contest-tag">{c.edition} · {c.location}</span>
                    <h4>{c.name}</h4>
                    <span className="results-count">
                      <Trophy size={13} /> {c.results?.length || 0} distinctions attribuées
                    </span>
                  </div>
                  <span className={`status-pill ${c.is_published ? 'published' : 'draft'}`}>
                    {c.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

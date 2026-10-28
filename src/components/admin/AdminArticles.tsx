import { FormEvent, useState } from 'react';
import { BookOpen, Calendar, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import type { Article } from '@/types';
import { DataService, images } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminArticlesProps {
  articles: Article[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminArticles({
  articles,
  onRefresh,
  onFlashNotice,
}: AdminArticlesProps) {
  const [search, setSearch] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Supprimer définitivement l’article "${title}" ?`)) return;
    await DataService.deleteArticle(id);
    onFlashNotice('Article supprimé.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Journal & Blog</p>
          <h1>Gestion des Actualités & Articles</h1>
        </div>
        <button
          className="button button-dark"
          onClick={() =>
            setEditingArticle({
              id: '',
              title: '',
              slug: '',
              summary: '',
              content: '',
              cover_image: images.portrait,
              category: 'Conseils Coaching',
              published_at: new Date().toISOString(),
              is_published: true,
              is_featured: false,
              seo_title: '',
              seo_description: '',
            })
          }
        >
          <Plus size={16} />
          <span>Rédiger un article</span>
        </button>
      </div>

      {/* RECHERCHE */}
      <div className="admin-toolbar">
        <Search size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par titre ou contenu..."
        />
      </div>

      {/* TABLEAU */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Couverture</th>
              <th>Titre & Slug</th>
              <th>Catégorie</th>
              <th>Date de publication</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((art) => (
              <tr key={art.id}>
                <td className="table-thumb-col">
                  <img src={art.cover_image || images.portrait} alt="" className="table-thumb" />
                </td>
                <td>
                  <strong>{art.title}</strong>
                  <span className="slug-preview">/actualites/{art.slug}</span>
                </td>
                <td><span className="role-tag">{art.category}</span></td>
                <td>
                  <span className="text-xs">
                    {new Date(art.published_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${art.is_published ? 'published' : 'draft'}`}>
                    {art.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="text-right table-actions">
                  <button className="action-icon-btn" onClick={() => setEditingArticle(art)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="action-icon-btn danger" onClick={() => handleDelete(art.id, art.title)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE D'ÉDITION D'ARTICLE */}
      {editingArticle && (
        <ArticleEditorModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSaved={() => {
            setEditingArticle(null);
            onFlashNotice('Article enregistré.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ArticleEditorModal({
  article,
  onClose,
  onSaved,
}: {
  article: Article;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...article });
  const [saving, setSaving] = useState(false);

  function handleTitleChange(title: string) {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setForm((f) => ({
      ...f,
      title,
      slug: f.slug && f.id ? f.slug : slug,
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveArticle(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="content-modal large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Rédaction d’Article</p>
            <h2>{form.id ? 'Modifier l’article' : 'Nouvel article'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Titre de l’article *
              <input
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Les secrets de la posture scénique"
              />
            </label>
            <label>
              Slug URL (/actualites/:slug) *
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="les-secrets-de-la-posture-scenique"
              />
            </label>
          </div>

          <div className="form-two">
            <label>
              Catégorie *
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Conseils Coaching, Coulisses, Gastronomie..."
              />
            </label>
          </div>

          <CloudinaryUploader
            label="Image de couverture de l'article"
            currentUrl={form.cover_image}
            mediaType="image"
            folder="couronne-toque/articles"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, cover_image: url })}
            onRemove={() => setForm({ ...form, cover_image: null })}
            helpText="Cette image s'affiche en tête d'article et sur les fiches du blog."
          />

          <label>
            Résumé d’introduction (affiché sur la liste et en en-tête) *
            <textarea
              required
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Courte accroche de 2 à 3 phrases..."
            />
          </label>

          <label>
            Corps du texte (supporte les titres ### et citations &gt;) *
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Rédigez votre article complet..."
            />
          </label>

          <div className="form-two">
            <label>
              Statut
              <select
                value={form.is_published ? 'published' : 'draft'}
                onChange={(e) => setForm({ ...form, is_published: e.target.value === 'published' })}
              >
                <option value="published">Publié (en ligne)</option>
                <option value="draft">Brouillon (non accessible)</option>
              </select>
            </label>
            <label className="checkbox-wrap-label">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <span>Mettre en avant sur la page d’accueil</span>
            </label>
          </div>

          <div className="seo-sub-box">
            <h4>Référencement naturel de cet article</h4>
            <div className="form-two">
              <label>
                Titre SEO
                <input
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  placeholder="Titre balise <title>"
                />
              </label>
              <label>
                Méta-description
                <input
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  placeholder="Description pour les moteurs"
                />
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>Annuler</button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer l’article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

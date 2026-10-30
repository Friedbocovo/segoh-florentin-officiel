import { FormEvent, useState } from 'react';
import { Edit3, Plus, Trash2, Utensils, X } from 'lucide-react';
import type { CulinaryItem } from '@/types';
import { DataService } from '@/lib/supabase';
import Picture from '@/components/common/Picture';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminGastronomyProps {
  items: CulinaryItem[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminGastronomy({
  items,
  onRefresh,
  onFlashNotice,
}: AdminGastronomyProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<CulinaryItem | null>(null);

  const filtered = items.filter((i) => (filterType === 'all' ? true : i.item_type === filterType));

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cet élément culinaire ?')) return;
    await DataService.deleteCulinaryItem(id);
    onFlashNotice('Élément supprimé.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Pôle Gastronomie</p>
          <h1>Carte, Créations & Prestations</h1>
        </div>
        <button
          className="button button-dark"
          onClick={() =>
            setEditingItem({
              id: '',
              item_type: 'creation',
              title: '',
              category: 'Entrée',
              description: '',
              ingredients: '',
              dietary_info: '',
              price_info: '',
              image_url: null,
              sort_order: items.length + 1,
              is_published: true,
            })
          }
        >
          <Plus size={16} />
          <span>Ajouter une création / prestation</span>
        </button>
      </div>

      {/* FILTRES PAR TYPE */}
      <div className="subtabs-bar">
        {[
          { id: 'all', label: `Tout afficher (${items.length})` },
          { id: 'specialite', label: 'Spécialités' },
          { id: 'creation', label: 'Créations & Plats' },
          { id: 'prestation', label: 'Prestations de Chef' },
        ].map((t) => (
          <button
            key={t.id}
            className={`subtab-btn ${filterType === t.id ? 'active' : ''}`}
            onClick={() => setFilterType(t.id)}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TABLEAU */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Visuel</th>
              <th>Nom / Intitulé</th>
              <th>Type & Catégorie</th>
              <th>Ingrédients & Régime</th>
              <th>Tarif indicatif</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="table-thumb-col">
                  <Picture src={item.image_url} alt="" className="table-thumb" />
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <p className="text-muted text-xs line-clamp-1">{item.description}</p>
                </td>
                <td>
                  <span className="role-tag">{item.item_type}</span>
                  <small className="block text-muted">{item.category}</small>
                </td>
                <td className="text-xs">
                  {item.ingredients && <div>{item.ingredients}</div>}
                  {item.dietary_info && <span className="text-green font-semibold">{item.dietary_info}</span>}
                </td>
                <td>{item.price_info || '—'}</td>
                <td>
                  <span className={`status-pill ${item.is_published ? 'published' : 'draft'}`}>
                    {item.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="text-right table-actions">
                  <button className="action-icon-btn" onClick={() => setEditingItem(item)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="action-icon-btn danger" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE D'ÉDITION */}
      {editingItem && (
        <CulinaryEditorModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null);
            onFlashNotice('Élément culinaire enregistré.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function CulinaryEditorModal({
  item,
  onClose,
  onSaved,
}: {
  item: CulinaryItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...item });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveCulinaryItem(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Élément Culinaire</p>
            <h2>{form.id ? 'Modifier l’élément' : 'Nouvelle création ou prestation'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Type d’élément *
              <select
                value={form.item_type}
                onChange={(e) => setForm({ ...form, item_type: e.target.value as any })}
              >
                <option value="creation">Création & Plat signature</option>
                <option value="specialite">Spécialité du chef</option>
                <option value="prestation">Prestation culinaire / Service</option>
                <option value="menu">Menu complet</option>
              </select>
            </label>
            <label>
              Catégorie de plat
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Entrée, Plat, Dessert, Prestation..."
              />
            </label>
          </div>

          <label>
            Nom du plat ou de la prestation *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Noix de Saint-Jacques rôties au beurre noisette"
            />
          </label>

          <label>
            Description gustative détaillée *
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Expliquez la cuisson, les accords, le dressage..."
            />
          </label>

          <div className="form-two">
            <label>
              Ingrédients majeurs (facultatif)
              <input
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                placeholder="Ex: Saint-Jacques, topinambour, sarrasin"
              />
            </label>
            <label>
              Informations alimentaires / Régimes
              <input
                value={form.dietary_info}
                onChange={(e) => setForm({ ...form, dietary_info: e.target.value })}
                placeholder="Ex: Sans gluten, De 4 à 16 convives..."
              />
            </label>
          </div>

          <label>
            Tarif indicatif
            <input
              value={form.price_info}
              onChange={(e) => setForm({ ...form, price_info: e.target.value })}
              placeholder="Ex: À partir de 120 € / convive"
            />
          </label>

          <CloudinaryUploader
            label="Photographie haute définition du plat ou de la création"
            currentUrl={form.image_url}
            mediaType="image"
            folder="couronne-toque/gastronomie"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, image_url: url })}
            onRemove={() => setForm({ ...form, image_url: null })}
            helpText="Téléversée et optimisée sur votre CDN Cloudinary."
          />

          <label className="checkbox-wrap-label">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Publier sur la page La Gastronomie</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>Annuler</button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

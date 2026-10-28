import { FormEvent, useState } from 'react';
import { Award, Edit3, Plus, Shield, Trash2, X } from 'lucide-react';
import type { JuryCriterion, JuryExperience } from '@/types';
import { DataService, images } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminJuryProps {
  experiences: JuryExperience[];
  criteria: JuryCriterion[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminJury({
  experiences,
  criteria,
  onRefresh,
  onFlashNotice,
}: AdminJuryProps) {
  const [activeTab, setActiveTab] = useState<'experiences' | 'criteria'>('experiences');
  const [editingExp, setEditingExp] = useState<JuryExperience | null>(null);
  const [editingCrit, setEditingCrit] = useState<JuryCriterion | null>(null);

  async function handleDeleteExp(id: string) {
    if (!window.confirm('Supprimer cette expérience de jury ?')) return;
    await DataService.deleteJuryExperience(id);
    onFlashNotice('Expérience supprimée.');
    onRefresh();
  }

  async function handleDeleteCrit(id: string) {
    if (!window.confirm('Supprimer ce critère ?')) return;
    await DataService.deleteJuryCriterion(id);
    onFlashNotice('Critère supprimé.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Pôle Arbitrage & Jurys</p>
          <h1>Gestion du Rôle de Jury</h1>
        </div>
        <div>
          {activeTab === 'experiences' ? (
            <button
              className="button button-dark"
              onClick={() =>
                setEditingExp({
                  id: '',
                  event_name: '',
                  edition: 'Édition 2025',
                  event_year: 2025,
                  event_date: '',
                  location: '',
                  organizer: '',
                  role_title: 'Membre du Jury Officiel',
                  description: '',
                  image_url: images.table,
                  sort_order: experiences.length + 1,
                  is_published: true,
                })
              }
            >
              <Plus size={16} />
              <span>Nouvelle participation jury</span>
            </button>
          ) : (
            <button
              className="button button-dark"
              onClick={() =>
                setEditingCrit({
                  id: '',
                  title: '',
                  description: '',
                  sort_order: criteria.length + 1,
                  is_published: true,
                })
              }
            >
              <Plus size={16} />
              <span>Nouveau critère</span>
            </button>
          )}
        </div>
      </div>

      <div className="info-banner mb-6">
        <Shield size={18} className="text-red mr-2" />
        <span>
          <strong>Rappel déontologique :</strong> Les expériences de jury sont indépendantes des concours coachés pour garantir la stricte distinction entre accompagnement et arbitrage.
        </span>
      </div>

      {/* ONGLETS */}
      <div className="subtabs-bar">
        <button
          className={`subtab-btn ${activeTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiences')}
        >
          <Award size={16} />
          <span>Concours arbitrés ({experiences.length})</span>
        </button>
        <button
          className={`subtab-btn ${activeTab === 'criteria' ? 'active' : ''}`}
          onClick={() => setActiveTab('criteria')}
        >
          <Shield size={16} />
          <span>Critères & Barèmes ({criteria.length})</span>
        </button>
      </div>

      {/* LISTE DES EXPÉRIENCES JURY */}
      {activeTab === 'experiences' && (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Visuel</th>
                <th>Événement</th>
                <th>Rôle assumé</th>
                <th>Lieu & Date</th>
                <th>Comité</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id}>
                  <td className="table-thumb-col">
                    <img src={exp.image_url || images.table} alt="" className="table-thumb" />
                  </td>
                  <td>
                    <strong>{exp.event_name}</strong>
                    <small className="block text-muted">{exp.edition}</small>
                  </td>
                  <td><span className="role-tag">{exp.role_title}</span></td>
                  <td>
                    <span>{exp.location || '—'}</span>
                    <small className="block text-muted">{exp.event_date || `${exp.event_year}`}</small>
                  </td>
                  <td>{exp.organizer || '—'}</td>
                  <td>
                    <span className={`status-pill ${exp.is_published ? 'published' : 'draft'}`}>
                      {exp.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button className="action-icon-btn" onClick={() => setEditingExp(exp)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="action-icon-btn danger" onClick={() => handleDeleteExp(exp.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LISTE DES CRITÈRES */}
      {activeTab === 'criteria' && (
        <div className="criteria-admin-list">
          {criteria.map((crit) => (
            <div key={crit.id} className="crit-admin-card">
              <div className="crit-info">
                <h4>{crit.title}</h4>
                <p>{crit.description}</p>
              </div>
              <div className="row-actions">
                <button className="action-icon-btn" onClick={() => setEditingCrit(crit)}>
                  <Edit3 size={16} />
                </button>
                <button className="action-icon-btn danger" onClick={() => handleDeleteCrit(crit.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALE PARTICIPATION JURY */}
      {editingExp && (
        <JuryExpEditorModal
          exp={editingExp}
          onClose={() => setEditingExp(null)}
          onSaved={() => {
            setEditingExp(null);
            onFlashNotice('Participation jury enregistrée.');
            onRefresh();
          }}
        />
      )}

      {/* MODALE CRITÈRE */}
      {editingCrit && (
        <CriterionEditorModal
          crit={editingCrit}
          onClose={() => setEditingCrit(null)}
          onSaved={() => {
            setEditingCrit(null);
            onFlashNotice('Critère enregistré.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function JuryExpEditorModal({
  exp,
  onClose,
  onSaved,
}: {
  exp: JuryExperience;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...exp });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveJuryExperience(form);
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
            <p className="kicker"><span /> Expérience Jury</p>
            <h2>{form.id ? 'Modifier l’expérience' : 'Ajouter un concours arbitré'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Nom du concours officiel *
            <input
              required
              value={form.event_name}
              onChange={(e) => setForm({ ...form, event_name: e.target.value })}
              placeholder="Ex: Élection Miss Élégance Grand Est"
            />
          </label>

          <div className="form-two">
            <label>
              Rôle assuré *
              <input
                required
                value={form.role_title}
                onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                placeholder="Ex: Président du Jury, Jury Scénique..."
              />
            </label>
            <label>
              Édition / Année
              <input
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                placeholder="Ex: Édition 2024"
              />
            </label>
          </div>

          <div className="form-two">
            <label>
              Lieu / Ville
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Strasbourg"
              />
            </label>
            <label>
              Comité organisateur
              <input
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                placeholder="Ex: Comité Miss Élégance"
              />
            </label>
          </div>

          <label>
            Date précise (facultatif)
            <input
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              placeholder="Ex: 14 Octobre 2024"
            />
          </label>

          <label>
            Description de la mission et des temps forts
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Critères observés, défilés évalués..."
            />
          </label>

          <CloudinaryUploader
            label="Photo souvenir ou visuel officiel de l'événement de jury"
            currentUrl={form.image_url}
            mediaType="image"
            folder="couronne-toque/jury"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, image_url: url })}
            onRemove={() => setForm({ ...form, image_url: null })}
            helpText="Stockée sur Cloudinary et affichée dans la liste des concours jugés."
          />

          <label className="checkbox-wrap-label">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Afficher cette expérience sur la page Jury</span>
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

function CriterionEditorModal({
  crit,
  onClose,
  onSaved,
}: {
  crit: JuryCriterion;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...crit });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveJuryCriterion(form);
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
            <p className="kicker"><span /> Critère d’Évaluation</p>
            <h2>{form.id ? 'Modifier le critère' : 'Nouveau critère public'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Intitulé du critère *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Justesse & Vérité de l’Allure"
            />
          </label>

          <label>
            Description détaillée *
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Expliquez ce qui est valorisé..."
            />
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

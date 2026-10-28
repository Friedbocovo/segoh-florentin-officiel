import { FormEvent, useState } from 'react';
import { Crown, Edit3, HelpCircle, ListOrdered, Plus, Sparkles, Trash2, X } from 'lucide-react';
import type { CoachingFAQ, CoachingMethodStep, CoachingService } from '@/types';
import { DataService, images } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminCoachingProps {
  services: CoachingService[];
  methodSteps: CoachingMethodStep[];
  faqs: CoachingFAQ[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminCoaching({
  services,
  methodSteps,
  faqs,
  onRefresh,
  onFlashNotice,
}: AdminCoachingProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'method' | 'faqs'>('services');
  const [editingService, setEditingService] = useState<CoachingService | null>(null);
  const [editingStep, setEditingStep] = useState<CoachingMethodStep | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<CoachingFAQ | null>(null);

  async function handleDeleteService(id: string) {
    if (!window.confirm('Supprimer ce service de coaching ?')) return;
    await DataService.deleteService(id);
    onFlashNotice('Service supprimé.');
    onRefresh();
  }

  async function handleDeleteStep(id: string) {
    if (!window.confirm('Supprimer cette étape ?')) return;
    await DataService.deleteMethodStep(id);
    onFlashNotice('Étape supprimée.');
    onRefresh();
  }

  async function handleDeleteFAQ(id: string) {
    if (!window.confirm('Supprimer cette question ?')) return;
    await DataService.deleteFAQ(id);
    onFlashNotice('Question supprimée.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Pôle Coaching</p>
          <h1>Gestion du Coaching Miss & Mister</h1>
        </div>
        <div>
          {activeTab === 'services' && (
            <button
              className="button button-dark"
              onClick={() =>
                setEditingService({
                  id: '',
                  title: '',
                  description: '',
                  image_url: images.stage,
                  price_info: '',
                  duration_info: '',
                  button_label: 'Réserver ce parcours',
                  button_url: '/contact?motif=coaching',
                  sort_order: services.length + 1,
                  is_published: true,
                })
              }
            >
              <Plus size={16} />
              <span>Nouveau service</span>
            </button>
          )}

          {activeTab === 'method' && (
            <button
              className="button button-dark"
              onClick={() =>
                setEditingStep({
                  id: '',
                  step_number: methodSteps.length + 1,
                  title: '',
                  description: '',
                  sort_order: methodSteps.length + 1,
                  is_published: true,
                })
              }
            >
              <Plus size={16} />
              <span>Nouvelle étape</span>
            </button>
          )}

          {activeTab === 'faqs' && (
            <button
              className="button button-dark"
              onClick={() =>
                setEditingFAQ({
                  id: '',
                  question: '',
                  answer: '',
                  sort_order: faqs.length + 1,
                  is_published: true,
                })
              }
            >
              <Plus size={16} />
              <span>Nouvelle question</span>
            </button>
          )}
        </div>
      </div>

      {/* SOUS-NAVIGATION ONGLETS */}
      <div className="subtabs-bar">
        <button
          className={`subtab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <Crown size={16} />
          <span>Services & Formules ({services.length})</span>
        </button>
        <button
          className={`subtab-btn ${activeTab === 'method' ? 'active' : ''}`}
          onClick={() => setActiveTab('method')}
        >
          <ListOrdered size={16} />
          <span>Méthode & Étapes ({methodSteps.length})</span>
        </button>
        <button
          className={`subtab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          <HelpCircle size={16} />
          <span>Questions fréquentes ({faqs.length})</span>
        </button>
      </div>

      {/* CONTENU ONGLETS */}
      {activeTab === 'services' && (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Visuel</th>
                <th>Intitulé du service</th>
                <th>Description</th>
                <th>Durée & Tarif</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  <td className="table-thumb-col">
                    <img src={srv.image_url || images.stage} alt="" className="table-thumb" />
                  </td>
                  <td><strong>{srv.title}</strong></td>
                  <td className="max-w-md">{srv.description.slice(0, 95)}...</td>
                  <td>
                    <span>{srv.duration_info || '—'}</span>
                    <small className="block text-red font-semibold">{srv.price_info || '—'}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${srv.is_published ? 'published' : 'draft'}`}>
                      {srv.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button className="action-icon-btn" onClick={() => setEditingService(srv)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="action-icon-btn danger" onClick={() => handleDeleteService(srv.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'method' && (
        <div className="method-admin-list">
          {methodSteps.map((step) => (
            <div key={step.id} className="method-admin-row">
              <span className="step-badge">Étape 0{step.step_number}</span>
              <div className="step-info">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              <div className="row-actions">
                <button className="action-icon-btn" onClick={() => setEditingStep(step)}>
                  <Edit3 size={16} />
                </button>
                <button className="action-icon-btn danger" onClick={() => handleDeleteStep(step.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'faqs' && (
        <div className="faqs-admin-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-admin-row">
              <div className="faq-info">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
              <div className="row-actions">
                <button className="action-icon-btn" onClick={() => setEditingFAQ(faq)}>
                  <Edit3 size={16} />
                </button>
                <button className="action-icon-btn danger" onClick={() => handleDeleteFAQ(faq.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALES D'ÉDITION */}
      {editingService && (
        <ServiceEditorModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSaved={() => {
            setEditingService(null);
            onFlashNotice('Service enregistré.');
            onRefresh();
          }}
        />
      )}

      {editingStep && (
        <StepEditorModal
          step={editingStep}
          onClose={() => setEditingStep(null)}
          onSaved={() => {
            setEditingStep(null);
            onFlashNotice('Étape enregistrée.');
            onRefresh();
          }}
        />
      )}

      {editingFAQ && (
        <FAQEditorModal
          faq={editingFAQ}
          onClose={() => setEditingFAQ(null)}
          onSaved={() => {
            setEditingFAQ(null);
            onFlashNotice('FAQ enregistrée.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ServiceEditorModal({
  service,
  onClose,
  onSaved,
}: {
  service: CoachingService;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...service });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveService(form);
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
            <p className="kicker"><span /> Service Coaching</p>
            <h2>{form.id ? 'Modifier le service' : 'Créer un service'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Intitulé du service *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Préparation Intensive aux Concours"
            />
          </label>

          <label>
            Description complète *
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Détails de l'accompagnement, des compétences travaillées..."
            />
          </label>

          <div className="form-two">
            <label>
              Durée / Format
              <input
                value={form.duration_info}
                onChange={(e) => setForm({ ...form, duration_info: e.target.value })}
                placeholder="Ex: 6 séances de 2h"
              />
            </label>
            <label>
              Tarif indicatif
              <input
                value={form.price_info}
                onChange={(e) => setForm({ ...form, price_info: e.target.value })}
                placeholder="Ex: À partir de 180 €"
              />
            </label>
          </div>

          <CloudinaryUploader
            label="Photographie illustrative du service de coaching"
            currentUrl={form.image_url}
            mediaType="image"
            folder="couronne-toque/coaching"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, image_url: url })}
            onRemove={() => setForm({ ...form, image_url: null })}
            helpText="Stockée sur Cloudinary et affichée sur la carte de l'offre."
          />

          <div className="form-two">
            <label>
              Texte du bouton d’action
              <input
                value={form.button_label}
                onChange={(e) => setForm({ ...form, button_label: e.target.value })}
                placeholder="Réserver ce parcours"
              />
            </label>
            <label>
              Lien du bouton
              <input
                value={form.button_url}
                onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                placeholder="/contact?motif=coaching"
              />
            </label>
          </div>

          <label className="checkbox-wrap-label">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Publier ce service sur la page Coaching</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>
              Annuler
            </button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer le service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StepEditorModal({
  step,
  onClose,
  onSaved,
}: {
  step: CoachingMethodStep;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...step });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveMethodStep(form);
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
            <p className="kicker"><span /> Étape de Méthode</p>
            <h2>{form.id ? 'Modifier l’étape' : 'Nouvelle étape'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Numéro de l’étape *
              <input
                type="number"
                required
                value={form.step_number}
                onChange={(e) => setForm({ ...form, step_number: Number(e.target.value) })}
              />
            </label>
            <label>
              Titre de l’étape *
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Ancrage corporel & Démarche"
              />
            </label>
          </div>

          <label>
            Description de l’étape *
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Expliquez ce qui est travaillé lors de cette étape..."
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

function FAQEditorModal({
  faq,
  onClose,
  onSaved,
}: {
  faq: CoachingFAQ;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...faq });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveFAQ(form);
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
            <p className="kicker"><span /> Question Fréquente</p>
            <h2>{form.id ? 'Modifier la question' : 'Nouvelle question'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Question *
            <input
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Ex: À qui s’adresse le coaching ?"
            />
          </label>

          <label>
            Réponse *
            <textarea
              required
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Rédigez la réponse détaillée..."
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

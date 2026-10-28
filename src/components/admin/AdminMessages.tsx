import { useState } from 'react';
import { Archive, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Search, Trash2, Users, X } from 'lucide-react';
import type { ContactMessage } from '@/types';
import { DataService } from '@/lib/supabase';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminMessages({
  messages,
  onRefresh,
  onFlashNotice,
}: AdminMessagesProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filtered = messages
    .filter((m) => (filterStatus === 'all' ? true : m.status === filterStatus))
    .filter((m) => (filterPurpose === 'all' ? true : m.purpose === filterPurpose))
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase())
    );

  async function handleStatusChange(id: string, newStatus: ContactMessage['status']) {
    await DataService.updateMessageStatus(id, newStatus);
    onFlashNotice('Statut du message mis à jour.');
    onRefresh();
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer définitivement ce message ?')) return;
    await DataService.deleteMessage(id);
    onFlashNotice('Message supprimé.');
    onRefresh();
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  }

  function handleOpenMessage(msg: ContactMessage) {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      handleStatusChange(msg.id, 'read');
    }
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Boîte de Réception</p>
          <h1>Messages & Demandes de Devis</h1>
        </div>
      </div>

      {/* FILTRES PAR STATUT */}
      <div className="subtabs-bar">
        {[
          { id: 'all', label: `Tous (${messages.length})` },
          { id: 'unread', label: `Non lus (${messages.filter((m) => m.status === 'unread').length})` },
          { id: 'read', label: 'Lus' },
          { id: 'processing', label: 'En cours de traitement' },
          { id: 'processed', label: 'Traités' },
          { id: 'archived', label: 'Archivés' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`subtab-btn ${filterStatus === tab.id ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.id)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* RECHERCHE ET FILTRE MOTIF */}
      <div className="catalogue-toolbar">
        <div className="search-input-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, objet..."
          />
        </div>

        <div className="filter-select-wrap">
          <span>Motif :</span>
          <select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)}>
            <option value="all">Tous les motifs</option>
            <option value="coaching">Coaching Miss & Mister</option>
            <option value="jury">Jury de concours</option>
            <option value="gastronomie">Gastronomie / Dîners</option>
            <option value="partenariat">Partenariat</option>
            <option value="information">Information</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      {/* LISTE DES MESSAGES */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Expéditeur</th>
              <th>Motif & Objet</th>
              <th>Date de réception</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  Aucun message ne correspond à vos filtres.
                </td>
              </tr>
            ) : (
              filtered.map((msg) => (
                <tr
                  key={msg.id}
                  className={`clickable-tr ${msg.status === 'unread' ? 'unread-row' : ''}`}
                  onClick={() => handleOpenMessage(msg)}
                >
                  <td>
                    <strong>{msg.name}</strong>
                    <small className="block text-muted">{msg.email}</small>
                  </td>
                  <td>
                    <span className="role-tag">{msg.purpose}</span>
                    <strong className="block text-sm mt-1">{msg.subject}</strong>
                    <p className="text-muted text-xs line-clamp-1">{msg.message}</p>
                  </td>
                  <td>
                    <span className="text-xs">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        msg.status === 'unread'
                          ? 'draft font-bold'
                          : msg.status === 'processed'
                          ? 'published'
                          : msg.status === 'processing'
                          ? 'role-tag'
                          : 'default'
                      }`}
                    >
                      {msg.status === 'unread'
                        ? 'Non lu'
                        : msg.status === 'read'
                        ? 'Lu'
                        : msg.status === 'processing'
                        ? 'En cours'
                        : msg.status === 'processed'
                        ? 'Traité'
                        : 'Archivé'}
                    </span>
                  </td>
                  <td className="text-right table-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="action-icon-btn danger"
                      onClick={() => handleDelete(msg.id)}
                      title="Supprimer ce message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TIROIR / MODALE DE DÉTAIL D'UN MESSAGE */}
      {selectedMessage && (
        <div className="modal-backdrop" onClick={() => setSelectedMessage(null)}>
          <div className="content-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="kicker"><span /> Message Reçu</p>
                <h2>{selectedMessage.subject}</h2>
              </div>
              <button onClick={() => setSelectedMessage(null)}><X size={20} /></button>
            </div>

            <div className="message-modal-content">
              <div className="sender-meta-box">
                <div>
                  <strong>{selectedMessage.name}</strong>
                  <div className="flex gap-4 text-sm mt-1">
                    <a href={`mailto:${selectedMessage.email}`} className="text-red">
                      {selectedMessage.email}
                    </a>
                    {selectedMessage.phone && (
                      <a href={`tel:${selectedMessage.phone}`} className="text-muted">
                        {selectedMessage.phone}
                      </a>
                    )}
                  </div>
                </div>
                <span className="role-tag">{selectedMessage.purpose}</span>
              </div>

              {/* DÉTAILS GASTRONOMIE OU ÉVÉNEMENT */}
              {(selectedMessage.desired_date || selectedMessage.location || selectedMessage.guest_count) && (
                <div className="catering-details-box my-3 p-3 bg-paper rounded border">
                  <h4>Informations relatives à la demande</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    {selectedMessage.desired_date && <div>📅 Date souhaitée : {selectedMessage.desired_date}</div>}
                    {selectedMessage.location && <div>📍 Lieu : {selectedMessage.location}</div>}
                    {selectedMessage.guest_count && <div>👥 Convives : {selectedMessage.guest_count}</div>}
                    {selectedMessage.budget && <div>💰 Budget : {selectedMessage.budget}</div>}
                  </div>
                </div>
              )}

              <div className="message-full-body my-4 p-4 bg-white rounded border text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="status-changer-bar flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted">Modifier le statut :</span>
                <div className="flex gap-2">
                  <button
                    className={`button btn-sm ${selectedMessage.status === 'processing' ? 'button-dark' : 'button-light'}`}
                    onClick={() => handleStatusChange(selectedMessage.id, 'processing')}
                  >
                    En cours
                  </button>
                  <button
                    className={`button btn-sm ${selectedMessage.status === 'processed' ? 'button-dark' : 'button-light'}`}
                    onClick={() => handleStatusChange(selectedMessage.id, 'processed')}
                  >
                    Traité
                  </button>
                  <button
                    className={`button btn-sm ${selectedMessage.status === 'archived' ? 'button-dark' : 'button-light'}`}
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                  >
                    Archiver
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions flex-wrap">
              {selectedMessage.phone && (
                <a
                  href={`https://wa.me/${normalizeWhatsAppNumber(selectedMessage.phone)}?text=${encodeURIComponent(`Bonjour ${selectedMessage.name}, suite à votre message concernant « ${selectedMessage.subject} »...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-whatsapp"
                >
                  <MessageCircle size={15} />
                  <span>Répondre sur WhatsApp</span>
                </a>
              )}
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="button button-dark"
              >
                <Mail size={15} />
                <span>Répondre par e-mail</span>
              </a>
              <button
                className="button button-light danger"
                onClick={() => handleDelete(selectedMessage.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

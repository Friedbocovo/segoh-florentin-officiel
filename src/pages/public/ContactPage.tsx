import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Facebook, Instagram, LoaderCircle, Mail, MapPin, MessageCircle, Phone, RotateCcw, Send, ShieldCheck, Youtube } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { DataService } from '@/lib/supabase';
import { buildContactWhatsAppUrl, normalizeWhatsAppNumber } from '@/lib/whatsapp';

interface ContactPageProps {
  settings: SiteSettings;
  prefilledPurpose?: string;
}

export default function ContactPage({ settings, prefilledPurpose }: ContactPageProps) {
  const [purpose, setPurpose] = useState(prefilledPurpose || 'coaching');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (prefilledPurpose) {
      setPurpose(prefilledPurpose);
    }
  }, [prefilledPurpose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      purpose: (form.get('purpose') as any) || 'coaching',
      subject: String(form.get('subject') || 'Prise de contact via le site'),
      message: String(form.get('message') || ''),
      desired_date: String(form.get('desired_date') || ''),
      location: String(form.get('location') || ''),
      guest_count: form.get('guest_count') ? Number(form.get('guest_count')) : null,
      budget: String(form.get('budget') || ''),
    };

    const result = await DataService.submitMessage(payload as any);
    setSubmitting(false);

    if (result.success) {
      const waUrl = buildContactWhatsAppUrl(payload, settings.whatsapp_number);
      setWhatsappRedirectUrl(waUrl);
      setSubmitted(true);
      if (waUrl) window.open(waUrl, '_blank');
    } else {
      setErrorMsg('Votre message n’a pas pu être transmis. Veuillez vérifier votre connexion et réessayer.');
    }
  }

  return (
    <main className="subpage wrap contact-page-wrapper">
      <div className="contact-page-grid">
        {/* COLONNE GAUCHE : COORDONNÉES ET PRÉSENTATION */}
        <div className="contact-info-col">
          <p className="kicker"><span /> Le premier pas</p>
          <h1>Faisons de votre projet un moment d’exception</h1>
          <p className="contact-lead-text">
            Une candidature à un concours, une élection à arbitrer ou un dîner gastronomique privé à concevoir ? Écrivez-moi, je vous répondrai personnellement sous 48 heures.
          </p>

          <div className="contact-meta-cards">
            <div className="contact-meta-item">
              <Mail className="contact-icon" size={20} />
              <div>
                <span>Adresse e-mail professionnelle</span>
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </div>
            </div>

            {settings.contact_phone && (
              <div className="contact-meta-item">
                <Phone className="contact-icon" size={20} />
                <div>
                  <span>Téléphone direct</span>
                  <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}>{settings.contact_phone}</a>
                </div>
              </div>
            )}

            {settings.whatsapp_number && (
              <div className="contact-meta-item">
                <MessageCircle className="contact-icon text-green-600" size={20} />
                <div>
                  <span>WhatsApp direct</span>
                  <a
                    href={`https://wa.me/${normalizeWhatsAppNumber(settings.whatsapp_number)}?text=${encodeURIComponent('Bonjour, je vous contacte depuis votre site internet.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-green-700 hover:underline"
                  >
                    {settings.whatsapp_number} (Discuter en direct)
                  </a>
                </div>
              </div>
            )}

            <div className="contact-meta-item">
              <MapPin className="contact-icon" size={20} />
              <div>
                <span>Zone d’intervention</span>
                <p>{settings.contact_address || 'Paris, régions de France et déplacements internationaux'}</p>
              </div>
            </div>
          </div>

          <div className="contact-socials-block">
            <span className="socials-label">Suivre mon actualité</span>
            <div className="social-links-row">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="contact-form-col">
          {submitted ? (
            <div className="form-success-box">
              <div className="success-icon-badge">
                <CheckCircle2 size={38} />
              </div>
              <span className="success-pill-tag">Demande enregistrée</span>
              <h2>Merci, votre message est bien transmis !</h2>
              <p>
                Votre message a été enregistré avec succès.
                {whatsappRedirectUrl && <> Vous pouvez aussi l’envoyer directement sur WhatsApp au <strong>{settings.whatsapp_number}</strong>.</>}
              </p>
              <div className="success-actions flex-wrap">
                {whatsappRedirectUrl && (
                  <a
                    href={whatsappRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-whatsapp"
                  >
                    <MessageCircle size={18} />
                    <span>Ouvrir WhatsApp</span>
                  </a>
                )}
                <button className="button button-light" onClick={() => setSubmitted(false)}>
                  <RotateCcw size={16} />
                  <span>Envoyer un autre message</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="styled-form contact-form-card">
              <div className="form-row">
                <label>
                  Votre nom complet *
                  <input name="name" required placeholder="Prénom Nom" />
                </label>
                <label>
                  Votre adresse e-mail *
                  <input name="email" type="email" required placeholder="vous@exemple.fr" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Téléphone (facultatif)
                  <input name="phone" placeholder="06 00 00 00 00" />
                </label>
                <label>
                  Motif de votre demande *
                  <select
                    name="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  >
                    <option value="coaching">Coaching Miss & Mister</option>
                    <option value="jury">Invitation comme membre de jury</option>
                    <option value="gastronomie">Prestation gastronomique / Dîner</option>
                    <option value="partenariat">Partenariat & Sponsoring</option>
                    <option value="information">Demande d’information générale</option>
                    <option value="autre">Autre projet</option>
                  </select>
                </label>
              </div>

              {/* Champs conditionnels si prestation culinaire */}
              {purpose === 'gastronomie' && (
                <div className="form-row">
                  <label>
                    Date souhaitée
                    <input name="desired_date" type="date" />
                  </label>
                  <label>
                    Nombre de convives
                    <input name="guest_count" placeholder="Ex: 10 personnes" />
                  </label>
                </div>
              )}

              <label>
                Objet de votre message *
                <input
                  name="subject"
                  required
                  placeholder={
                    purpose === 'coaching'
                      ? 'Ex: Préparation pour concours régional en juin'
                      : purpose === 'jury'
                      ? 'Ex: Participation au jury de l’élection 2025'
                      : 'Ex: Renseignement sur vos prestations'
                  }
                />
              </label>

              <label>
                Votre message détaillé *
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Décrivez votre projet, vos objectifs, les dates clés ou toute information utile..."
                ></textarea>
              </label>

              <div className="rgpd-consent-row">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    J’accepte que les données saisies soient utilisées dans le cadre exclusif de ma demande et de la relation commerciale qui peut en découler.
                  </span>
                </label>
              </div>

              {errorMsg && <p className="form-error">{errorMsg}</p>}

              <button className="button button-dark" disabled={submitting}>
                {submitting ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />}
                <span>{submitting ? 'Envoi en cours...' : 'Envoyer ma demande'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

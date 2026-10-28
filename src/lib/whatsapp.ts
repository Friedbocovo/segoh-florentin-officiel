/**
 * Utilitaires WhatsApp pour le site Couronne & Toque
 */

/** Numéro WhatsApp par défaut (remplacé par celui saisi dans Admin › Réglages). */
export const DEFAULT_WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER || '';

/** Indicatif appliqué aux numéros saisis au format national (229 = Bénin). */
const DEFAULT_COUNTRY_CODE: string = import.meta.env.VITE_WHATSAPP_COUNTRY_CODE || '229';

// Pays où le 0 initial fait partie du numéro national (Bénin, Côte d'Ivoire)
const KEEP_LEADING_ZERO = ['229', '225'];

/**
 * Normalise un numéro pour le protocole WhatsApp (wa.me) : chiffres uniquement, avec indicatif.
 * - « +33 6 12… » ou « 0033 6 12… » : numéro international conservé tel quel
 * - Bénin : les anciens numéros à 8 chiffres reçoivent le préfixe 01 (numérotation à 10 chiffres depuis fin 2024)
 * - Sinon : l'indicatif par défaut est ajouté (en retirant le 0 initial si le pays l'exige)
 */
export function normalizeWhatsAppNumber(raw: string, countryCode: string = DEFAULT_COUNTRY_CODE): string {
  const trimmed = (raw || '').trim();
  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  const isInternational = trimmed.startsWith('+') || digits.startsWith('00');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (!isInternational) {
    // Indicatif saisi sans le « + » (ex : 229 01 52 35 34 84)
    if (digits.startsWith(countryCode) && digits.length > 10) {
      digits = digits.slice(countryCode.length);
    } else if (digits.startsWith('0') && !KEEP_LEADING_ZERO.includes(countryCode)) {
      digits = digits.slice(1);
    }
    digits = `${countryCode}${digits}`;
  }

  // Bénin : ancien format à 8 chiffres → préfixe 01
  if (digits.startsWith('229') && digits.length === 11) return `22901${digits.slice(3)}`;
  return digits;
}

/**
 * Construit l'URL WhatsApp pour les messages de la page Contact
 */
export function buildContactWhatsAppUrl(
  data: {
    name: string;
    email: string;
    phone?: string;
    purpose?: string;
    subject?: string;
    message: string;
    desired_date?: string;
    location?: string;
    guest_count?: number | null;
    budget?: string;
  },
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const num = normalizeWhatsAppNumber(whatsappNumber);
  if (!num) return '';

  const purposeLabels: Record<string, string> = {
    coaching: '👑 Coaching Miss & Mister',
    jury: '⚖️ Jury de Concours',
    gastronomie: '🍽️ Gastronomie & Chef privé',
    presse: '📰 Presse & Partenariat',
    general: '💬 Demande générale',
  };

  const purposeText = purposeLabels[data.purpose || ''] || data.purpose || 'Général';

  let text = `👑 *NOUVEAU MESSAGE — COURONNE & TOQUE*\n\n`;
  text += `👤 *Nom :* ${data.name}\n`;
  text += `📧 *E-mail :* ${data.email}\n`;
  if (data.phone) text += `📞 *Téléphone :* ${data.phone}\n`;
  text += `🎯 *Motif :* ${purposeText}\n`;
  if (data.subject) text += `📌 *Sujet :* ${data.subject}\n`;

  if (data.desired_date) text += `📅 *Date souhaitée :* ${data.desired_date}\n`;
  if (data.location) text += `📍 *Lieu :* ${data.location}\n`;
  if (data.guest_count) text += `👥 *Nombre de convives :* ${data.guest_count}\n`;
  if (data.budget) text += `💰 *Budget :* ${data.budget}\n`;

  text += `\n💬 *Message :*\n${data.message}\n`;

  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

/**
 * Construit l'URL WhatsApp pour les demandes culinaires de la page Gastronomie
 */
export function buildCateringWhatsAppUrl(
  data: {
    name: string;
    email: string;
    phone?: string;
    desired_date?: string;
    location?: string;
    guest_count?: number | null;
    budget?: string;
    message: string;
  },
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const num = normalizeWhatsAppNumber(whatsappNumber);
  if (!num) return '';

  let text = `🍽️ *NOUVELLE DEMANDE CULINAIRE — CHEF PRIVÉ*\n\n`;
  text += `👤 *Client :* ${data.name}\n`;
  text += `📧 *E-mail :* ${data.email}\n`;
  if (data.phone) text += `📞 *Téléphone :* ${data.phone}\n`;
  if (data.desired_date) text += `📅 *Date de l’événement :* ${data.desired_date}\n`;
  if (data.location) text += `📍 *Lieu / Ville :* ${data.location}\n`;
  if (data.guest_count) text += `👥 *Nombre de convives :* ${data.guest_count}\n`;
  if (data.budget) text += `💰 *Budget estimé :* ${data.budget}\n`;

  text += `\n💬 *Détails du menu & prestations souhaitées :*\n${data.message}\n`;

  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

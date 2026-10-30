import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';
import BrandMark from '@/components/common/BrandMark';
import BrandName from '@/components/common/BrandName';
import { hasCustomLogo } from '@/lib/brand';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-statement">
        <p className="footer-motto">
          Révéler l’élégance, <em>sur scène comme à table.</em>
        </p>
        <button className="footer-cta-btn" onClick={() => onNavigate('/contact')}>
          <span>Échanger sur votre projet</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="wrap footer-grid">
        <div className="footer-col brand-col">
          <button className="brand footer-brand" onClick={() => onNavigate('/')}>
            {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={52} />}
            <BrandName name={settings.site_name} />
          </button>
          <p className="footer-tagline">{settings.tagline}</p>
          <div className="footer-address">
            <MapPin size={15} />
            <span>{settings.contact_address || 'Paris & Déplacements France'}</span>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-label">Navigation</span>
          <button onClick={() => onNavigate('/a-propos')}>À propos</button>
          <button onClick={() => onNavigate('/coaching')}>Le coaching</button>
          <button onClick={() => onNavigate('/jury')}>Le jury</button>
          <button onClick={() => onNavigate('/gastronomie')}>La gastronomie</button>
          <button onClick={() => onNavigate('/mes-concours')}>Mes concours</button>
        </div>

        <div className="footer-col">
          <span className="footer-label">Médias & Échanges</span>
          <button onClick={() => onNavigate('/galerie')}>Galerie</button>
          <button onClick={() => onNavigate('/temoignages')}>Témoignages</button>
          <button onClick={() => onNavigate('/actualites')}>Actualités</button>
          <button onClick={() => onNavigate('/contact')}>Contact & Devis</button>
          <button onClick={() => onNavigate('/mentions-legales')}>Mentions légales & Confidentialité</button>
        </div>

        <div className="footer-col contact-col">
          <span className="footer-label">Contact direct</span>
          <a href={`mailto:${settings.contact_email}`} className="footer-contact-link">
            <Mail size={15} />
            <span>{settings.contact_email}</span>
          </a>
          {settings.contact_phone && (
            <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="footer-contact-link">
              <Phone size={15} />
              <span>{settings.contact_phone}</span>
            </a>
          )}
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${normalizeWhatsAppNumber(settings.whatsapp_number)}?text=${encodeURIComponent('Bonjour, je vous contacte depuis votre site internet.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-link"
              title="Échanger sur WhatsApp"
            >
              <MessageCircle size={15} />
              <span>WhatsApp : {settings.whatsapp_number}</span>
            </a>
          )}
          <div className="footer-socials">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={17} />
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={17} />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={17} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {settings.site_name}. Tous droits réservés.</span>
        <span>Une maison d’exigence, d’allure et de goût</span>
      </div>
    </footer>
  );
}

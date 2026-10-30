import { FormEvent, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Clock, DollarSign, LoaderCircle, MapPin, MessageCircle, MessageSquare, Quote, RotateCcw, Send, Sparkles, Users, Utensils } from 'lucide-react';
import type { SiteSection, CulinaryItem, MediaItem, SiteSettings, Testimonial } from '@/types';
import { DataService } from '@/lib/supabase';
import Picture from '@/components/common/Picture';
import { pickImage } from '@/lib/media';
import { buildCateringWhatsAppUrl } from '@/lib/whatsapp';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import EditorialIntro from '@/components/common/EditorialIntro';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

interface GastronomyPageProps {
  sections: SiteSection[];
  items: CulinaryItem[];
  media: MediaItem[];
  testimonials: Testimonial[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function GastronomyPage({
  sections,
  items,
  media,
  testimonials,
  settings,
  onNavigate,
  onOpenMedia,
}: GastronomyPageProps) {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');
  const [formError, setFormError] = useState('');

  const sec = (key: string) => getSection(sections, 'gastronomie', key);
  const heading = sec('heading');
  const intro = sec('intro');
  const dishesHead = sec('dishes_head');
  const servicesHead = sec('services_head');
  const galleryHead = sec('gallery_head');
  const testimonialsHead = sec('testimonials_head');
  const quoteForm = sec('quote_form');
  const benefits = ((quoteForm.meta.benefits as string[] | undefined) ?? []).filter(Boolean);

  const activeItems = items.filter((item) => item.is_published);
  const dishes = activeItems.filter((i) => i.item_type === 'specialite' || i.item_type === 'creation');
  const services = activeItems.filter((i) => i.item_type === 'prestation');
  const culinaryMedia = media.filter((m) => m.category === 'gastronomie').slice(0, 4);
  const culinaryTestimonials = testimonials.filter((t) => t.status === 'approved' && t.domain === 'gastronomie');

  const filteredDishes = filterCat === 'all' ? dishes : dishes.filter((d) => d.category.toLowerCase() === filterCat.toLowerCase());

  async function handleCateringSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      purpose: 'gastronomie' as const,
      subject: `Demande de prestation culinaire - ${form.get('service_type') || 'Dîner privé'}`,
      message: String(form.get('description') || ''),
      desired_date: String(form.get('desired_date') || ''),
      location: String(form.get('location') || ''),
      guest_count: form.get('guest_count') ? Number(form.get('guest_count')) : null,
      budget: String(form.get('budget') || ''),
    };

    const result = await DataService.submitMessage(payload as any);
    setSubmitting(false);

    if (result.success) {
      const waUrl = buildCateringWhatsAppUrl(payload, settings?.whatsapp_number);
      setWhatsappRedirectUrl(waUrl);
      setSubmitted(true);
      if (waUrl) window.open(waUrl, '_blank');
    } else {
      setFormError('Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
    }
  }

  return (
    <main className="subpage wrap gastronomy-page">
      {/* 7.1 INTRODUCTION GASTRONOMIQUE */}
      {heading.is_published && <PageHeading section={heading} />}

      {intro.is_published && (
        <EditorialIntro
          section={intro}
          fallbackImage={pickImage(media, ['gastronomie'])}
          imageAlt="Chef cuisinier au travail"
          icons={[Sparkles, Utensils]}
          onNavigate={onNavigate}
        />
      )}

      {/* 7.2 & 7.3 CRÉATIONS & SPÉCIALITÉS CULINAIRES */}
      <section className="culinary-dishes-section">
        <SectionHead section={dishesHead} aside={(
          <div className="category-filters">
            {['all', 'Entrée', 'Plat', 'Dessert'].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filterCat === cat ? 'active' : ''}`}
                onClick={() => setFilterCat(cat)}
              >
                {cat === 'all' ? 'Toutes les créations' : `${cat}s`}
              </button>
            ))}
          </div>
        )} />

        <div className="dishes-grid">
          {filteredDishes.map((dish) => (
            <article key={dish.id} className="dish-card">
              <div className="dish-img-wrap">
                <Picture src={dish.image_url} alt={dish.title} />
                <span className="dish-badge">{dish.category}</span>
              </div>
              <div className="dish-body">
                <h3>{dish.title}</h3>
                <p className="dish-desc">{dish.description}</p>
                {dish.ingredients && (
                  <div className="dish-ingredients">
                    <strong>Ingrédients :</strong> <span>{dish.ingredients}</span>
                  </div>
                )}
                {dish.dietary_info && (
                  <span className="dietary-tag">
                    <CheckCircle2 size={13} /> {dish.dietary_info}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7.5 PRESTATIONS & PROPOSITIONS CULINAIRES */}
      <section className="culinary-services-section">
        <SectionHead section={servicesHead} />

        <div className="services-grid">
          {services.map((srv) => (
            <article key={srv.id} className="service-card culinary-service-card">
              {srv.image_url && (
                <div className="service-image">
                  <img src={srv.image_url} alt={srv.title} />
                </div>
              )}
              <div className="service-body">
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
                <div className="service-meta">
                  {srv.dietary_info && <span className="meta-badge"><Users size={13} /> {srv.dietary_info}</span>}
                  {srv.price_info && <span className="meta-badge price">{srv.price_info}</span>}
                </div>
                <a href="#devis-gastronomie" className="button button-dark full-width">
                  <span>Réserver cette prestation</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7.6 GALERIE CULINAIRE */}
      {culinaryMedia.length > 0 && (
        <section className="culinary-gallery-section">
          <SectionHead section={galleryHead} linkLabel="Voir la galerie complète" onLink={() => onNavigate('/galerie?categorie=gastronomie')} />
          <div className="gallery-preview-grid">
            {culinaryMedia.map((m) => (
              <div key={m.id} className="gallery-preview-item" onClick={() => onOpenMedia(m)}>
                <img src={m.thumbnail_url || m.url} alt={m.title} />
                <div className="preview-overlay">
                  <h4>{m.title}</h4>
                  <p>{m.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7.7 TÉMOIGNAGES CLIENTS GASTRONOMIE */}
      {culinaryTestimonials.length > 0 && (
        <section className="culinary-testimonials-section">
          <SectionHead section={testimonialsHead} />
          <div className="testimonials-cards-grid">
            {culinaryTestimonials.map((t) => (
              <div key={t.id} className="testimonial-box">
                <Quote size={24} className="quote-icon" />
                <p className="testimonial-text">« {t.message} »</p>
                <div className="testimonial-author-box">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.author_name} className="author-thumb" />}
                  <div>
                    <strong>{t.author_name}</strong>
                    <span>{t.author_role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7.8 FORMULAIRE SPÉCIFIQUE DE DEMANDE DE PRESTATION */}
      <section id="devis-gastronomie" className="catering-form-section">
        <div className="catering-form-intro">
          {quoteForm.eyebrow && <p className="kicker"><span /> {quoteForm.eyebrow}</p>}
          <h2>{rich(quoteForm.title)}</h2>
          {quoteForm.content && <p>{quoteForm.content}</p>}
          {benefits.length > 0 && (
            <div className="form-benefits">
              {benefits.map((benefit, i) => (
                <div key={i}>
                  <CheckCircle2 size={16} className="text-red" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="catering-form-wrapper">
          {submitted ? (
            <div className="form-success-box">
              <div className="success-icon-badge">
                <CheckCircle2 size={38} />
              </div>
              <span className="success-pill-tag">Demande enregistrée</span>
              <h3>Demande culinaire bien transmise !</h3>
              <p>
                Votre demande a été enregistrée avec succès.
                {whatsappRedirectUrl && <> Vous pouvez aussi l’envoyer directement sur WhatsApp au <strong>{settings?.whatsapp_number}</strong>.</>}
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
                  <span>Envoyer une autre demande</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCateringSubmit} className="styled-form">
              <div className="form-row">
                <label>
                  Votre nom complet *
                  <input name="name" required placeholder="Jean Dupont" />
                </label>
                <label>
                  Votre adresse e-mail *
                  <input name="email" type="email" required placeholder="jean@exemple.fr" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Téléphone de contact *
                  <input name="phone" required placeholder="06 00 00 00 00" />
                </label>
                <label>
                  Type de prestation *
                  <select name="service_type" required defaultValue="Dîner gastronomique privé">
                    <option>Dîner gastronomique privé (à domicile)</option>
                    <option>Cocktail officiel de concours</option>
                    <option>Banquet de gala ou réception</option>
                    <option>Autre événement culinaire</option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Date souhaitée
                  <input name="desired_date" type="date" />
                </label>
                <label>
                  Lieu ou ville de l’événement
                  <input name="location" placeholder="Paris 8e, Strasbourg, Lyon..." />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Nombre de convives estimé
                  <input name="guest_count" placeholder="Ex: 8 personnes" />
                </label>
                <label>
                  Budget indicatif
                  <input name="budget" placeholder="Ex: 150 € / convive" />
                </label>
              </div>

              <label>
                Détails de votre demande (thématique, préférences, allergies...) *
                <textarea name="description" rows={4} required placeholder="Expliquez-moi vos envies culinaires pour ce moment..."></textarea>
              </label>

              {formError && <p className="form-error">{formError}</p>}

              <button className="button button-dark" disabled={submitting}>
                {submitting ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />}
                <span>{submitting ? 'Transmission en cours...' : 'Envoyer ma demande culinaire'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

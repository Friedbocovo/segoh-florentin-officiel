import { useEffect, useState } from 'react';
import { AlertTriangle, Check, LoaderCircle } from 'lucide-react';
import { DataService, DataServiceError, initialSettings, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { canonicalUrl, updateSEO } from '@/lib/seo';
import pageMeta from '@/lib/pageMeta.json';
import type {
  Article,
  CoachingFAQ,
  CoachingMethodStep,
  CoachingService,
  ContactMessage,
  Contest,
  CulinaryItem,
  JuryCriterion,
  JuryExperience,
  MediaItem,
  SiteSection,
  SiteSettings,
  Testimonial,
} from '@/types';

// Common
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Lightbox from '@/components/common/Lightbox';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import CoachingPage from '@/pages/public/CoachingPage';
import JuryPage from '@/pages/public/JuryPage';
import GastronomyPage from '@/pages/public/GastronomyPage';
import ContestsPage from '@/pages/public/ContestsPage';
import ContestDetailPage from '@/pages/public/ContestDetailPage';
import GalleryPage from '@/pages/public/GalleryPage';
import TestimonialsPage from '@/pages/public/TestimonialsPage';
import NewsPage from '@/pages/public/NewsPage';
import ArticleDetailPage from '@/pages/public/ArticleDetailPage';
import ContactPage from '@/pages/public/ContactPage';
import LegalPage from '@/pages/public/LegalPage';

// Admin Pages & Modules
import AdminLayout, { AdminTab } from '@/components/admin/AdminLayout';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminSections from '@/components/admin/AdminSections';
import AdminCoaching from '@/components/admin/AdminCoaching';
import AdminJury from '@/components/admin/AdminJury';
import AdminGastronomy from '@/components/admin/AdminGastronomy';
import AdminContests from '@/components/admin/AdminContests';
import AdminMedia from '@/components/admin/AdminMedia';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminSEO from '@/components/admin/AdminSEO';
import AdminSettings from '@/components/admin/AdminSettings';

const LEGACY_ACCENTS = ['#8d2732', '#9e293d'];

export default function App() {
  const { route, navigate } = useRouter();

  // Données globales
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [services, setServices] = useState<CoachingService[]>([]);
  const [methodSteps, setMethodSteps] = useState<CoachingMethodStep[]>([]);
  const [faqs, setFaqs] = useState<CoachingFAQ[]>([]);
  const [juryExperiences, setJuryExperiences] = useState<JuryExperience[]>([]);
  const [juryCriteria, setJuryCriteria] = useState<JuryCriterion[]>([]);
  const [culinaryItems, setCulinaryItems] = useState<CulinaryItem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Authentification & Session
  // isAdmin : session Supabase active ET compte présent dans la table admin_users
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [notAdminNotice, setNotAdminNotice] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeMediaList, setActiveMediaList] = useState<MediaItem[]>([]);

  // Notification Flash
  const [flashNotice, setFlashNotice] = useState<string>('');
  const [flashError, setFlashError] = useState<string>('');

  // Tab admin
  const currentAdminTab: AdminTab = (route.params.tab as AdminTab) || 'dashboard';

  useEffect(() => {
    void loadAllData();

    // Supabase auth listener
    supabase.auth.getSession().then(({ data }) => {
      void refreshAdminStatus(Boolean(data.session));
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      // Différé : un appel Supabase directement dans ce callback peut bloquer le client
      setTimeout(() => void refreshAdminStatus(Boolean(currentSession)), 0);
    });

    // Les erreurs d'écriture (DataServiceError) remontent ici et s'affichent dans l'admin
    function handleRejection(event: PromiseRejectionEvent) {
      if (event.reason instanceof DataServiceError) {
        event.preventDefault();
        triggerError(event.reason.message);
      }
    }
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  async function refreshAdminStatus(hasSession: boolean) {
    if (!hasSession) {
      setIsAdmin(false);
      return;
    }
    const admin = await DataService.isCurrentUserAdmin();
    setIsAdmin(admin);
    if (!admin) {
      setNotAdminNotice(true);
      await supabase.auth.signOut();
    }
  }

  // Synchronisation SEO globale
  useEffect(() => {
    if (!route.pathname.startsWith('/admin') && !route.params.slug) {
      const meta = (pageMeta as Record<string, { title: string; description: string }>)[route.pathname];
      updateSEO({
        title: meta?.title || settings.default_title,
        description: meta?.description || settings.default_description,
        ogImage: settings.default_og_image,
        canonical: canonicalUrl(route.pathname),
      });
    } else if (route.pathname.startsWith('/admin')) {
      updateSEO({
        title: `Administration — ${settings.site_name}`,
        noIndex: true,
      });
    }
  }, [route.pathname, settings]);

  async function loadAllData() {
    try {
      const [
        loadedSettings,
        loadedSections,
        loadedServices,
        loadedSteps,
        loadedFaqs,
        loadedJuryExp,
        loadedCriteria,
        loadedCulinary,
        loadedContests,
        loadedArticles,
        loadedReviews,
        loadedMedia,
        loadedMsgs,
      ] = await Promise.all([
        DataService.getSettings(),
        DataService.getSections(),
        DataService.getServices(),
        DataService.getMethodSteps(),
        DataService.getFAQs(),
        DataService.getJuryExperiences(),
        DataService.getJuryCriteria(),
        DataService.getCulinaryItems(),
        DataService.getContests(),
        DataService.getArticles(),
        DataService.getTestimonials(),
        DataService.getMedia(),
        DataService.getMessages(),
      ]);

      setSettings(loadedSettings);
      setSections(loadedSections);
      setServices(loadedServices);
      setMethodSteps(loadedSteps);
      setFaqs(loadedFaqs);
      setJuryExperiences(loadedJuryExp);
      setJuryCriteria(loadedCriteria);
      setCulinaryItems(loadedCulinary);
      setContests(loadedContests);
      setArticles(loadedArticles);
      setTestimonials(loadedReviews);
      setMedia(loadedMedia);
      setMessages(loadedMsgs);

      // Les anciennes couleurs par défaut (bordeaux) cèdent la place à la nouvelle charte
      const accent = loadedSettings.accent_color?.toLowerCase();
      if (accent && !LEGACY_ACCENTS.includes(accent)) {
        document.documentElement.style.setProperty('--red', loadedSettings.accent_color);
      } else {
        document.documentElement.style.removeProperty('--red');
      }
    } finally {
      setLoading(false);
    }
  }

  function triggerFlash(msg: string) {
    setFlashError('');
    setFlashNotice(msg);
    setTimeout(() => setFlashNotice(''), 3000);
  }

  function triggerError(msg: string) {
    setFlashNotice('');
    setFlashError(msg);
    setTimeout(() => setFlashError(''), 8000);
  }

  function handleOpenLightbox(item: MediaItem, list?: MediaItem[]) {
    setActiveMedia(item);
    setActiveMediaList(list || media);
  }

  // GESTION DU MODE ADMINISTRATEUR
  if (route.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <AdminLogin
          key={String(notAdminNotice)}
          settings={settings}
          notAdmin={notAdminNotice}
          onExit={() => navigate('/')}
          onLoginSuccess={() => {
            setNotAdminNotice(false);
            setIsAdmin(true);
            void loadAllData();
          }}
        />
      );
    }

    const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
    const pendingTestimonialsCount = testimonials.filter((t) => t.status === 'pending').length;

    return (
      <AdminLayout
        currentTab={currentAdminTab}
        onTabChange={(tab) => navigate(tab === 'dashboard' ? '/admin' : `/admin/${tab}`)}
        settings={settings}
        unreadMessagesCount={unreadMessagesCount}
        pendingTestimonialsCount={pendingTestimonialsCount}
        onExit={() => navigate('/')}
        onLogout={async () => {
          await supabase.auth.signOut();
          setIsAdmin(false);
          navigate('/');
        }}
      >
        {flashNotice && (
          <div className="admin-flash-banner">
            <Check size={16} />
            <span>{flashNotice}</span>
          </div>
        )}

        {flashError && (
          <div className="admin-flash-banner is-error" role="alert">
            <AlertTriangle size={16} />
            <span>{flashError}</span>
          </div>
        )}

        {currentAdminTab === 'dashboard' && (
          <AdminDashboard
            contests={contests}
            articles={articles}
            media={media}
            messages={messages}
            testimonials={testimonials}
            onNavigateTab={(tab) => navigate(tab === 'dashboard' ? '/admin' : `/admin/${tab}`)}
            onQuickAction={(action) => console.log(action)}
            onImportDemo={
              isSupabaseConfigured
                ? async () => {
                    await DataService.importDemoContent();
                    await loadAllData();
                    triggerFlash('Contenu de démonstration importé.');
                  }
                : undefined
            }
          />
        )}

        {currentAdminTab === 'sections' && (
          <AdminSections
            sections={sections}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'coaching' && (
          <AdminCoaching
            services={services}
            methodSteps={methodSteps}
            faqs={faqs}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'jury' && (
          <AdminJury
            experiences={juryExperiences}
            criteria={juryCriteria}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'gastronomie' && (
          <AdminGastronomy
            items={culinaryItems}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'contests' && (
          <AdminContests
            contests={contests}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'media' && (
          <AdminMedia
            media={media}
            contests={contests}
            settings={settings}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'testimonials' && (
          <AdminTestimonials
            testimonials={testimonials}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'articles' && (
          <AdminArticles
            articles={articles}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'messages' && (
          <AdminMessages
            messages={messages}
            onRefresh={loadAllData}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'seo' && (
          <AdminSEO
            settings={settings}
            contests={contests}
            articles={articles}
            onSaved={setSettings}
            onFlashNotice={triggerFlash}
          />
        )}

        {currentAdminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSaved={setSettings}
            onFlashNotice={triggerFlash}
          />
        )}
      </AdminLayout>
    );
  }

  // SITE PUBLIC MULTI-PAGES
  return (
    <div className="site-shell">
      <Header
        settings={settings}
        currentPath={route.pathname}
        onNavigate={navigate}
      />

      {route.pathname === '/' && (
        <HomePage
          settings={settings}
          sections={sections}
          contests={contests}
          media={media}
          testimonials={testimonials}
          articles={articles}
          onNavigate={navigate}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/a-propos' && (
        <AboutPage
          media={media}
          settings={settings}
          sections={sections}
          onNavigate={navigate}
        />
      )}

      {route.pathname === '/coaching' && (
        <CoachingPage
          sections={sections}
          services={services}
          methodSteps={methodSteps}
          faqs={faqs}
          contests={contests}
          media={media}
          testimonials={testimonials}
          onNavigate={navigate}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/jury' && (
        <JuryPage
          sections={sections}
          experiences={juryExperiences}
          criteria={juryCriteria}
          testimonials={testimonials}
          media={media}
          onNavigate={navigate}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/gastronomie' && (
        <GastronomyPage
          sections={sections}
          items={culinaryItems}
          media={media}
          testimonials={testimonials}
          settings={settings}
          onNavigate={navigate}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/mes-concours' && (
        <ContestsPage
          sections={sections}
          contests={contests}
          onNavigate={navigate}
        />
      )}

      {route.pathname.startsWith('/mes-concours/') && route.params.slug && (
        <ContestDetailPage
          sections={sections}
          slug={route.params.slug}
          contests={contests}
          media={media}
          onNavigate={navigate}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/galerie' && (
        <GalleryPage
          sections={sections}
          media={media}
          onOpenMedia={handleOpenLightbox}
        />
      )}

      {route.pathname === '/temoignages' && (
        <TestimonialsPage
          sections={sections}
          testimonials={testimonials}
          settings={settings}
        />
      )}

      {route.pathname === '/actualites' && (
        <NewsPage
          sections={sections}
          articles={articles}
          onNavigate={navigate}
        />
      )}

      {route.pathname.startsWith('/actualites/') && route.params.slug && (
        <ArticleDetailPage
          slug={route.params.slug}
          articles={articles}
          onNavigate={navigate}
        />
      )}

      {route.pathname === '/contact' && (
        <ContactPage
          sections={sections}
          settings={settings}
          prefilledPurpose={route.query.motif}
        />
      )}

      {route.pathname === '/mentions-legales' && (
        <LegalPage
          sections={sections}
          settings={settings}
        />
      )}

      <Footer
        settings={settings}
        onNavigate={navigate}
      />

      {/* Visionneuse photo & vidéo */}
      {activeMedia && (
        <Lightbox
          media={activeMedia}
          allMedia={activeMediaList}
          onClose={() => setActiveMedia(null)}
          onNavigate={(item) => setActiveMedia(item)}
        />
      )}
    </div>
  );
}

export type SiteSettings = {
  id?: string;
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number?: string;
  contact_address: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  default_title: string;
  default_description: string;
  default_og_image: string;
  accent_color: string;
  logo_url: string;
  legal_notice: string;
  cloudinary_cloud_name?: string;
  cloudinary_upload_preset?: string;
  updated_at?: string;
};

export type SiteSection = {
  id: string;
  page: string;
  section_key: string;
  title: string;
  eyebrow: string;
  content: string;
  image_url: string | null;
  button_label: string;
  button_url: string;
  meta: Record<string, any>;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CoachingService = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price_info: string;
  duration_info: string;
  button_label: string;
  button_url: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CoachingMethodStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

export type CoachingFAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
};

export type JuryExperience = {
  id: string;
  event_name: string;
  edition: string;
  event_year: number;
  event_date: string;
  location: string;
  organizer: string;
  role_title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type JuryCriterion = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

export type CulinaryItem = {
  id: string;
  item_type: 'specialite' | 'creation' | 'menu' | 'prestation';
  title: string;
  category: string;
  description: string;
  ingredients: string;
  dietary_info: string;
  price_info: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Contest = {
  id: string;
  name: string;
  slug: string;
  edition: string;
  year: number;
  event_date: string;
  location: string;
  organizer: string;
  short_description: string;
  long_description: string;
  coach_role_description: string;
  cover_image: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  created_at?: string;
  updated_at?: string;
  results?: ContestResult[];
};

export type ContestResult = {
  id: string;
  contest_id: string;
  candidate_name: string;
  candidate_photo: string | null;
  title_won: string;
  category: 'Miss' | 'Mister' | 'Dauphine' | 'Dauphin' | 'Ambassadeur' | 'Ambassadrice' | 'Autre' | string;
  rank_position?: number | null;
  coaching_mention: string;
  description: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string | null;
  category: string;
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  created_at?: string;
  updated_at?: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string;
  avatar_url: string | null;
  message: string;
  domain: 'coaching' | 'jury' | 'gastronomie' | 'general';
  contest_id?: string | null;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  sort_order: number;
  created_at?: string;
};

export type MediaItem = {
  id: string;
  title: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  alt_text: string;
  caption: string;
  category: 'coaching' | 'jury' | 'gastronomie' | 'concours' | 'evenements' | 'galerie';
  contest_id?: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: 'coaching' | 'jury' | 'gastronomie' | 'partenariat' | 'information' | 'autre';
  subject: string;
  message: string;
  desired_date: string;
  location: string;
  guest_count: string;
  budget: string;
  status: 'unread' | 'read' | 'processing' | 'processed' | 'archived';
  created_at: string;
  updated_at?: string;
};

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature?: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  thumbnail_url?: string;
  original_filename?: string;
}

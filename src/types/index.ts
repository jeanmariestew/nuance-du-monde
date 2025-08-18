// Types pour l'application Nuance du Monde

export interface TravelType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id?: number;
  title: string;
  slug: string;
  subtitle?: string;
  short_description?: string;
  description?: string;
  // image variants across DB and UI
  image_url?: string; // generic alias used in some endpoints
  banner_image_url?: string; // generic alias used in some pages
  image_main?: string; // DB column
  image_banner?: string; // DB column
  // allow building slider
  images?: string[];
  duration_days?: number;
  duration_nights?: number;
  duration?: string; // sometimes stored as text
  price_from?: number; // public pages may use price_from
  price?: number; // DB column name in schema
  price_currency?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined relations on detail endpoint
  travel_types?: { id: number; title: string; slug?: string }[];
  travel_themes?: { id: number; title: string; slug?: string }[];
  destinations?: { id: number; title: string; slug?: string }[];
}

export interface Destination {
  id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  banner_image_url?: string;
  price_from?: number;
  price_currency: string;
  duration_days?: number;
  duration_nights?: number;
  group_size_min?: number;
  group_size_max?: number;
  available_dates?: string[] | string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TravelTheme {
  id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  banner_image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_avatar?: string;
  image_url?: string;
  testimonial_text: string;
  rating?: number;
  destination_id?: number;
  travel_theme_id?: number;
  is_featured: boolean;
  is_active: boolean;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
  destination?: Destination;
  travel_theme?: TravelTheme;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  destination_id?: number;
  travel_theme_id?: number;
  travel_type_id?: number;
  departure_date?: string;
  return_date?: string;
  number_of_travelers?: number;
  budget_range?: string;
  special_requests?: string;
  status?: 'new' | 'in_progress' | 'quoted' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscription {
  id?: number;
  email: string;
  is_active: boolean;
  subscribed_at?: string;
  unsubscribed_at?: string;
}

export interface Partner {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}


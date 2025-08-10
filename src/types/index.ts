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
  available_dates?: string;
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
  testimonial_text: string;
  rating?: number;
  destination_id?: number;
  travel_theme_id?: number;
  is_featured: boolean;
  is_active: boolean;
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


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  focus_inbound: boolean;
  hero_image_url: string | null;
  summary: string | null;
  created_at: string;
}

export interface Experience {
  id: string;
  name: string;
  slug: string;
  destination_id: string | null;
  tags: string[];
  price_from: number | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  destination_id: string;
  travel_type: string;
  duration_days: number;
  budget_tier: string;
  price_from: number;
  deposit_amount: number;
  hero_image_url: string | null;
  overview: string | null;
  inclusions: string | null;
  exclusions: string | null;
  route_summary: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  destination?: Destination | null;
}

export interface ItineraryDay {
  id: string;
  package_id: string;
  day_number: number;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  hero_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source_page: string | null;
  trip_designer_payload: Json | null;
  created_at: string;
}

export interface Deposit {
  id: string;
  inquiry_id: string | null;
  package_id: string | null;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  created_at: string;
}

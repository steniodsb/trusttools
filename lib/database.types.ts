export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  short_description: string | null;
  long_description: string | null;
  applications: string[];
  specs: Record<string, string>;
  brand: string | null;
  tags: string[];
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type ProductWithRelations = Product & {
  category: Category | null;
  images: ProductImage[];
};

export type SiteSettings = {
  id: number;
  gtm_id: string | null;
  ga4_id: string | null;
  google_ads_id: string | null;
  meta_pixel_id: string | null;
  tiktok_pixel_id: string | null;
  head_scripts: string | null;
  body_scripts: string | null;
  updated_at: string;
};

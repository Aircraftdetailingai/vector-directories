export interface StoreSupplier {
  id: string;
  user_id: string;
  company_name: string;
  slug: string;
  contact_email: string;
  phone: string | null;
  logo_url: string | null;
  description: string | null;
  stripe_connect_id: string | null;
  is_approved: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface StoreBrand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  supplier_id: string | null;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
}

export interface StoreProduct {
  id: string;
  supplier_id: string;
  brand_id: string | null;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  compare_at_price: number | null;
  sku: string | null;
  status: "draft" | "active" | "archived";
  is_featured: boolean;
  weight_oz: number | null;
  dimensions_json: Record<string, number> | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  brand?: StoreBrand;
  category?: StoreCategory;
  images?: StoreProductImage[];
  variants?: StoreProductVariant[];
}

export interface StoreProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  sort_order: number;
}

export interface StoreProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface StoreOrder {
  id: string;
  user_id: string | null;
  email: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total: number;
  shipping_name: string | null;
  shipping_address_json: Record<string, string> | null;
  tracking_number: string | null;
  tracking_url: string | null;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
  items?: StoreOrderItem[];
}

export interface StoreOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: StoreProduct;
  variant?: StoreProductVariant;
}

export interface CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: number;
  quantity: number;
  image: string | null;
}

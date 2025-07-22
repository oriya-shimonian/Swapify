import { ProductCategory } from "./products";

export interface StatisticsData {
  productsCount: {
    available: number;
    unavailable: number;
    byCategory: { category: string; count: number }[];
    bySubcategory: { subcategory: string; count: number }[];
  };
  exchangeRequests: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  exchanges: {
    total: number;
    perMonth: { month: string; count: number }[];
  };
  notifications: {
    total: number;
    byType: { type: string; count: number }[];
  };
  chatsCount: number;
  productBreakdown: ProductBreakdownItem[];
}


export interface ProductBreakdownItem {
  category: ProductCategory
  subcategory: string;
  total: number;
  available: number;
  exchanged: number;
}


export const typeMap: Record<string, string> = {
  auto_rejected: "בקשת החלפה נדחתה אוטומטית",
  new_message: "הודעה חדשה",
  new_request: "בקשת החלפה חדשה",
  match_found: "התאמה בין בקשות",
};

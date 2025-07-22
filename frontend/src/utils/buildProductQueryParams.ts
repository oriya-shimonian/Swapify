import { ProductFilters } from "@/types/products";

export function buildProductQueryParams(
  filters: ProductFilters = {},
  options: { limit?: number; offset?: number; excludeMyProducts?: boolean } = {}
): URLSearchParams {
  const params = new URLSearchParams();

  if (options.limit !== undefined) params.append("limit", String(options.limit));
  if (options.offset !== undefined) params.append("offset", String(options.offset));
  if (options.excludeMyProducts) params.append("excludeMyProducts", "true");

  const keyMap: Record<keyof ProductFilters, string> = {
    fromDate: "from",
    toDate: "to",
    condition: "condition",
    // כל השאר לא משתנים
    search: "search",
    category: "category",
    subcategory: "subcategory",
    location: "location",
    availability: "availability",
    author: "author",
    publisher: "publisher",
    publish_year: "publish_year",
    manufacturer: "manufacturer",
    piecesCount: "piecesCount",
    min_players: "min_players",
    max_players: "max_players",
    duration: "duration",
  };

  for (const key in filters) {
    const value = filters[key as keyof ProductFilters];
    if (value) {
      const paramKey = keyMap[key as keyof ProductFilters];
      params.append(paramKey, value);
    }
  }

  return params;
}

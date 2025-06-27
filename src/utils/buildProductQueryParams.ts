type FiltersType = {
  search?: string;
  category?: string | null;
  subcategory?: string | null;
  location?: string | null;
  fromDate?: string;
  toDate?: string;
  // שדות דינמיים
  author: string;
  publisher: string;
  publish_year: string;
  manufacturer: string;
  piecesCount: string;
  min_players: string;
  max_players: string;
  duration: string;
};

export const buildProductQueryParams = (
  filters?: FiltersType,
  limit?: number,
  offset?: number
) => {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append("limit", String(limit));
  if (offset !== undefined) params.append("offset", String(offset));

  if (filters?.search) params.append("search", filters.search);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.subcategory) params.append("subcategory", filters.subcategory);
  if (filters?.location) params.append("location", filters.location);
  if (filters?.fromDate) params.append("from", filters.fromDate);
  if (filters?.toDate) params.append("to", filters.toDate);
  if (filters?.author) params.append("author", filters.author);
  if (filters?.publisher) params.append("publisher", filters.publisher);
  if (filters?.publish_year)
    params.append("publish_year", filters.publish_year);
  if (filters?.manufacturer)
    params.append("manufacturer", filters.manufacturer);
  if (filters?.piecesCount) params.append("piecesCount", filters.piecesCount);
  if (filters?.min_players) params.append("min_players", filters.min_players);
  if (filters?.max_players) params.append("max_players", filters.max_players);
  if (filters?.duration) params.append("duration", filters.duration);

  return params.toString();
};

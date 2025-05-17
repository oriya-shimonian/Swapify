import { IExchangeRequest } from "@/types/exchangeRequest";

export function filterRequests(
  requests: IExchangeRequest[],
  filters: {
    searchTerm: string;
    category: string | null;
    subcategory: string | null;
    location: string;
    availability: string | null;
    status: string | null;
    offeredProduct: string;
    owner_name?: string; // הוספנו את זה כאן
    requesterName?: string; // אופציונלי לבקשות שהתקבלו
  }
) {
  return requests.filter((req) => {
    const matchesSearch = req.requested_product?.title?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = filters.category ? req.requested_product?.category === filters.category : true;
    const matchesSubcategory = filters.subcategory ? req.requested_product?.subcategory === filters.subcategory : true;
    const matchesLocation = filters.location ? req.requested_product?.location?.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const matchesAvailability = filters.availability ? req.requested_product?.availability === filters.availability : true;
    const matchesStatus = filters.status ? req.status === filters.status : true;
    const matchesOffered = filters.offeredProduct
      ? req.offered_products.some((p) =>
          p.title.toLowerCase().includes(filters.offeredProduct.toLowerCase())
        )
      : true;

    const matchesOwner = filters.owner_name && req.type === "sent"
      ? req.owner_name.toLowerCase().includes(filters.owner_name.toLowerCase())
      : true;

    const matchesRequester = filters.requesterName && req.type === "received"
      ? (req as any).requester_name?.toLowerCase().includes(filters.requesterName.toLowerCase())
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesLocation &&
      matchesAvailability &&
      matchesStatus &&
      matchesOffered &&
      matchesOwner &&
      matchesRequester
    );
  });
}

export interface ExchangeRequestData {
  userId: number;
  productId: number;
  offeredProductIds: number[];
  userName: string;
}


export interface IExchangeRequest {
    request_id: number;
    user_id: number;
    product_id: number;
    status: "Pending" | "Approved" | "Completed" | "Rejected";
    chosen_product_id?: number | null;
    created_at: string;
    updated_at: string;
    offered_products: {
      product_id: number;
      title: string;
    }[];
    requested_product: {
      product_id: number;
      title: string;
      image_url?: string | null;
      category: string;
      subcategory?: string | null;
      location?: string | null;
      condition?: string | null;
      availability?: string;
    };
  }
  
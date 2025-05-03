import { ProductAvailability, productAvailabilityLabels } from "./products";


export function getProductAvailabilityLabel(availability: ProductAvailability): string {
  return productAvailabilityLabels[availability] || availability;
}

// סטטוס בקשת החלפה
export enum ExchangeRequestStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  COMPLETED = "Completed",
}

// תוויות סטטוסים
export const exchangeRequestStatusLabels: Record<ExchangeRequestStatus, string> = {
  [ExchangeRequestStatus.PENDING]: "ממתין",
  [ExchangeRequestStatus.APPROVED]: "מאושר",
  [ExchangeRequestStatus.REJECTED]: "נדחה",
  [ExchangeRequestStatus.COMPLETED]: "הושלם",
};

export function getExchangeRequestStatusLabel(status: ExchangeRequestStatus): string {
  return exchangeRequestStatusLabels[status] || status;
}


export interface ExchangeRequestData {
  userId: number;
  productId: number;
  offeredProductIds: number[];
  userName: string;
}

// בסיס משותף לכל הבקשות
interface BaseExchangeRequest {
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

// בקשה שנשלחה
export interface SentExchangeRequest extends BaseExchangeRequest {
  type: "sent";
  owner_name: string;
  owner_user_id: number;
}

// בקשה שהתקבלה
export interface ReceivedExchangeRequest extends BaseExchangeRequest {
  type: "received";
  requester_name: string;
  requester_user_id: number;
}

// האיחוד בין שני הסוגים
export type IExchangeRequest = SentExchangeRequest | ReceivedExchangeRequest;

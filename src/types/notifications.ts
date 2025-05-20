export interface Notification {
  notification_id: number;
  type: string;
  message: string;
  status: "Read" | "Unread";
  context_id: number;
  link: string;
  created_at: string;

  proposer_name?: string;
  product_title?: string;
  offered_titles?: string[];
  chosen_title?: string;
  target_title?: string;
  target_user_name?: string;
}

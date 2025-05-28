export type MessageType =
  | "text"
  | "location_suggestion"
  | "meeting_response"
  | "status_confirmation"
  | "system";

// export interface IMessage {
//   message_id: number;
//   chat_id: number;
//   sender_id: number;
//   type: MessageType;
//   content: string | null;
//   meeting_option_id: number | null;
//   created_at: string;
// }

export interface IMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface IChat {
  id: number;
  exchange_request_id: number;
  product_title: string; // עוזר לתצוגה
  user1_id: number;
  user2_id: number;
  created_at: string;
}

export type MeetingOption = {
  id: number;
  city: string;
  location_name: string;
  hour: string;
  is_active: boolean;
};
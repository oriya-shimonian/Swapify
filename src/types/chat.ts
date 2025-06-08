export interface IChat {
  chat_id: number;
  exchange_request_id: number;
  updated_at: string; // לצורך מיון
}

export interface IMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  type: "text" | "system";
  content: string | null;
  created_at: string;
  read_at: string | null;
}

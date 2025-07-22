import { IMessage } from "@/types/chat";

export function isMessageFromOtherUser(message: IMessage, currentUserId: number) {
  return message.sender_id !== currentUserId;
}

export function formatMessageTime(isoTime: string) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
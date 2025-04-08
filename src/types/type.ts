import { JSX } from "react";

export type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};


export interface IUser {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  profile_picture: string | null;
  location: string;
  auth_provider: "Regular" | "Facebook" | "Google";
  role_name: string;
  notification_enabled: boolean;
  is_banned: boolean;
  created_at: string; // אפשר להשתמש גם ב-Date אם רוצים 
  updated_at: string;
}

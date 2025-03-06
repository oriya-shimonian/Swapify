import { JSX } from "react";

export type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

// Define product type
export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  condition: string;
  location: string;
  image_url: string | null; // Image URL may be null for now
}

export interface IUser {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  profile_picture: string | null;
  location: string;
  auth_provider: "Regular" | "Facebook" | "Google";
  role_id: number;
  notification_enabled: boolean;
  is_banned: boolean;
  created_at: string; // אפשר להשתמש גם ב-Date אם רוצים 
  updated_at: string;
}


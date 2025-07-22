import { auth, signInWithPopup, googleProvider, facebookProvider } from "@/firebase";
import { User } from "firebase/auth";

/**
 * מבצע התחברות עם Google או Facebook דרך Firebase ומחזיר את המשתמש + הטוקן
 */
export async function signInWithSocial(provider: "google" | "facebook"): Promise<{ user: User, idToken: string }> {
  const selectedProvider = provider === "google" ? googleProvider : facebookProvider;

  const result = await signInWithPopup(auth, selectedProvider);
  const user = result.user;
  const idToken = await user.getIdToken();

  return { user, idToken };
}

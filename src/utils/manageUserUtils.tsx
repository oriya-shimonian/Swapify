import googleIcon from "../assets/users-resources logo/google-icon.png";
import facebookIcon from "../assets/users-resources logo/facebook logo.png";
  export const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "מנהל":
        return "bg-red-100 text-red-800 border-red-200";
      case "עורך":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "משתמש":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  export const getProviderImage = (provider: string) => {
    switch (provider) {
      case "Google":
        return googleIcon;
      case "Facebook":
        return facebookIcon;
      case "Regular":
        return "/logo-without bg.png";
      default:
        return "👤";
    }
  };




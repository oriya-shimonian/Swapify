import { createContext, useContext } from "react";

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// יצירת ה-Context (ללא לוגיקה)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// פונקציה מותאמת אישית לשימוש נוח ב-Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

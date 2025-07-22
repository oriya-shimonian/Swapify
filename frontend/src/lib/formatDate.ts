import { format } from "date-fns";

/**
 * פונקציה שמקבלת תאריך בפורמט מחרוזת
 * ומחזירה תאריך קריא בסגנון: Apr 26, 2025
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy");
}

import {
  Book,
  FileText,
  Calendar,
  Puzzle,
  Users,
  Clock3,
  ChevronLeftSquare,
  ChevronRightSquare,
  BookOpen,
  Factory,
} from "lucide-react";
import { ProductCategory } from "@/types/products";

// טיפוס לשדה דינמי
export interface FilterField {
  key: string;
  type: "input" | "number"; // אפשר להרחיב בעתיד
  placeholder: string;
  icon?: React.ElementType;
}

// שדות ייחודיים לפי קטגוריה
export const extraFieldsByCategory: Record<ProductCategory, FilterField[]> = {
  [ProductCategory.BOOK]: [
    {
      key: "author",
      type: "input",
      placeholder: "שם הסופר",
      icon: Book,
    },
    {
      key: "publisher",
      type: "input",
      placeholder: "הוצאה לאור",
      icon: FileText,
    },
    {
      key: "publish_year",
      type: "number",
      placeholder: "שנת פרסום",
      icon: Calendar,
    },
    {
      key: "page_count",
      type: "number",
      placeholder: "מספר עמודים",
      icon: FileText,
    },
  ],
  [ProductCategory.PUZZLE]: [
    {
      key: "manufacturer",
      type: "input",
      placeholder: "יצרן",
      icon: Factory,
    },
    {
      key: "piecesCount",
      type: "number",
      placeholder: "מספר חלקים",
      icon: Puzzle,
    },
  ],
  [ProductCategory.BOARD_GAME]: [
    {
      key: "min_players",
      type: "number",
      placeholder: "מס' שחקנים מינימלי",
      icon: ChevronLeftSquare,
    },
    {
      key: "max_players",
      type: "number",
      placeholder: "מס' שחקנים מקסימלי",
      icon: ChevronRightSquare,
    },
    {
      key: "duration",
      type: "number",
      placeholder: "משך משחק (בדקות)",
      icon: Clock3,
    },
  ],
};

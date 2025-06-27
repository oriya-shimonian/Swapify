// 📁 lib/filters/homePageFields.ts

import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import {
  ProductCategory,
  productCategoryLabels,
  ProductAvailability,
  productAvailabilityLabels,
} from "@/types/products";

// יצירת אפשרויות קטגוריה
export const categoryOptions = Object.values(ProductCategory).map((cat) => ({
  label: productCategoryLabels[cat],
  value: String(cat),
}));

// יצירת אפשרויות זמינות
export const availabilityOptions = Object.values(ProductAvailability).map(
  (availability) => ({
    label: productAvailabilityLabels[availability],
    value: String(availability),
  })
);

export const homePageFields: FilterField[] = [
  {
    key: "searchTerm",
    type: "input",
    placeholder: "חיפוש חופשי",
  },
  {
    key: "category",
    type: "select",
    placeholder: "קטגוריה",
    options: categoryOptions,
  },
  {
    key: "subcategory",
    type: "select",
    placeholder: "תת קטגוריה...",
    options: [{ label: "", value: "" }], // יתעדכן דינמית בפרונט לפי קטגוריה
  },
  {
    key: "location",
    type: "select",
    placeholder: "מיקום",
    options: [
      { label: "תל אביב", value: "תל אביב" },
      { label: "ירושלים", value: "ירושלים" },
    ],
  },
  {
    key: "availability",
    type: "select",
    placeholder: "זמינות",
    options: availabilityOptions,
  },
];

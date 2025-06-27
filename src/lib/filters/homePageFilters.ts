// 📁 lib/filters/homePageFields.ts

import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import {
  ProductCategory,
  productCategoryLabels,
  ProductAvailability,
  productAvailabilityLabels,
} from "@/types/products";
import { IUser } from "@/types/type";


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

export const homePageFields = (user: IUser | null): FilterField[] => [
//  יחפש:

// בכותרת

// בתיאור

// בשם המשתמש

// בשם מחבר/הוצאה

// ביצרן הפאזל וכו'
  {
    key: "search",
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
    type: "location",
    placeholder: "בחר מיקום",
  },
  {
    key: "availability",
    type: "select",
    placeholder: "זמינות",
    options: user && user?.role_name === "Admin" ? availabilityOptions : availabilityOptions.filter(
      (option) => option.value !== ProductAvailability.PENDING && option.value !== ProductAvailability.EXCHANGED, 
    ),
  },
];

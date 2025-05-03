// 📁 lib/filters/exchangeRequestFilters.ts

import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { ExchangeRequestStatus, exchangeRequestStatusLabels } from "@/types/exchangeRequest";
import { ProductAvailability, productAvailabilityLabels, ProductCategory, productCategoryLabels } from "@/types/products";
  // אפשרויות קטגוריות
  export const categoryOptions = Object.values(ProductCategory).map((cat) => ({
    label: productCategoryLabels[cat],
    value: String(cat),
  }));
  
  // אפשרויות זמינות
  export const availabilityOptions = Object.values(ProductAvailability).map((availability) => ({
    label: productAvailabilityLabels[availability],
    value: String(availability),
  }));
  
  // אפשרויות סטטוס
  export const statusOptions = Object.values(ExchangeRequestStatus).map((status) => ({
    label: exchangeRequestStatusLabels[status],
    value: String(status),
  }));
  
  // בסיס פילטרים משותף
  const baseFilters: FilterField[] = [
    { key: "searchTerm", type: "input", placeholder: "שם מוצר..." },
    { key: "location", type: "input", placeholder: "מיקום..." },
    { key: "category", type: "select", placeholder: "קטגוריה", options: categoryOptions },
    { key: "subcategory", type: "input", placeholder: "תת קטגוריה..." },
    { key: "availability", type: "select", placeholder: "זמינות", options: availabilityOptions },
    { key: "status", type: "select", placeholder: "סטטוס", options: statusOptions },
    { key: "offeredProduct", type: "input", placeholder: "שם מוצר שהוצע..." },
  ];
  
  // פילטרים לבקשות ששלחתי
  export const sentRequestFilters: FilterField[] = [
    ...baseFilters,
    { key: "ownerName", type: "input", placeholder: "שם בעל המוצר..." },
  ];
  
  // פילטרים לבקשות שהתקבלו
  export const receivedRequestFilters: FilterField[] = [
    ...baseFilters,
    { key: "requesterName", type: "input", placeholder: "שם המבקש..." },
  ];
  
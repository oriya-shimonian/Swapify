import { productAvailabilityLabels, productCategoryLabels, productConditionLabels } from "@/types/products";
import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";


export const filterFieldsMyProductsTab: FilterField[] = [
  {
    key: "search",
    type: "input",
    placeholder: "חיפוש חופשי לפי שם או תיאור...",
  },
  {
    key: "category",
    type: "select",
    placeholder: "קטגוריה",
    options: Object.entries(productCategoryLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "subcategory",
    type: "select",
    placeholder: "תת קטגוריה",
  },
  {
    key: "condition",
    type: "select",
    placeholder: "מצב המוצר",
    options: Object.entries(productConditionLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "availability",
    type: "select",
    placeholder: "זמינות",
    options: Object.entries(productAvailabilityLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
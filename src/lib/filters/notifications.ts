import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { productAvailabilityLabels, productCategoryLabels, productConditionLabels } from "@/types/products";

export const filterFields: FilterField[] = [
   {
    key: "search",
    type: "input",
    placeholder: "חיפוש חופשי...",
  },
  {
    key: "category",
    type: "select",
    placeholder: "בחר קטגוריה",
    options: Object.entries(productCategoryLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "subcategory",
    type: "select",
    placeholder: "בחר תת קטגוריה",
  },
  {
    key: "condition",
    type: "select",
    placeholder: "בחר מצב",
    options: Object.entries(productConditionLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "availability",
    type: "select",
    placeholder: "בחר זמינות",
    options: Object.entries(productAvailabilityLabels).map(([value, label]) => ({
      value,
      label,
    })),
  },
];
import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

export const statisticsFilterFields: FilterField[] = [
  {
    key: "category",
    type: "select",
    placeholder: "בחר קטגוריה",
    options: [
      { label: "פאזלים", value: "Puzzle" },
      { label: "משחקי קופסה", value: "Board Game" },
      { label: "ספרים", value: "Book" },
    ],
  },
  {
    key: "subcategory",
    type: "select",
    placeholder: "בחר תת קטגוריה",
  },
  {
    key: "location",
    type: "input",
    placeholder: "סינון לפי מיקום",
  },
  {
    key: "fromDate",
    type: "input",
    placeholder: "מתאריך (YYYY-MM-DD)",
  },
  {
    key: "toDate",
    type: "input",
    placeholder: "עד תאריך (YYYY-MM-DD)",
  },
];

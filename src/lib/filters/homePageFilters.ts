import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

  export const homePageFields: FilterField[] = [
    {
      key: "search",
      type: "input",
      placeholder: "חיפוש חופשי",
    },
    {
      key: "category",
      type: "select",
      placeholder: "קטגוריה",
      options: [
        { value: "Puzzle", label: "פאזל" },
        { value: "Book", label: "ספר" },
        { value: "Board Game", label: "משחק קופסה" },
      ],
    },
    {
      key: "subcategory",
      type: "select",
      placeholder: "תת־קטגוריה",
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
  ];
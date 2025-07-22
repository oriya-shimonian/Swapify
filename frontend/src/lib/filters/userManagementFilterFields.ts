import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

export const userManagementFilterFields: FilterField[] = [
  {
    key: "search",
    type: "input",
    placeholder: "חפש לפי שם או אימייל...",
  },
  {
    key: "role",
    type: "select",
    placeholder: "כל התפקידים",
    options: [
      { label: "מנהל", value: "Admin" },
      { label: "משתמש", value: "User" },
    ],
  },
  {
    key: "status",
    type: "select",
    placeholder: "כל הסטטוסים",
    options: [
      { label: "פעיל", value: "active" },
      { label: "חסום", value: "banned" },
    ],
  },
];

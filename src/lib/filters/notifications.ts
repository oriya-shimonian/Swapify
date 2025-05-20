import { FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

export const filterFields: FilterField[] = [
  {
    key: "type",
    type: "select",
    placeholder: "סוג התראה",
    options: [
      { label: "בקשה חדשה", value: "new_request" },
      { label: "אושרה", value: "approved" },
      { label: "נדחתה אוטומטית", value: "auto_rejected" },
      { label: "הושלמה", value: "completed" },
      { label: "בוטלה", value: "cancelled" },
    ],
  },
  {
    key: "status",
    type: "select",
    placeholder: "סטטוס קריאה",
    options: [
      { label: "נקראו", value: "Read" },
      { label: "לא נקראו", value: "Unread" },
    ],
  },
  {
    key: "message",
    type: "input",
    placeholder: "טקסט חופשי",
  },
];
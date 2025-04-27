import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  filters: {
    searchTerm: string;
    category: string | null;
    subcategory: string | null;
    location: string;
    availability: string | null;
    status: string | null;
    offeredProduct: string;
  };
  setFilters: (filters: any) => void;
  resetPage: () => void;
}

const selectOptions = {
  category: [
    { label: "כל הקטגוריות", value: "all" },
    { label: "פאזל", value: "Puzzle" },
    { label: "ספר", value: "Book" },
    { label: "משחק קופסה", value: "Board Game" },
  ],
  availability: [
    { label: "זמינות", value: "all" },
    { label: "זמין", value: "Available" },
    { label: "מעוניינים", value: "Interested" },
    { label: "בהמתנה", value: "Pending" },
    { label: "הוחלף", value: "Exchanged" },
  ],
  status: [
    { label: "סטטוס", value: "all" },
    { label: "ממתין", value: "Pending" },
    { label: "מאושר", value: "Approved" },
    { label: "נדחה", value: "Rejected" },
    { label: "הושלם", value: "Completed" },
  ],
};

export function Filters({ filters, setFilters, resetPage }: FiltersProps) {
  const handleChange = (field: string, value: string | null) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
    resetPage();
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {filterFields.map((field) => {
        const value = filters[field.key] ?? "";
        if (field.type === "input") {
          return (
            <Input
              key={field.key}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-min"
            />
          );
        } else if (field.type === "select") {
          return (
            <Select
              key={field.key}
              value={value || "all"}
              onValueChange={(val) =>
                handleChange(field.key, val === "all" ? null : val)
              }
            >
              <SelectTrigger className="w-max md:w-1/4">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions[field.key as keyof typeof selectOptions].map(
                  (option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          );
        }
        return null;
      })}
    </div>
  );
}

const filterFields = [
  { key: "searchTerm", type: "input", placeholder: "שם מוצר..." },
  { key: "location", type: "input", placeholder: "מיקום..." },
  { key: "category", type: "select", placeholder: "קטגוריה" },
  { key: "subcategory", type: "input", placeholder: "תת קטגוריה..." },
  { key: "availability", type: "select", placeholder: "זמינות" },
  { key: "status", type: "select", placeholder: "סטטוס" },
  { key: "offeredProduct", type: "input", placeholder: "שם מוצר שהצעת..." },
] as const;

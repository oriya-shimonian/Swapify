import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterFieldType = "input" | "select";

export interface FilterField {
  key: string;
  type: FilterFieldType;
  placeholder: string;
  options?: { label: string; value: string }[]; // רק ל-select
}

interface FiltersProps<T extends Record<string, any>> {
  filters: T;
  setFilters: (filters: (prev: T) => T) => void;
  resetPage: () => void;
  fields: FilterField[];
}

export function Filters<T extends Record<string, any>>({ filters, setFilters, resetPage, fields }: FiltersProps<T>) {
  const handleChange = (field: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    resetPage();
  };

  const getAllLabel = (key: string) => {
    switch (key) {
      case "category":
        return "כל הקטגוריות";
      case "availability":
        return "כל המצבים";
      case "status":
        return "כל הסטטוסים";
      case "subcategory":
        return "כל תתי-הקטגוריות";
      case "ownerName":
        return "כל בעלי המוצרים";
      case "requesterName":
        return "כל השולחים";
      default:
        return "הצג הכול";
    }
  };
  

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {fields.map((field) => {
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
        }

        if (field.type === "select" && field.options) {
          return (
            <Select
              key={field.key}
              value={filters[field.key] ?? undefined}
              onValueChange={(val) => handleChange(field.key, val === "all" ? null : val)}
            >
              <SelectTrigger className="w-max md:w-1/4">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">{getAllLabel(field.key)}</SelectItem>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return null;
      })}
    </div>
  );
}

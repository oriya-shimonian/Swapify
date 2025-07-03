import LocationPicker from "@/components/LocationPicker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCategory, subcategoryMaps } from "@/types/products";

type FilterFieldType = "input" | "select" | "number" | "location";

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
  design?: string;
}

export function Filters<T extends Record<string, any>>({
  filters,
  setFilters,
  resetPage,
  fields,
  design,
}: FiltersProps<T>) {
  const handleChange = (field: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
      case "owner_name":
        return "כל בעלי המוצרים";
      case "requesterName":
        return "כל השולחים";
      default:
        return "הצג הכול";
    }
  };

  const selectedCategory = filters.category as ProductCategory | null;

  const subcategoryOptions = selectedCategory
    ? Object.entries(subcategoryMaps[selectedCategory]?.toLabel || {}).map(
        ([value, label]) => ({
          value,
          label,
        })
      )
    : [];



  return (
    <div className={`flex flex-wrap gap-4 mb-6 ${design}`}>
      {fields.map((field) => {
        const value = filters[field.key] ?? "";

        if (field.type === "input" || field.type === "number") {
          return (
            <Input
              key={field.key}
              type={field.type === "number" ? "number" : "text"}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-min"
            />
          );
        }

        if (field.type === "select" && field.options) {
          if (field.key === "subcategory") {
            return (
              <Select
                key={field.key}
                value={filters.subcategory ?? undefined}
                onValueChange={(val) =>
                  handleChange(field.key, val === "all" ? null : val)
                }
                disabled={!selectedCategory}
              >
                <SelectTrigger className="w-max md:w-1/4 rtl">
                  <SelectValue placeholder="בחר תת קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל תתי-הקטגוריות</SelectItem>
                  {subcategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          } else {
            return (
              <Select
                key={field.key}
                value={filters[field.key] ?? undefined}
                onValueChange={(val) =>
                  handleChange(field.key, val === "all" ? null : val)
                }
              >
                <SelectTrigger className="w-max md:w-1/4 !rtl">
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
        }

        

        if (field.type === "location") {
          return (
            <LocationPicker
              key={Date.now()}
              selectedLocations={filters.location ? [filters.location] : []}
              onChange={(locs) =>
                setFilters((prev) => ({ ...prev, location: locs[0] || null }))
              }
            />
          );
        }

        return null;
      })}
    </div>
  );
}

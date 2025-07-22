// components/CategoryFields.tsx
import { ProductCategory } from "@/types/products";
import { Input } from "@/components/ui/input";

interface CategoryFieldsProps {
  category: ProductCategory;
  extraFields: Record<string, any>;
  setExtraFields: (fields: Record<string, any>) => void;
}

export default function CategoryFields({ category, extraFields, setExtraFields }: CategoryFieldsProps) {
  const updateField = (key: string, value: any) => {
    setExtraFields({ ...extraFields, [key]: value });
  };

  if (category === ProductCategory.BOOK) {
    return (
      <div className="space-y-4">
        <Input placeholder="שם הסופר" value={extraFields.author || ""} onChange={(e) => updateField("author", e.target.value)} />
        <Input type="number" min="1" placeholder="מספר עמודים" value={extraFields.page_count || ""} onChange={(e) => updateField("page_count", Number(e.target.value))} />
        <Input placeholder="הוצאה לאור" value={extraFields.publisher || ""} onChange={(e) => updateField("publisher", e.target.value)} />
        <Input type="number" min="0" placeholder="שנת פרסום" value={extraFields.publish_year || ""} onChange={(e) => updateField("publish_year", Number(e.target.value))} />
      </div>
    );
  }

  if (category === ProductCategory.BOARD_GAME) {
    return (
      <div className="space-y-4">
        <Input type="number" min="1" placeholder="מספר שחקנים מינימלי" value={extraFields.min_players || ""} onChange={(e) => updateField("min_players", Number(e.target.value))} />
        <Input type="number" min="1" placeholder="מספר שחקנים מקסימלי" value={extraFields.max_players || ""} onChange={(e) => updateField("max_players", Number(e.target.value))} />
        <Input type="number" min="1" placeholder="משך זמן (בדקות)" value={extraFields.duration || ""} onChange={(e) => updateField("duration", Number(e.target.value))} />
      </div>
    );
  }

  if (category === ProductCategory.PUZZLE) {
    return (
      <div className="space-y-4">
        <Input placeholder="יצרן" value={extraFields.manufacturer || ""} onChange={(e) => updateField("manufacturer", e.target.value)} />
        <Input type="number" min="1" placeholder="מספר חלקים" value={extraFields.piecesCount || ""} onChange={(e) => updateField("piecesCount", Number(e.target.value))} />
      </div>
    );
  }

  return null;
}

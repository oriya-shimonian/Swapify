import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ProductCategory,
  ProductCondition,
  subcategoryMaps,
  getProductCategoryLabel,
  getProductConditionLabel,
  getSubcategoryValueFromLabel,
} from "@/types/products";
import LocationPicker from "@/components/LocationPicker";
import useProducts from "@/hooks/useProducts";
import CategoryFields from "./CategoryFields";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FormField from "./FormField";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useProducts();

  const [category, setCategory] = useState<ProductCategory | "">("");
  const [subcategory, setSubcategory] = useState<string | "">("");
  const [condition, setCondition] = useState<ProductCondition | "">("");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [extraFields, setExtraFields] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!imageUrl) newErrors.image = "שדה חובה";
    if (!title.trim()) newErrors.title = "שדה חובה";
    if (!description.trim()) newErrors.description = "שדה חובה";
    if (!category) newErrors.category = "שדה חובה";
    if (!condition) newErrors.condition = "שדה חובה";
    if (locations.length === 0) newErrors.locations = "שדה חובה";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subcategoryOptions = useMemo(() => {
    if (!category) return [];
    const toLabel = subcategoryMaps[category]?.toLabel;
    return toLabel ? Object.values(toLabel) : [];
  }, [category]);
  

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await addProduct({
        category: category as ProductCategory,
        data: {
          userId: user?.user_id,
          imageUrl,
          title,
          description,
          category,
          subcategory: getSubcategoryValueFromLabel(category as ProductCategory, subcategory),
          condition,
          locations,
          ...extraFields,
        },
      });
      toast.success("המוצר נוסף בהצלחה!");
      navigate("/all-products");
    } catch (err) {
      toast.error("אירעה שגיאה בעת הוספת המוצר");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-14 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">הוספת מוצר חדש</h2>

      <FormField label="תמונה" required error={errors.image}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageUrl(e.target.files?.[0] || null)}
          className={errors.image ? "border-red-500" : ""}
        />
        <p className="text-sm text-muted-foreground mt-1">
          בעתיד: ניתוח אוטומטי של התמונה למילוי שדות
        </p>
      </FormField>

      <FormField label="שם המוצר" required error={errors.title}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: פאזל 1000 חלקים"
        />
      </FormField>

      <FormField label="תיאור" required error={errors.description}>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="כתוב תיאור מפורט על המוצר..."
          rows={4}
        />
      </FormField>

      <FormField label="קטגוריה" required error={errors.category}>
        <Select onValueChange={(val) => setCategory(val as ProductCategory)}>
          <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
            <SelectValue placeholder="בחר קטגוריה" />
          </SelectTrigger>
          <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
            <SelectGroup>
              {Object.values(ProductCategory).map((val) => (
                <SelectItem key={val} value={val}>
                  {getProductCategoryLabel(val)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormField>

      {category && (
        <FormField label="תת-קטגוריה">
          <Select onValueChange={setSubcategory}>
            <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
              <SelectValue placeholder="בחר תת-קטגוריה" />
            </SelectTrigger>
            <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
              <SelectGroup>
                {subcategoryOptions.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>
      )}

      {category && (
        <FormField label="שדות נוספים">
          <CategoryFields
            category={category}
            extraFields={extraFields}
            setExtraFields={setExtraFields}
          />
        </FormField>
      )}

      <FormField label="מצב המוצר" required error={errors.condition}>
        <Select onValueChange={(val) => setCondition(val as ProductCondition)}>
          <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
            <SelectValue placeholder="בחר מצב" />
          </SelectTrigger>
          <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
            <SelectGroup>
              {Object.values(ProductCondition).map((val) => (
                <SelectItem key={val} value={val}>
                  {getProductConditionLabel(val)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="מיקום" required error={errors.locations}>
        <LocationPicker
          selectedLocations={locations}
          onChange={setLocations}
          error={errors.locations}
        />
      </FormField>

      <div className="flex justify-end">
        <Button disabled={loading} className="bg-green-600 text-white" onClick={handleSubmit}>
          {loading ? "שולח..." : "הוסף מוצר"}
        </Button>
      </div>
    </div>
  );
}

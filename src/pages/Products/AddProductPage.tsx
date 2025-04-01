import { useState } from "react";
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
  PuzzleSubcategory,
  BookSubcategory,
  BoardGameSubcategory,
  subcategoryMaps
} from "@/types/products";
import LocationPicker from "@/components/LocationPicker";
import useProducts from "@/hooks/useProducts";
import CategoryFields from "./CategoryFields";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AddProductPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [subcategory, setSubcategory] = useState<string | "">("");
  const [condition, setCondition] = useState<ProductCondition | "">("");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [extraFields, setExtraFields] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addProduct } = useProducts();
  const { user } = useAuth();
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

  const mapSubcategory = (): string => {
    if (!category || !subcategory) return "";
    const map = subcategoryMaps[category]?.fromLabel;
    return map && subcategory in map ? map[subcategory as keyof typeof map] : "";
  };
  

  const handleSubmit = () => {
    if (!validate()) return;

    try {
      // TODO: Submit logic here
    addProduct({
      category: category as ProductCategory,
      data: {
        userId: user?.user_id,
        imageUrl,
        title,
        description,
        category,
        subcategory: mapSubcategory(),
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
    }
  };

  const renderSubcategory = () => {
    if (!category) return null;
  
    const labels = Object.keys(subcategoryMaps[category]?.fromLabel || {});
    return labels.map((label) => (
      <SelectItem key={label} value={label}>
        {label}
      </SelectItem>
    ));
  };
  

  return (
    <div className="container mx-auto px-4 py-8 mt-14 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">הוספת מוצר חדש</h2>

      {/* תמונה */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          תמונה <span className="text-red-500">*</span>
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageUrl(e.target.files?.[0] || null)}
          className={errors.image ? "border-red-500" : ""}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          בעתיד: ניתוח אוטומטי של התמונה למילוי שדות
        </p>
      </div>

      {/* שם המוצר */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          שם המוצר <span className="text-red-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: פאזל 1000 חלקים"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* תיאור */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          תיאור <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="כתוב תיאור מפורט על המוצר..."
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* קטגוריה */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          קטגוריה <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={(val) => setCategory(val as ProductCategory)}>
          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="בחר קטגוריה" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(ProductCategory).map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* תת-קטגוריה */}
      {category && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">תת-קטגוריה</label>
          <Select onValueChange={setSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="בחר תת-קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>{renderSubcategory()}</SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* שדות נוספים לפי קטגוריה */}
      {category && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">שדות נוספים</label>
          <CategoryFields
            category={category}
            extraFields={extraFields}
            setExtraFields={setExtraFields}
          />
        </div>
      )}

      {/* מצב המוצר */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          מצב המוצר <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={(val) => setCondition(val as ProductCondition)}>
          <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
            <SelectValue placeholder="בחר מצב" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(ProductCondition).map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.condition && (
          <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
        )}
      </div>

      {/* מיקום */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          מיקום <span className="text-red-500">*</span>
        </label>
        <LocationPicker
          selectedLocations={locations}
          onChange={setLocations}
          error={errors.locations}
        />
      </div>

      {/* כפתור שליחה */}
      <div className="flex justify-end">
        <Button className="bg-green-600 text-white" onClick={handleSubmit}>
          הוסף מוצר
        </Button>
      </div>
    </div>
  );
}

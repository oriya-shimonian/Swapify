// import { useMemo, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   ProductCategory,
//   ProductCondition,
//   subcategoryMaps,
//   getProductCategoryLabel,
//   getProductConditionLabel,
//   getSubcategoryValueFromLabel,
// } from "@/types/products";
// import LocationPicker from "@/components/LocationPicker";
// import useProducts from "@/hooks/useProducts";
// import CategoryFields from "./CategoryFields";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import FormField from "./FormField";

// export default function AddProductPage() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { addProduct } = useProducts();

//   const [category, setCategory] = useState<ProductCategory | "">("");
//   const [subcategory, setSubcategory] = useState<string | "">("");
//   const [condition, setCondition] = useState<ProductCondition | "">("");
//   const [imageUrl, setImageUrl] = useState<File | null>(null);
//   const [locations, setLocations] = useState<string[]>([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [extraFields, setExtraFields] = useState<Record<string, any>>({});
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!imageUrl) newErrors.image = "שדה חובה";
//     if (!title.trim()) newErrors.title = "שדה חובה";
//     if (!description.trim()) newErrors.description = "שדה חובה";
//     if (!category) newErrors.category = "שדה חובה";
//     if (!condition) newErrors.condition = "שדה חובה";
//     if (locations.length === 0) newErrors.locations = "שדה חובה";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const subcategoryOptions = useMemo(() => {
//     if (!category) return [];
//     const toLabel = subcategoryMaps[category]?.toLabel;
//     return toLabel ? Object.values(toLabel) : [];
//   }, [category]);
  

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       await addProduct({
//         category: category as ProductCategory,
//         data: {
//           userId: user?.user_id,
//           imageUrl,
//           title,
//           description,
//           category,
//           subcategory: getSubcategoryValueFromLabel(category as ProductCategory, subcategory),
//           condition,
//           locations,
//           ...extraFields,
//         },
//       });
//       toast.success("המוצר נוסף בהצלחה!");
//       navigate("/all-products");
//     } catch (err) {
//       toast.error("אירעה שגיאה בעת הוספת המוצר");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 mt-14 max-w-2xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">הוספת מוצר חדש</h2>

//       <FormField label="תמונה" required error={errors.image}>
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageUrl(e.target.files?.[0] || null)}
//           className={errors.image ? "border-red-500" : ""}
//         />
//         <p className="text-sm text-muted-foreground mt-1">
//           בעתיד: ניתוח אוטומטי של התמונה למילוי שדות
//         </p>
//       </FormField>

//       <FormField label="שם המוצר" required error={errors.title}>
//         <Input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="לדוגמה: פאזל 1000 חלקים"
//         />
//       </FormField>

//       <FormField label="תיאור" required error={errors.description}>
//         <Textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="כתוב תיאור מפורט על המוצר..."
//           rows={4}
//         />
//       </FormField>

//       <FormField label="קטגוריה" required error={errors.category}>
//         <Select onValueChange={(val) => setCategory(val as ProductCategory)}>
//           <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
//             <SelectValue placeholder="בחר קטגוריה" />
//           </SelectTrigger>
//           <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
//             <SelectGroup>
//               {Object.values(ProductCategory).map((val) => (
//                 <SelectItem key={val} value={val}>
//                   {getProductCategoryLabel(val)}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </FormField>

//       {category && (
//         <FormField label="תת-קטגוריה">
//           <Select onValueChange={setSubcategory}>
//             <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
//               <SelectValue placeholder="בחר תת-קטגוריה" />
//             </SelectTrigger>
//             <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
//               <SelectGroup>
//                 {subcategoryOptions.map((label) => (
//                   <SelectItem key={label} value={label}>
//                     {label}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </FormField>
//       )}

//       {category && (
//         <FormField label="שדות נוספים">
//           <CategoryFields
//             category={category}
//             extraFields={extraFields}
//             setExtraFields={setExtraFields}
//           />
//         </FormField>
//       )}

//       <FormField label="מצב המוצר" required error={errors.condition}>
//         <Select onValueChange={(val) => setCondition(val as ProductCondition)}>
//           <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
//             <SelectValue placeholder="בחר מצב" />
//           </SelectTrigger>
//           <SelectContent style={{ direction: "rtl", textAlign: "right" }}>
//             <SelectGroup>
//               {Object.values(ProductCondition).map((val) => (
//                 <SelectItem key={val} value={val}>
//                   {getProductConditionLabel(val)}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </FormField>

//       <FormField label="מיקום" required error={errors.locations}>
//         <LocationPicker
//           selectedLocations={locations}
//           onChange={setLocations}
//           error={errors.locations}
//         />
//       </FormField>

//       <div className="flex justify-end">
//         <Button disabled={loading} className="bg-green-600 text-white" onClick={handleSubmit}>
//           {loading ? "שולח..." : "הוסף מוצר"}
//         </Button>
//       </div>
//     </div>
//   );
// }


// קובץ: AddProductPage.tsx

import { useEffect, useMemo, useReducer, useState } from "react";
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
import useProducts from "@/hooks/useProducts";
import CategoryFields from "./CategoryFields";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FormField from "./FormField";
import LocationBubbles from "@/components/LocationBubbles";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const initialState = {
  title: "",
  description: "",
  category: "" as ProductCategory | "",
  subcategory: "",
  condition: "" as ProductCondition | "",
  imageUrl: null as File | null,
  extraFields: {} as Record<string, any>,
  errors: {} as Record<string, string>,
  loading: false,
};

type Action =
  | { type: "SET_FIELD"; field: string; value: any }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "RESET" };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const [state, dispatch] = useReducer(reducer, initialState);

  const subcategoryOptions = useMemo(() => {
    if (!state.category) return [];
    const toLabel = subcategoryMaps[state.category]?.toLabel;
    return toLabel ? Object.values(toLabel) : [];
  }, [state.category]);

  useEffect(() => {
    if (user?.location) {
      dispatch({ type: "SET_FIELD", field: "locations", value: user.location.split(", ") });
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.imageUrl) newErrors.image = "שדה חובה";
    if (!state.title.trim()) newErrors.title = "שדה חובה";
    if (!state.description.trim()) newErrors.description = "שדה חובה";
    if (!state.category) newErrors.category = "שדה חובה";
    if (!state.condition) newErrors.condition = "שדה חובה";
    dispatch({ type: "SET_ERRORS", errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("יש להתחבר כדי להוסיף מוצר");
      return;
    }
    if (!validate()) return;

    dispatch({ type: "SET_LOADING", loading: true });
    try {
      await addProduct({
        category: state.category as ProductCategory,
        data: {
          userId: user.user_id,
          imageUrl: state.imageUrl,
          title: state.title,
          description: state.description,
          category: state.category,
          subcategory: getSubcategoryValueFromLabel(state.category as ProductCategory, state.subcategory),
          condition: state.condition,
          locations: user.location.split(", "),
          ...state.extraFields,
        },
      });
      toast.success("המוצר נוסף בהצלחה!");
      navigate("/all-products");
    } catch (err) {
      toast.error("אירעה שגיאה בעת הוספת המוצר");
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-14 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">הוספת מוצר חדש</h2>

      <FormField label="תמונה" required error={state.errors.image}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "imageUrl",
              value: e.target.files?.[0] || null,
            })
          }
          className={state.errors.image ? "border-red-500" : ""}
        />
        <p className="text-sm text-muted-foreground mt-1">
          בעתיד: ניתוח אוטומטי של התמונה למילוי שדות
        </p>
      </FormField>

      <FormField label="שם המוצר" required error={state.errors.title}>
        <Input
          value={state.title}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "title", value: e.target.value })
          }
          placeholder="לדוגמה: פאזל 1000 חלקים"
        />
      </FormField>

      <FormField label="תיאור" required error={state.errors.description}>
        <Textarea
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })
          }
          placeholder="כתוב תיאור מפורט על המוצר..."
          rows={4}
        />
      </FormField>

      <FormField label="קטגוריה" required error={state.errors.category}>
        <Select
          onValueChange={(val) =>
            dispatch({ type: "SET_FIELD", field: "category", value: val })
          }
        >
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

      {state.category && (
        <FormField label="תת-קטגוריה">
          <Select
            onValueChange={(val) =>
              dispatch({ type: "SET_FIELD", field: "subcategory", value: val })
            }
          >
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

      {state.category && (
        <FormField label="שדות נוספים">
          <CategoryFields
            category={state.category}
            extraFields={state.extraFields}
            setExtraFields={(val) =>
              dispatch({ type: "SET_FIELD", field: "extraFields", value: val })
            }
          />
        </FormField>
      )}

      <FormField label="מצב המוצר" required error={state.errors.condition}>
        <Select
          onValueChange={(val) =>
            dispatch({ type: "SET_FIELD", field: "condition", value: val })
          }
        >
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

      <FormField label="מיקומים מועדפים להחלפה">
        <div className="flex items-center gap-2">
          <LocationBubbles locations={user?.location?.split(", ") || []} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={16} className="text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              ניתן לשנות את המיקומים שלך רק דרך עמוד הפרופיל
            </TooltipContent>
          </Tooltip>
        </div>
      </FormField>

      <div className="flex justify-end">
        <Button
          disabled={state.loading}
          className="bg-green-600 text-white"
          onClick={handleSubmit}
        >
          {state.loading ? "שולח..." : "הוסף מוצר"}
        </Button>
      </div>
    </div>
  );
}

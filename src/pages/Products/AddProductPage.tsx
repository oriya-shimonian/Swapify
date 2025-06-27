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
  // ודא שאתה מייבא את כל האנומים ותת-הקטגוריות כדי שתוכל לאמת אותם
  BookSubcategory,
  BoardGameSubcategory,
  PuzzleSubcategory,
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
import ImageUploader from "@/components/ImageUploader";
import { useAutoFillProduct } from "@/hooks/useAutoFillProduct";

const initialState = {
  productId: "",
  title: "",
  description: "",
  category: "" as ProductCategory | "",
  subcategory: "",
  condition: "" as ProductCondition | "",
  imageUrl: null as string | null, // שיניתי ל-string כי ה-Base64 הוא מחרוזת
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
  const {
    autoFill,
    loading: autoFillLoading,
    error: autoFillError,
  } = useAutoFillProduct();
  const [autoFillNote, setAutoFillNote] = useState<string | null>(null);

  const subcategoryOptions = useMemo(() => {
    if (!state.category) return [];
    const toLabel = subcategoryMaps[state.category]?.toLabel;
    return toLabel ? Object.values(toLabel) : [];
  }, [state.category]);

  useEffect(() => {
    if (user?.location) {
      dispatch({
        type: "SET_FIELD",
        field: "locations",
        value: user.location.split(", "),
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.imageUrl) newErrors.image = "שדה חובה";
    if (!state.title.trim()) newErrors.title = "שדה חובה";
    if (!state.description.trim()) newErrors.description = "שדה חובה";
    // שינוי כאן: אולי לא חובה אם אנחנו מצפים שה-AI יזהה
    // אבל עדיין כדאי לאפשר בחירה ידנית או לאמת אחרי זיהוי
    if (!state.category) newErrors.category = "יש לזהות קטגוריה או לבחור ידנית";
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

    // וודא ש-state.category מכיל ערך תקין לפני השליחה
    if (
      !Object.values(ProductCategory).includes(
        state.category as ProductCategory
      )
    ) {
      toast.error("קטגוריה לא חוקית זוהתה או לא נבחרה. אנא תקן.");
      return;
    }

    dispatch({ type: "SET_LOADING", loading: true });
    try {
      await addProduct({
        category: state.category as ProductCategory,
        data: {
          userId: user.user_id,
          imageUrl: state.imageUrl, // imageUrl כבר base64
          title: state.title,
          description: state.description,
          category: state.category,
          subcategory: getSubcategoryValueFromLabel(
            state.category as ProductCategory,
            state.subcategory
          ),
          condition: state.condition,
          locations: user.location.split(", "),
          ...state.extraFields,
        },
      });

      toast.success("המוצר נוסף בהצלחה!");
      navigate("/dashboard/my-products");
    } catch (err) {
      toast.error("אירעה שגיאה בעת הוספת המוצר");
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[4.5rem] max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">הוספת מוצר חדש</h2>

      <FormField label="תמונה" required error={state.errors.image}>
        <ImageUploader
          onSelect={(base64) =>
            dispatch({ type: "SET_FIELD", field: "imageUrl", value: base64 })
          }
        />
      </FormField>

      <FormField label="שם המוצר" required error={state.errors.title}>
        <div className="space-y-2">
          <Input
            value={state.title}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "title",
                value: e.target.value,
              })
            }
            placeholder="לדוגמה: פאזל 1000 חלקים"
          />
          <p className="text-sm text-muted-foreground"> שימו לב: המילוי האוטומטי לא תמיד מדויק, יש לבדוק את השדות לאחר מכן ולמלא באופן ידני את תמונת המוצר</p>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (!state.title.trim()) {
                setAutoFillNote("נא למלא שם מוצא לפני המילוי האוטומטי");
                return;
              }
              setAutoFillNote(null);
              const result = await autoFill(state.title.trim());
              if (!result) {
                setAutoFillNote("המילוי האוטומטי נכשל 😢");
                return;
              }
              console.log("DEBUG", {
                category: result.category,
                subcategory: result.subcategory,
                toLabelMap: subcategoryMaps[result.category as ProductCategory]?.toLabel,
                labelValue:
                // @ts-ignore
                  subcategoryMaps[result.category as ProductCategory]?.toLabel?.[
                    result.subcategory as string
                  ],
              });

              console.log("DEBUG result", result);
              console.log("DEBUG subcategoryMaps", );
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: result.description || "",
              });
              dispatch({
                type: "SET_FIELD",
                field: "category",
                value: result.category || "",
              });
              dispatch({
                type: "SET_FIELD",
                field: "subcategory",
                // @ts-ignore
                value: subcategoryMaps[result.category as ProductCategory]?.toLabel?.[
                    result.subcategory as string
                  ] || "",
              });
              dispatch({
                type: "SET_FIELD",
                field: "extraFields",
                value: result.extraFields || {},
              });

              setAutoFillNote("🎉 המילוי האוטומטי הצליח! ניתן לשנות ידנית");
            }}
            disabled={autoFillLoading}
          >
            {autoFillLoading ? "ממלא..." : "מלא אוטומטית לפי שם"}
          </Button>

          {autoFillNote && (
            <p className="text-sm text-muted-foreground">{autoFillNote}</p>
          )}
        </div>
      </FormField>

      <FormField label="תיאור" required error={state.errors.description}>
        <Textarea
          value={state.description}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "description",
              value: e.target.value,
            })
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
          value={state.category}
          disabled={state.loading} // אפשר לחסום שינוי קטגוריה בזמן שה-AI מנתח
        >
          <SelectTrigger style={{ direction: "rtl", textAlign: "right" }}>
            <SelectValue placeholder="בחר קטגוריה (או תזוהה אוטומטית)" />
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
            value={state.subcategory}
            disabled={state.loading}
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
          value={state.condition}
          disabled={state.loading}
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
              <Info
                size={16}
                className="text-muted-foreground cursor-pointer"
              />
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

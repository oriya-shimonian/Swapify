import { IProduct, ProductCategory } from "@/types/products";
import { extraFieldsByCategory } from "@/lib/filters/extraFieldsByCategory";
import IconAndBgWithText from "./ProductDetails/IconAndBgWithText";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  product: IProduct;
  isEditing: boolean;
  onChange?: (key: string, value: string | number) => void;
}

const COLORS = ["pink", "lime", "cyan", "yellow", "emerald", "fuchsia"];

export default function CategorySpecificFields({
  product,
  isEditing,
  onChange,
}: Props) {
  const fields = extraFieldsByCategory[product.category];
  if (!fields) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {fields.map((field, index) => {
        const key = field.key as keyof IProduct;
        const value = product[key] ?? "";

        if (isEditing && onChange) {
          return (
            <input
              key={field.key}
              type="text"
              placeholder={field.placeholder}
              value={value as string | number}
              onChange={(e) => {
                const raw = e.target.value;
                const finalValue =
                  typeof product[key] === "number" ? Number(raw) : raw;
                onChange(field.key, finalValue);
              }}
              className="w-full bg-white/80 border rounded-xl p-3"
            />
          );
        }
        console.log(
          "Rendering icon for field:",
          field.key,
          "with value:",
          value
        );

        return field.icon ? (
          !value ? (
            <TooltipProvider key={field.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <IconAndBgWithText
                      key={field.key}
                      Icon={field.icon as LucideIcon}
                      label={field.placeholder}
                      value="לא צוין"
                      color={COLORS[index % COLORS.length]}
                      valueDesign="opacity-60"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  ניתן לעדכן בלחיצה על כפתור העריכה למטה
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <IconAndBgWithText
              key={field.key}
              Icon={field.icon as LucideIcon}
              label={field.placeholder}
              value={value.toString()}
              color={COLORS[index % COLORS.length]}
            />
          )
        ) : null;
      })}
    </div>
  );
}

import googleIcon from "../assets/users-resources logo/google-icon.png";
import facebookIcon from "../assets/users-resources logo/facebook logo.png";
import { StatisticsData } from "@/types/statistics";
import { getProductCategoryLabel, getSubcategoryLabel, ProductCategory, subcategoryMaps } from "@/types/products";
  export const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "מנהל":
        return "bg-red-100 text-red-800 border-red-200";
      case "עורך":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "משתמש":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  export const getProviderImage = (provider: string) => {
    switch (provider) {
      case "Google":
        return googleIcon;
      case "Facebook":
        return facebookIcon;
      case "Regular":
        return "/logo-without bg.png";
      default:
        return "👤";
    }
  };


// export const downloadStatisticsCSV = (data: StatisticsData) => {
//   const lines: string[] = [];

//   // כרטיסי סיכום
//   lines.push("סוג,כמות");
//   lines.push(`מוצרים זמינים,${data.productsCount.available}`);
//   lines.push(`לא זמינים / מוחלפים,${data.productsCount.unavailable}`);
//   lines.push(`בקשות החלפה,${data.exchangeRequests.total}`);
//   lines.push(`החלפות שבוצעו,${data.exchanges.total}`);
//   lines.push(`התראות שנשלחו,${data.notifications.total}`);
//   lines.push(`צ׳אטים שנפתחו,${data.chatsCount}`);
//   lines.push(""); // רווח

//   // פונקציית עזר לפילוחים
//   const section = (title: string, headers: string[], rows: [string, number][]) => {
//     lines.push(title);
//     lines.push(headers.join(","));
//     rows.forEach(([name, count]) => {
//       lines.push(`${name},${count}`);
//     });
//     lines.push("");
//   };

//   section(
//     "מוצרים לפי קטגוריה",
//     ["קטגוריה", "כמות"],
//     data.productsCount.byCategory.map(({ category, count }) => [
//       getProductCategoryLabel(category as ProductCategory),
//       count,
//     ])
//   );

//   section(
//     "מוצרים לפי תת־קטגוריה",
//     ["תת־קטגוריה", "כמות"],
//     data.productsCount.bySubcategory.map(({ subcategory, count }) => [
//       subcategory,
//       count,
//     ])
//   );

//   section(
//     "בקשות לפי סטטוס",
//     ["סטטוס", "כמות"],
//     data.exchangeRequests.byStatus.map(({ status, count }) => [status, count])
//   );

//   section(
//     "התראות לפי סוג",
//     ["סוג", "כמות"],
//     data.notifications.byType.map(({ type, count }) => [type, count])
//   );

//   section(
//     "החלפות לפי חודש",
//     ["חודש", "כמות"],
//     data.exchanges.perMonth.map(({ month, count }) => [month, count])
//   );

//   // טבלת הפירוט עם תרגום + שיעור החלפה
//   lines.push("פירוט לפי קטגוריה ותת־קטגוריה");
//   lines.push("קטגוריה,תת־קטגוריה,סה\"כ כמות,זמינים,הוחלפו,שיעור החלפה");

//   data.productBreakdown.forEach((item) => {
//     const categoryLabel = getProductCategoryLabel(item.category);
//     const subcategoryLabel = getSubcategoryLabel(item.category, item.subcategory);
//     const rate =
//       item.total > 0
//         ? `${Math.round((item.exchanged / item.total) * 100)}%`
//         : "0%";

//     lines.push(
//       `${categoryLabel},${subcategoryLabel},${item.total},${item.available},${item.exchanged},${rate}`
//     );
//   });

//   // יצירת Blob והורדה
//   const blob = new Blob(["\uFEFF" + lines.join("\n")], {
//     type: "text/csv;charset=utf-8;",
//   });

//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "סטטיסטיקות_Swapify.csv";
//   link.click();
// };

export const downloadStatisticsCSV = (data: StatisticsData) => {
  const lines: string[] = [];

  // כרטיסי סיכום
  lines.push("סוג,כמות");
  lines.push(`מוצרים זמינים,${data.productsCount.available}`);
  lines.push(`לא זמינים / מוחלפים,${data.productsCount.unavailable}`);
  lines.push(`בקשות החלפה,${data.exchangeRequests.total}`);
  lines.push(`החלפות שבוצעו,${data.exchanges.total}`);
  lines.push(`התראות שנשלחו,${data.notifications.total}`);
  lines.push(`צ׳אטים שנפתחו,${data.chatsCount}`);
  lines.push("");

  // פונקציית עזר לפילוחים
  const section = (
    title: string,
    headers: string[],
    rows: [string, number][]
  ) => {
    lines.push(title);
    lines.push(headers.join(","));
    rows.forEach(([name, count]) => {
      lines.push(`${name},${count}`);
    });
    lines.push("");
  };

  section(
    "מוצרים לפי קטגוריה",
    ["קטגוריה", "כמות"],
    data.productsCount.byCategory.map(({ category, count }) => [
      getProductCategoryLabel(category as ProductCategory),
      count,
    ])
  );

  section(
    "מוצרים לפי תת־קטגוריה",
    ["תת־קטגוריה", "כמות"],
    data.productsCount.bySubcategory.map(({ subcategory, count }) => [
      subcategory,
      count,
    ])
  );

  section(
    "בקשות לפי סטטוס",
    ["סטטוס", "כמות"],
    data.exchangeRequests.byStatus.map(({ status, count }) => [status, count])
  );

  section(
    "התראות לפי סוג",
    ["סוג", "כמות"],
    data.notifications.byType.map(({ type, count }) => [type, count])
  );

  section(
    "החלפות לפי חודש",
    ["חודש", "כמות"],
    data.exchanges.perMonth.map(({ month, count }) => [month, count])
  );

  // טבלת הפירוט עם כל תתי־הקטגוריות (כולל אפס)
  lines.push("פירוט לפי קטגוריה ותת־קטגוריה");
  lines.push("קטגוריה,תת־קטגוריה,סה\"כ כמות,זמינים,הוחלפו,שיעור החלפה");

  // קיבוץ קיים לפי קטגוריה ותת־קטגוריה
  const grouped = data.productBreakdown.reduce<
    Record<string, Record<string, typeof data.productBreakdown[0]>>
  >((acc, item) => {
    if (!acc[item.category]) acc[item.category] = {};
    acc[item.category][item.subcategory] = item;
    return acc;
  }, {});

  // לולאה על כל תתי־הקטגוריות האפשריים לפי המפה
  Object.entries(subcategoryMaps).forEach(([categoryKey, map]) => {
    Object.keys(map.toLabel).forEach((subcategoryKey) => {
      const item =
        grouped[categoryKey]?.[subcategoryKey] ?? {
          category: categoryKey,
          subcategory: subcategoryKey,
          total: 0,
          available: 0,
          exchanged: 0,
        };

      const categoryLabel = getProductCategoryLabel(
        item.category as ProductCategory
      );
      const subcategoryLabel = getSubcategoryLabel(
        item.category as ProductCategory,
        item.subcategory
      );
      const rate =
        item.total > 0
          ? `${Math.round((item.exchanged / item.total) * 100)}%`
          : "0%";

      lines.push(
        `${categoryLabel},${subcategoryLabel},${item.total},${item.available},${item.exchanged},${rate}`
      );
    });
  });

  // יצירת Blob והורדה
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "סטטיסטיקות_Swapify.csv";
  link.click();
};

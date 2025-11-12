// import StatisticsChart from "./StatisticsChart";
// import GaugeChart from "./GaugeChart";
// import { StatisticsData, typeMap } from "@/types/statistics";
// import { Card } from "../ui/card";
// import { productCategoryLabels } from "@/types/products";

// interface Props {
//   data: StatisticsData;
// }

// const StatisticsChartsSection = ({ data }: Props) => {
//   const total = data.exchangeRequests.total;
//   const approved =
//     data.exchangeRequests.byStatus.find((s) => s.status === "Approved")
//       ?.count || 0;
//   const approvalPercentage = total > 0 ? (approved / total) * 100 : 0;
//   const totalProducts =
//     data.productsCount.available + data.productsCount.unavailable;

//   const totalRequests = data.exchangeRequests.total;

//   const getCategoryCount = (cat: string) =>
//     Number(
//       data.productsCount.byCategory.find((c) => c.category === cat)?.count ?? 0
//     );

//   const gaugeData = [
//     {
//       title: "אחוז מוצרים זמינים",
//       value:
//         totalProducts > 0
//           ? (data.productsCount.available / totalProducts) * 100
//           : 0,
//       color: "#10b981", // ירוק
//     },
//     {
//       title: "אחוז בקשות שהושלמו",
//       value:
//         totalRequests > 0
//           ? ((data.exchangeRequests.byStatus.find(
//               (s) => s.status === "Completed"
//             )?.count ?? 0) /
//               totalRequests) *
//             100
//           : 0,
//       color: "#f59e0b", // כתום
//     },
//     {
//       title: "אחוז פאזלים מכלל המוצרים",
//       value:
//         totalProducts > 0
//           ? (getCategoryCount("Puzzle") / totalProducts) * 100
//           : 0,
//       color: "#3b82f6", // כחול
//     },
//     {
//       title: "אחוז ספרים מכלל המוצרים",
//       value:
//         totalProducts > 0
//           ? (getCategoryCount("Book") / totalProducts) * 100
//           : 0,
//       color: "#8b5cf6", // סגול
//     },
//     {
//       title: "אחוז משחקי קופסה מכלל המוצרים",
//       value:
//         totalProducts > 0
//           ? (getCategoryCount("Board Game") / totalProducts) * 100
//           : 0,
//       color: "#ec4899", // ורוד
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <StatisticsChart
//         title="מוצרים לפי קטגוריה"
//         type="radar"
//         data={data.productsCount.byCategory.map((item) => ({
//           // @ts-ignore
//           name: productCategoryLabels[item.category] || item.category,
//           value: +item.count,
//         }))}
//       />

//       <StatisticsChart
//         title="סטטוס בקשות החלפה"
//         type="bar"
//         data={data.exchangeRequests.byStatus.map((item) => ({
//           name: item.status,
//           value: item.count,
//         }))}
//       />

//       <StatisticsChart
//         title="סוגי התראות"
//         type="pie"
//         data={data.notifications.byType.map((item) => ({
//           name: typeMap[item.type] || item.type,
//           value: +item.count,
//         }))}
//       />

//       <StatisticsChart
//         title="החלפות שבוצעו לפי חודש"
//         type="area"
//         data={data.exchanges.perMonth.map((item) => ({
//           name: item.month,
//           value: +item.count,
//         }))}
//       />

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//         {gaugeData.map((g, idx) => (
//           <GaugeChart
//             key={idx}
//             title={g.title}
//             value={+g.value.toFixed(1)}
//             color={g.color}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StatisticsChartsSection;

import StatisticsChart from "./StatisticsChart";
import GaugeChart from "./GaugeChart";
import { StatisticsData, typeMap } from "@/types/statistics";
import { Card } from "../ui/card";
import { productCategoryLabels } from "@/types/products";
import { normalizeLocations } from "@/utils/manageUserUtils";
import { useUserLocationStats } from "@/hooks/useUserLocationStats";

interface Props {
  data: StatisticsData;
}

const StatisticsChartsSection = ({ data }: Props) => {
  // const total = data.exchangeRequests.total;
  // @ts-ignore
  const { data: locationStats, loading: loadingLocations } =
    useUserLocationStats();
  // const approved =
  //   data.exchangeRequests.byStatus.find((s) => s.status === "Approved")
  //     ?.count || 0;
  // const approvalPercentage = total > 0 ? (approved / total) * 100 : 0;
  const totalProducts =
    data.productsCount.available + data.productsCount.unavailable;

  const totalRequests = data.exchangeRequests.total;

  const getCategoryCount = (cat: string) =>
    Number(
      data.productsCount.byCategory.find((c) => c.category === cat)?.count ?? 0
    );

  const gaugeData = [
    {
      title: "אחוז מוצרים זמינים",
      value:
        totalProducts > 0
          ? (data.productsCount.available / totalProducts) * 100
          : 0,
      color: "#10b981", // ירוק
    },
    {
      title: "אחוז בקשות שהושלמו",
      value:
        totalRequests > 0
          ? ((data.exchangeRequests.byStatus.find(
              (s) => s.status === "Completed"
            )?.count ?? 0) /
              totalRequests) *
            100
          : 0,
      color: "#f59e0b", // כתום
    },
  ];

  const categoryGauges = [
    {
      title: "אחוז פאזלים מכלל המוצרים",
      color: "#3b82f6",
      value:
        totalProducts > 0
          ? (getCategoryCount("Puzzle") / totalProducts) * 100
          : 0,
    },
    {
      title: "אחוז ספרים מכלל המוצרים",
      color: "#8b5cf6",
      value:
        totalProducts > 0
          ? (getCategoryCount("Book") / totalProducts) * 100
          : 0,
    },
    {
      title: "אחוז משחקי קופסה מכלל המוצרים",
      color: "#ec4899",
      value:
        totalProducts > 0
          ? (getCategoryCount("Board Game") / totalProducts) * 100
          : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatisticsChart
        title="מוצרים לפי קטגוריה"
        type="radar"
        data={data.productsCount.byCategory.map((item) => ({
          // @ts-ignore
          name: productCategoryLabels[item.category] || item.category,
          value: +item.count,
        }))}
      />

      <StatisticsChart
        title="סטטוס בקשות החלפה"
        type="bar"
        data={data.exchangeRequests.byStatus.map((item) => ({
          name: item.status,
          value: item.count,
        }))}
      />

      <StatisticsChart
        title="סוגי התראות"
        type="pie"
        data={data.notifications.byType.map((item) => ({
          name: typeMap[item.type] || item.type,
          value: +item.count,
        }))}
      />

      <StatisticsChart
        title="החלפות שבוצעו לפי חודש"
        type="area"
        data={data.exchanges.perMonth.map((item) => ({
          name: item.month,
          value: +item.count,
        }))}
      />

      <StatisticsChart
        title="התפלגות מיקומי המשתמשים"
        type="bar"
        data={normalizeLocations(locationStats)}
        className="h-full lg:col-span-2 sm:col-span-1 md:col-span-2"
      />

      {/* חמישה מחוונים בתוך כרטיס אחד */}
      <Card className="p-4 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">מדדים מרכזיים</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {[...gaugeData, ...categoryGauges].map((g, idx) => (
            <div key={idx} className="flex justify-center">
              <GaugeChart
                title={g.title}
                value={+g.value.toFixed(1)}
                color={g.color}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatisticsChartsSection;

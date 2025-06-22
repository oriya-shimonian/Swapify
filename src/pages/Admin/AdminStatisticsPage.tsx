// import { useState } from "react";
// import { useStatistics } from "@/hooks/useStatistics";
// import { StatisticsData } from "@/types/statistics";
// import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
// import { statisticsFilterFields } from "@/lib/filters/statisticsFilterFields";
// import StatsCards from "@/components/StatsCards";
// import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";

// import { BarChart, PieChart } from "lucide-react"; // אייקונים לדוגמה

// const AdminStatisticsPage = () => {
//   const [filters, setFilters] = useState({
//     fromDate: null,
//     toDate: null,
//     category: null,
//     subcategory: null,
//     location: "",
//   });

//   const resetPage = () => {}; // חובה לפי Filters אבל אין בו צורך כאן

//   const { data, loading } = useStatistics(filters);

//   const cards = data
//     ? [
//         {
//           label: "מוצרים זמינים",
//           value: data.productsCount.available,
//           color: "green",
//           Icon: PieChart,
//         },
//         {
//           label: "לא זמינים / מוחלפים",
//           value: data.productsCount.unavailable,
//           color: "orange",
//           Icon: BarChart,
//         },
//         {
//           label: "בקשות החלפה",
//           value: data.exchangeRequests.total,
//           color: "blue",
//           Icon: BarChart,
//         },
//         {
//           label: "החלפות שבוצעו",
//           value: data.exchanges.total,
//           color: "purple",
//           Icon: PieChart,
//         },
//         {
//           label: "התראות שנשלחו",
//           value: data.notifications.total,
//           color: "gray",
//           Icon: BarChart,
//         },
//         {
//           label: "צ׳אטים שנפתחו",
//           value: data.chatsCount,
//           color: "blue",
//           Icon: PieChart,
//         },
//       ]
//     : [];

//   return (
//     <section className="p-6 space-y-8">
//       <h1 className="text-2xl font-bold">סטטיסטיקות כלליות</h1>

//       <Filters
//         filters={filters}
//         setFilters={setFilters}
//         resetPage={resetPage}
//         fields={statisticsFilterFields}
//       />

//       {loading ? (
//         <StatsCardsSkeleton />
//       ) : (
//         <StatsCards items={cards} columns={3} />
//       )}

//       {/* כאן נוסיף בהמשך גרפים וטבלאות */}
//       {/* <StatisticsCharts data={data} /> */}
//       {/* <StatisticsBreakdownTable data={data} /> */}
//     </section>
//   );
// };

// export default AdminStatisticsPage;

import { useState } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { statisticsFilterFields } from "@/lib/filters/statisticsFilterFields";
import StatsCards from "@/components/StatsCards";
import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";
import StatisticsChartsSection from "@/components/adminStats/StatisticsChartsSection";

import { BarChart, PieChart } from "lucide-react";
import { DateRangePicker } from "@/components/DateRangePicker";
import StatisticsBreakdownTable from "@/components/adminStats/StatisticsBreakdownTable";

const AdminStatisticsPage = () => {
  const [filters, setFilters] = useState<{
    fromDate: string | null;
    toDate: string | null;
    category: string | null;
    subcategory: string | null;
    location: string;
  }>({
    fromDate: null,
    toDate: null,
    category: null,
    subcategory: null,
    location: "",
  });

  const resetPage = () => {}; // חובה לפי Filters

  const { data, loading } = useStatistics(filters);

  const handleDateChange = (from: string, to: string) => {
    setFilters((prev) => ({
      ...prev,
      fromDate: from || null,
      toDate: to || null,
    }));
  };

  const cards = data
    ? [
        {
          label: "מוצרים זמינים",
          value: data.productsCount.available,
          color: "green",
          Icon: PieChart,
        },
        {
          label: "לא זמינים / מוחלפים",
          value: data.productsCount.unavailable,
          color: "orange",
          Icon: BarChart,
        },
        {
          label: "בקשות החלפה",
          value: data.exchangeRequests.total,
          color: "blue",
          Icon: BarChart,
        },
        {
          label: "החלפות שבוצעו",
          value: data.exchanges.total,
          color: "purple",
          Icon: PieChart,
        },
        {
          label: "התראות שנשלחו",
          value: data.notifications.total,
          color: "gray",
          Icon: BarChart,
        },
        {
          label: "צ׳אטים שנפתחו",
          value: data.chatsCount,
          color: "red",
          Icon: PieChart,
        },
      ]
    : [];

    console.log("Statistics data:", data);
    
  return (
    <section className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">סטטיסטיקות כלליות</h1>

      <div className="flex flex-wrap gap-4 items-end w-full">
        <div className="max-w-full mb-6">
          <DateRangePicker
          fromDate={filters.fromDate ?? ""}
          toDate={filters.toDate ?? ""}
          onChange={handleDateChange}
          />
        </div>
        
        <Filters
          filters={filters}
          setFilters={setFilters}
          resetPage={resetPage}
          fields={statisticsFilterFields.filter(
            (f) => f.key !== "fromDate" && f.key !== "toDate"
          )}
        />
      </div>
      {loading ? (
        <StatsCardsSkeleton />
      ) : (
        <>
          <StatsCards items={cards} columns={3} />
          {!loading && data && <StatisticsChartsSection data={data} />}
          {!loading && data && <StatisticsBreakdownTable data={data.productBreakdown} />}
        </>
      )}
    </section>
  );
};

export default AdminStatisticsPage;

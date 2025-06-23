import { useState } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { statisticsFilterFields } from "@/lib/filters/statisticsFilterFields";
import StatsCards from "@/components/StatsCards";
import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";
import StatisticsChartsSection from "@/components/adminStats/StatisticsChartsSection";

import { BarChart, Download, PieChart } from "lucide-react";
import { DateRangePicker } from "@/components/DateRangePicker";
import StatisticsBreakdownTable from "@/components/adminStats/StatisticsBreakdownTable";
import { downloadStatisticsCSV } from "@/utils/manageUserUtils";
import { Button } from "@/components/ui/button";
import AppButton from "@/components/Buttons/AppButton";

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
{/* 
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pb-0 mb-8 flex lg:flex-nowrap sm:flex-wrap">
        <div className="gap-4 items-end w-full">
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
            design="w-[600px]"
          />
        </div>
        <AppButton className="items-center w-64 mb-4 h-fit py-3 gap-4 text-sm flex flex-row" onClick={() => data && downloadStatisticsCSV(data)}>
          <Download size={16} className="mt-0.5"/>
          הורדת המידע לקובץ CSV
        </AppButton>
      </div> */}

<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 pb-0">
  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
    
    {/* 🟦 Date Picker */}
    <div className="w-full lg:w-auto mb-6">
      <DateRangePicker
        fromDate={filters.fromDate ?? ""}
        toDate={filters.toDate ?? ""}
        onChange={handleDateChange}
      />
    </div>

    {/* 🟨 Filters */}
    <div className="w-full lg:flex-1">
      <Filters
        filters={filters}
        setFilters={setFilters}
        resetPage={resetPage}
        fields={statisticsFilterFields.filter(
          (f) => f.key !== "fromDate" && f.key !== "toDate"
        )}
        design="w-full"
      />
    </div>

    {/* 🟪 כפתור הורדה */}
    <div className="w-full lg:w-auto mb-6">
      <AppButton
        onClick={() => data && downloadStatisticsCSV(data)}
        className="w-full lg:w-64 py-3 text-sm justify-center"
      >
        <Download size={16} />
        הורדת המידע לקובץ CSV
      </AppButton>
    </div>
    
  </div>
</div>




      {loading ? (
        <StatsCardsSkeleton />
      ) : (
        <>
          <StatsCards items={cards} columns={3} />
          {!loading && data && <StatisticsChartsSection data={data} />}
          {!loading && data && (
            <StatisticsBreakdownTable data={data.productBreakdown} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminStatisticsPage;

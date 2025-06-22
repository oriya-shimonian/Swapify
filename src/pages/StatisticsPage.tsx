// // pages/StatisticsPage.tsx
// import { useState } from "react";
// import { useStatistics } from "@/hooks/useStatistics";
// import { Filters, FilterField } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
// import { StatsCard } from "@/components/shared/StatsCard"; // נבנה אותה תכף

// const StatisticsPage = () => {
//   const [filters, setFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     category: "",
//     location: "",
//   });

//   const { data, loading } = useStatistics(filters);

//   const fields: FilterField[] = [
//     { key: "fromDate", label: "מתאריך", type: "date" },
//     { key: "toDate", label: "עד תאריך", type: "date" },
//     { key: "category", label: "קטגוריה", type: "select", options: ["", "Book", "Puzzle", "Board Game"] },
//     { key: "location", label: "מיקום", type: "select", options: ["", "תל אביב", "חיפה", "ירושלים"] }, // אפשר לשפר לפי DB
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">נתוני מערכת</h1>

//       <Filters fields={fields} values={filters} onChange={setFilters} />

//       {loading && <div>טוען נתונים...</div>}

//       {!loading && data && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatsCard label="משתמשים רשומים" value={data.total_users} color="blue" />
//           <StatsCard label="משתמשים פעילים" value={data.active_users} color="green" />
//           <StatsCard label="מוצרים באתר" value={data.total_products} color="purple" />
//           <StatsCard label="מוצרים זמינים" value={data.available_products} color="emerald" />
//           <StatsCard label="בקשות החלפה" value={data.total_requests} color="orange" />
//           <StatsCard label="בקשות שאושרו" value={data.approved_requests} color="teal" />
//           <StatsCard label="החלפות שבוצעו" value={data.total_exchanges} color="fuchsia" />
//           <StatsCard label="צ׳אטים נפתחו" value={data.total_chats} color="cyan" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default StatisticsPage;

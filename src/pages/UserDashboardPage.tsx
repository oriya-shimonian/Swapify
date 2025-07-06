import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { label: "המוצרים שלי", to: "my-products" },
  { label: "בקשות ששלחתי", to: "requests/sent" },
  { label: "בקשות שהתקבלו", to: "requests/received" },
  // { label: "כל בקשות ההחלפה", to: "requests/exchange" }, // Only visible to Admins
];

export default function UserDashboardWrapper() {
  const getTabClass = (isActive: boolean) =>
    `px-4 py-2 rounded-t-md border-b-2 ${
      isActive
        ? "text-blue-600 border-blue-600 font-bold bg-white"
        : "text-gray-500 border-transparent hover:text-gray-700"
    }`;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-[4.5rem]">
      <h1 className="text-2xl font-bold mb-6">האזור האישי</h1>

      <nav className="flex gap-6 border-b mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => getTabClass(isActive)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}

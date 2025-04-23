import { NavLink, Outlet } from "react-router-dom";

export default function UserDashboardWrapper() {
  const tabLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-blue-600 border-b-2 border-blue-600 pb-2"
      : "text-gray-500 hover:text-gray-700 pb-2";

  return (
    <div className="p-6 max-w-4xl mx-auto mt-[4.5rem] ">
      <h1 className="text-2xl font-bold mb-6">האזור האישי</h1>

      <nav className="flex gap-6 border-b mb-6">
        <NavLink
          to="my-products"
          className={({ isActive }) =>
            `px-4 py-2 rounded-t-md border-b-2 ${
              isActive
                ? "text-blue-600 border-blue-600 font-bold bg-white"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`
          }
        >
          המוצרים שלי
        </NavLink>
        <NavLink
          to="requests/sent"
          className={({ isActive }) =>
            `px-4 py-2 rounded-t-md border-b-2 ${
              isActive
                ? "text-blue-600 border-blue-600 font-bold bg-white"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`
          }
        >
          בקשות ששלחתי
        </NavLink>

        <NavLink
          to="requests/received"
          className={({ isActive }) =>
            `px-4 py-2 rounded-t-md border-b-2 ${
              isActive
                ? "text-blue-600 border-blue-600 font-bold bg-white"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`
          }
        >
          בקשות שהתקבלו
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}

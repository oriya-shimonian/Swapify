import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto mt-[4.5rem]">

      {/* אפשר להוסיף כאן future סיידבר או Tabs */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;

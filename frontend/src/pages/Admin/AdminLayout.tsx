import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="mx-auto mt-[4.5rem]">

      {/* אפשר להוסיף כאן future סיידבר או Tabs */}
        {/* Outlet for nested routes */}
        <Outlet />
    </div>
  );
};

export default AdminLayout;

// import { useEffect, useState } from "react";
// import { UserCheck, UserX, Ban, Trash2 } from "lucide-react";
// import { useUserActions } from "@/hooks/useUserActions";
// import { IUser } from "@/types/type";
// import {
//   Filters,
// } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
// import googleIcon from "../assets/users-resources logo/google-icon.png";
// import facebookIcon from "../assets/users-resources logo/facebook logo.png";
// import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";
// import FiltersSkeleton from "@/components/skelton/FiltersSkeleton";
// import UsersTableSkeleton from "@/components/skelton/UsersTableSkeleton";
// import { userManagementFilterFields } from "@/lib/filters/userManagementFilterFields";

// const AdminUsersPage = () => {
//   const { getAllUsers, deleteUser, banUser } = useUserActions();
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: "",
//     role: null as string | null,
//     status: null as string | null,
//   });
//   const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       const data = await getAllUsers();
//       setUsers(data);
//       setLoading(false);
//     };
//     fetchUsers();
//   }, []);

//   const handleBanUser = async (userId: number) => {
//     const updated = await banUser(userId);
//     setUsers((prev) =>
//       prev.map((user) =>
//         user.user_id === userId
//           ? { ...user, is_banned: updated.user.is_banned }
//           : user
//       )
//     );
//   };

//   const handleDeleteUser = async (userId: number) => {
//     await deleteUser(userId);
//     setUsers((prev) => prev.filter((user) => user.user_id !== userId));
//   };

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//       user.email.toLowerCase().includes(filters.search.toLowerCase());
//     const matchesRole = !filters.role || user.role_name === filters.role;
//     const matchesStatus =
//       !filters.status ||
//       (filters.status === "active" && !user.is_banned) ||
//       (filters.status === "banned" && user.is_banned);
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const handleSelectUser = (userId: number) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedUsers(
//       selectedUsers.length === filteredUsers.length
//         ? []
//         : filteredUsers.map((u) => u.user_id)
//     );
//   };
//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case "מנהל":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "עורך":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "משתמש":
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };
//   const getProviderImage = (provider: string) => {
//     switch (provider) {
//       case "Google":
//         return googleIcon;
//       case "Facebook":
//         return facebookIcon;
//       case "Regular":
//         return "/logo-without bg.png";
//       default:
//         return "👤";
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <StatsCardsSkeleton />
//         <FiltersSkeleton />
//         <UsersTableSkeleton />
//       </>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6"
//       dir="rtl"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
//         <p className="text-gray-600 mt-1">נהל וצפה במשתמשי המערכת</p>
//       </div>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">כל המשתמשים</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {users.length}
//                 </p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <UserCheck className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">משתמשים פעילים</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   {users.filter((u) => !u.is_banned).length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <UserCheck className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">משתמשים חסומים</p>
//                 <p className="text-2xl font-bold text-red-600">
//                   {users.filter((u) => u.is_banned).length}
//                 </p>
//               </div>
//               <div className="p-3 bg-red-100 rounded-full">
//                 <UserX className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">מנהלים</p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   {users.filter((u) => u.role_name === "Admin").length}
//                 </p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-full">
//                 <UserCheck className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pb-0 mb-8">
//           <Filters
//             filters={filters}
//             setFilters={setFilters}
//             resetPage={() => {}}
//             fields={userManagementFilterFields}
//             design=" justify-around items-center !gap-0"
//           />
//         </div>

//         {/* Users Table with Grid Layout */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto w-full">
//           <div className="grid grid-cols-10 gap-4 items-center px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 border-b">
//             <input
//               type="checkbox"
//               checked={
//                 selectedUsers.length === filteredUsers.length &&
//                 filteredUsers.length > 0
//               }
//               onChange={handleSelectAll}
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <div className="col-span-2">משתמש</div>
//             <div className="col-span-1">תפקיד</div>
//             <div className="col-span-1">הרשמה</div>
//             <div className="col-span-1">מיקום</div>
//             <div className="col-span-1">סטטוס</div>
//             <div className="col-span-2">עודכן</div>
//             <div className="col-span-1">פעולות</div>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {filteredUsers.map((user) => (
//               <div
//                 key={user.user_id}
//                 className="grid grid-cols-10 gap-4 justify-items-start px-6 py-4 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="col-span-1">
//                   <input
//                     type="checkbox"
//                     checked={selectedUsers.includes(user.user_id)}
//                     onChange={() => handleSelectUser(user.user_id)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="col-span-2 flex items-center gap-3 truncate">
//                   <img
//                     src={user.profile_picture || `../assets/mo-image.svg`}
//                     alt={user.name}
//                     className="w-10 h-10 rounded-full border-2 border-gray-200 bg-cover"
//                   />
//                   <div>
//                     <h3 className="font-medium text-gray-900 truncate">
//                       {user.name}
//                     </h3>
//                     <p
//                       className="text-sm text-gray-600 truncate"
//                       title={user.email}
//                     >
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-1 text-sm text-center">
//                   <p
//                     className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
//                       user.role_name
//                     )}`}
//                   >
//                     {user.role_name}
//                   </p>
//                 </div>

//                 <div className="col-span-1 text-sm text-center">
//                   <div className="flex items-center justify-center gap-1">
//                     <img
//                       src={getProviderImage(user.auth_provider)}
//                       alt={user.auth_provider}
//                       className="w-5 h-5 object-contain"
//                     />
//                     {/* <span className="text-gray-700">{user.auth_provider}</span> */}
//                   </div>
//                 </div>

//                 <div className="col-span-1 text-sm text-right">
//                   {user.location}
//                 </div>

//                 <div className="col-span-1 text-sm text-center">
//                   <span
//                     className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
//                       user.is_banned
//                         ? "bg-red-100 text-red-800 border border-red-200"
//                         : "bg-green-100 text-green-800 border border-green-200"
//                     }`}
//                   >
//                     {user.is_banned ? (
//                       <UserX size={12} />
//                     ) : (
//                       <UserCheck size={12} />
//                     )}
//                     {user.is_banned ? "חסום" : "פעיל"}
//                   </span>
//                 </div>

//                 <div className="col-span-2 text-sm text-center">
//                   {new Date(user.updated_at).toLocaleString("he-IL")}
//                 </div>

//                 <div className="col-span-1 flex items-center gap-2 justify-end">
//                   <button
//                     onClick={() => handleBanUser(user.user_id)}
//                     className={`p-2 rounded-lg transition-colors ${
//                       user.is_banned
//                         ? "bg-green-100 text-green-600 hover:bg-green-200"
//                         : "bg-orange-100 text-orange-600 hover:bg-orange-200"
//                     }`}
//                     title={user.is_banned ? "בטל חסימה" : "חסום משתמש"}
//                   >
//                     {user.is_banned ? (
//                       <UserCheck size={16} />
//                     ) : (
//                       <Ban size={16} />
//                     )}
//                   </button>

//                   <button
//                     onClick={() => handleDeleteUser(user.user_id)}
//                     className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                     title="מחק משתמש"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUsersPage;

import { useEffect, useState } from "react";
import { UserCheck, UserX, Ban, Trash2 } from "lucide-react";
import { useUserActions } from "@/hooks/useUserActions";
import { IUser } from "@/types/type";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import googleIcon from "../assets/users-resources logo/google-icon.png";
import facebookIcon from "../assets/users-resources logo/facebook logo.png";
import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";
import FiltersSkeleton from "@/components/skelton/FiltersSkeleton";
import UsersTableSkeleton from "@/components/skelton/UsersTableSkeleton";
import { userManagementFilterFields } from "@/lib/filters/userManagementFilterFields";
import GenericTable, { Column } from "@/components/table/GenericTable";
import StatsCards from "@/components/StatsCards";

const AdminUsersPage = () => {
  const { getAllUsers, deleteUser, banUser } = useUserActions();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    role: null as string | null,
    status: null as string | null,
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleBanUser = async (userId: number) => {
    const updated = await banUser(userId);
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId
          ? { ...user, is_banned: updated.user.is_banned }
          : user
      )
    );
  };

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
    setUsers((prev) => prev.filter((user) => user.user_id !== userId));
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((u) => u.user_id)
    );
  };

  const getRoleBadgeColor = (role: string) => {
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

  const getProviderImage = (provider: string) => {
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRole = !filters.role || user.role_name === filters.role;
    const matchesStatus =
      !filters.status ||
      (filters.status === "active" && !user.is_banned) ||
      (filters.status === "banned" && user.is_banned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const manageUsersColumns: Column<IUser>[] = [
    {
      label: "",
      renderCell: (user: IUser) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.user_id)}
          onChange={() => handleSelectUser(user.user_id)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      ),
    },
    {
      label: "משתמש",
      width: "col-span-2",
      renderCell: (user: IUser) => (
        <div className="flex items-center gap-3 truncate">
          <img
            src={user.profile_picture || `/assets/mo-image.svg`}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-gray-200 bg-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: "תפקיד",
      renderCell: (user: IUser) => (
        <p
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
            user.role_name
          )}`}
        >
          {user.role_name}
        </p>
      ),
    },
    {
      label: "הרשמה",
      renderCell: (user: IUser) => (
        <div className="flex items-center justify-center">
          <img
            src={getProviderImage(user.auth_provider)}
            alt={user.auth_provider}
            className="w-5 h-5 object-contain"
          />
        </div>
      ),
    },
    {
      label: "מיקום",
      renderCell: (user: IUser) => <span>{user.location}</span>,
    },
    {
      label: "סטטוס",
      renderCell: (user: IUser) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
            user.is_banned
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {user.is_banned ? <UserX size={12} /> : <UserCheck size={12} />}
          {user.is_banned ? "חסום" : "פעיל"}
        </span>
      ),
    },
    {
      label: "עודכן",
      width: "col-span-2",
      renderCell: (user: IUser) =>
        new Date(user.updated_at).toLocaleString("he-IL"),
    },
    {
      label: "פעולות",
      renderCell: (user: IUser) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => handleBanUser(user.user_id)}
            className={`p-2 rounded-lg transition-colors ${
              user.is_banned
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            }`}
            title={user.is_banned ? "בטל חסימה" : "חסום משתמש"}
          >
            {user.is_banned ? <UserCheck size={16} /> : <Ban size={16} />}
          </button>

          <button
            onClick={() => handleDeleteUser(user.user_id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="מחק משתמש"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const manageUsersCardstats = [
    {
      label: "כל המשתמשים",
      value: users.length,
      color: "blue",
      Icon: UserCheck,
    },
    {
      label: "משתמשים פעילים",
      value: users.filter((u) => !u.is_banned).length,
      color: "green",
      Icon: UserCheck,
    },
    {
      label: "משתמשים חסומים",
      value: users.filter((u) => u.is_banned).length,
      color: "red",
      Icon: UserX,
    },
    {
      label: "מנהלים",
      value: users.filter((u) => u.role_name === "Admin").length,
      color: "purple",
      Icon: UserCheck,
    },
  ];

  if (loading) {
    return (
      <>
        <StatsCardsSkeleton />
        <FiltersSkeleton />
        <UsersTableSkeleton />
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
        <p className="text-gray-600 mt-1">נהל וצפה במשתמשי המערכת</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards items={manageUsersCardstats} />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pb-0 mb-8">
          <Filters
            filters={filters}
            setFilters={setFilters}
            resetPage={() => {}}
            fields={userManagementFilterFields}
            design=" justify-around items-center !gap-0"
          />
        </div>

        {/* Table */}
        <GenericTable
          items={filteredUsers}
          columns={manageUsersColumns}
          rowKey={(user: IUser) => user.user_id}
        />
      </div>
    </div>
  );
};

export default AdminUsersPage;

// // // import { useEffect, useState } from "react";
// // // import { useUserActions } from "@/hooks/useUserActions";
// // // import { IUser } from "@/types/type";

// // // type Column<T> = {
// // //   key: keyof T;
// // //   label: string;
// // //   render?: (val: T[keyof T]) => React.ReactNode;
// // // };

// // // const columns: Column<IUser>[] = [
// // //   { key: "name", label: "שם" },
// // //   { key: "email", label: "אימייל" },
// // //   { key: "role_name", label: "תפקיד" },
// // //   { key: "auth_provider", label: "הרשמה דרך" },
// // //   { key: "location", label: "מיקום" },
// // //   {
// // //     key: "is_banned",
// // //     label: "סטטוס",
// // //     render: (val) => ((val as boolean) ? "❌ חסום" : "✅ פעיל"),
// // //   },
// // //   {
// // //     key: "updated_at",
// // //     label: "עודכן לאחרונה",
// // //     render: (val) => typeof val === "string" ? new Date(val).toLocaleDateString() : "לא זמין",
// // //   },
// // // ];

// // // const AdminUsersPage = () => {
// // //   const { getAllUsers, deleteUser, banUser } = useUserActions();
// // //   const [users, setUsers] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchUsers = async () => {
// // //       setLoading(true);
// // //       const data = await getAllUsers();
// // //       setUsers(data);
// // //       setLoading(false);
// // //     };
// // //     fetchUsers();
// // //   }, []);

// // //   return (
// // //     <div className="p-4">
// // //       <h1 className="text-2xl font-bold mb-4">ניהול משתמשים</h1>
// // //       {loading ? (
// // //         <p>טוען...</p>
// // //       ) : (
// // //         <table className="w-full table-auto border">
// // //           <thead>
// // //             <tr>
// // //               {columns.map((col) => (
// // //                 <th key={col.key}>{col.label}</th>
// // //               ))}
// // //               <th>פעולות</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.map((user: any) => (
// // //               <tr key={user.user_id}>
// // //                 {columns.map((col) => (
// // //                   <td key={col.key}>
// // //                     {col.render ? col.render(user[col.key]) : user[col.key]}
// // //                   </td>
// // //                 ))}
// // //                 <td className="space-x-2">
// // //                   <button onClick={() => banUser(user.user_id)}>חסום</button>
// // //                   <button onClick={() => deleteUser(user.user_id)}>
// // //                     🗑️ מחק
// // //                   </button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AdminUsersPage;

// // import { useEffect, useState } from "react";
// // import {
// //   Search,
// //   Filter,
// //   MoreVertical,
// //   Ban,
// //   Trash2,
// //   UserCheck,
// //   UserX,
// //   Download,
// //   Plus,
// // } from "lucide-react";

// // // Mock data for demonstration
// // const mockUsers = [
// //   {
// //     user_id: 1,
// //     name: "אבי כהן",
// //     email: "avi@example.com",
// //     role_name: "מנהל",
// //     auth_provider: "Google",
// //     location: "תל אביב",
// //     is_banned: false,
// //     updated_at: "2024-06-15T10:30:00Z",
// //     avatar: "https://i.pravatar.cc/40?img=1",
// //   },
// //   {
// //     user_id: 2,
// //     name: "שרה לוי",
// //     email: "sarah@example.com",
// //     role_name: "עורך",
// //     auth_provider: "Facebook",
// //     location: "חיפה",
// //     is_banned: false,
// //     updated_at: "2024-06-14T14:22:00Z",
// //     avatar: "https://i.pravatar.cc/40?img=2",
// //   },
// //   {
// //     user_id: 3,
// //     name: "דוד אברהם",
// //     email: "david@example.com",
// //     role_name: "משתמש",
// //     auth_provider: "Email",
// //     location: "ירושלים",
// //     is_banned: true,
// //     updated_at: "2024-06-13T09:15:00Z",
// //     avatar: "https://i.pravatar.cc/40?img=3",
// //   },
// //   {
// //     user_id: 4,
// //     name: "מירי גולדברג",
// //     email: "miri@example.com",
// //     role_name: "עורך",
// //     auth_provider: "Google",
// //     location: "באר שבע",
// //     is_banned: false,
// //     updated_at: "2024-06-12T16:45:00Z",
// //     avatar: "https://i.pravatar.cc/40?img=4",
// //   },
// //   {
// //     user_id: 5,
// //     name: "יוסי מור",
// //     email: "yossi@example.com",
// //     role_name: "משתמש",
// //     auth_provider: "Facebook",
// //     location: "נתניה",
// //     is_banned: false,
// //     updated_at: "2024-06-11T11:20:00Z",
// //     avatar: "https://i.pravatar.cc/40?img=5",
// //   },
// // ];

// // const AdminUsersPage = () => {
// //   const [users, setUsers] = useState(mockUsers);
// //   const [loading, setLoading] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterRole, setFilterRole] = useState("all");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [selectedUsers, setSelectedUsers] = useState([]);

// //   const filteredUsers = users.filter((user) => {
// //     const matchesSearch =
// //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.email.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesRole = filterRole === "all" || user.role_name === filterRole;
// //     const matchesStatus =
// //       filterStatus === "all" ||
// //       (filterStatus === "active" && !user.is_banned) ||
// //       (filterStatus === "banned" && user.is_banned);

// //     return matchesSearch && matchesRole && matchesStatus;
// //   });

// //   const handleBanUser = (userId: number) => {
// //     setUsers(
// //       users.map((user) =>
// //         user.user_id === userId ? { ...user, is_banned: !user.is_banned } : user
// //       )
// //     );
// //   };

// //   const handleDeleteUser = (userId: number) => {
// //     setUsers(users.filter((user) => user.user_id !== userId));
// //   };

// //   const handleSelectUser = (userId: number) => {
// //     setSelectedUsers((prev) =>
// //       prev.includes(userId)
// //         ? prev.filter((id) => id !== userId)
// //         : [...prev, userId]
// //     );
// //   };

// //   const handleSelectAll = () => {
// //     if (selectedUsers.length === filteredUsers.length) {
// //       setSelectedUsers([]);
// //     } else {
// //       setSelectedUsers(filteredUsers.map((user) => user.user_id));
// //     }
// //   };

// //   const getRoleBadgeColor = (role) => {
// //     switch (role) {
// //       case "מנהל":
// //         return "bg-red-100 text-red-800 border-red-200";
// //       case "עורך":
// //         return "bg-blue-100 text-blue-800 border-blue-200";
// //       case "משתמש":
// //         return "bg-gray-100 text-gray-800 border-gray-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200";
// //     }
// //   };

// //   const getProviderIcon = (provider) => {
// //     switch (provider) {
// //       case "Google":
// //         return "🌐";
// //       case "Facebook":
// //         return "📘";
// //       case "Email":
// //         return "✉️";
// //       default:
// //         return "👤";
// //     }
// //   };

// //   return (
// //     <div
// //       className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
// //       dir="rtl"
// //     >
// //       {/* Header */}
// //       <div className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center py-6">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">
// //                 ניהול משתמשים
// //               </h1>
// //               <p className="text-gray-600 mt-1">נהל וצפה במשתמשי המערכת</p>
// //             </div>
// //             <div className="flex gap-3">
// //               <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
// //                 <Download size={18} />
// //                 ייצא נתונים
// //               </button>
// //               <button className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
// //                 <Plus size={18} />
// //                 הוסף משתמש
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-600">כל המשתמשים</p>
// //                 <p className="text-2xl font-bold text-gray-900">
// //                   {users.length}
// //                 </p>
// //               </div>
// //               <div className="p-3 bg-blue-100 rounded-full">
// //                 <UserCheck className="w-6 h-6 text-blue-600" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-600">משתמשים פעילים</p>
// //                 <p className="text-2xl font-bold text-green-600">
// //                   {users.filter((u) => !u.is_banned).length}
// //                 </p>
// //               </div>
// //               <div className="p-3 bg-green-100 rounded-full">
// //                 <UserCheck className="w-6 h-6 text-green-600" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-600">משתמשים חסומים</p>
// //                 <p className="text-2xl font-bold text-red-600">
// //                   {users.filter((u) => u.is_banned).length}
// //                 </p>
// //               </div>
// //               <div className="p-3 bg-red-100 rounded-full">
// //                 <UserX className="w-6 h-6 text-red-600" />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-600">מנהלים</p>
// //                 <p className="text-2xl font-bold text-purple-600">
// //                   {users.filter((u) => u.role_name === "מנהל").length}
// //                 </p>
// //               </div>
// //               <div className="p-3 bg-purple-100 rounded-full">
// //                 <UserCheck className="w-6 h-6 text-purple-600" />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters and Search */}
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
// //           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
// //             <div className="flex-1 relative">
// //               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //               <input
// //                 type="text"
// //                 placeholder="חפש לפי שם או אימייל..."
// //                 className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>

// //             <div className="flex gap-3">
// //               <select
// //                 className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 value={filterRole}
// //                 onChange={(e) => setFilterRole(e.target.value)}
// //               >
// //                 <option value="all">כל התפקידים</option>
// //                 <option value="מנהל">מנהל</option>
// //                 <option value="עורך">עורך</option>
// //                 <option value="משתמש">משתמש</option>
// //               </select>

// //               <select
// //                 className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 value={filterStatus}
// //                 onChange={(e) => setFilterStatus(e.target.value)}
// //               >
// //                 <option value="all">כל הסטטוסים</option>
// //                 <option value="active">פעיל</option>
// //                 <option value="banned">חסום</option>
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Users Table */}
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
// //           {loading ? (
// //             <div className="flex justify-center items-center py-12">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //               <span className="mr-3 text-gray-600">טוען...</span>
// //             </div>
// //           ) : (
// //             <>
// //               {/* Table Header */}
// //               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex items-center gap-3">
// //                     <input
// //                       type="checkbox"
// //                       checked={
// //                         selectedUsers.length === filteredUsers.length &&
// //                         filteredUsers.length > 0
// //                       }
// //                       onChange={handleSelectAll}
// //                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                     />
// //                     <span className="text-sm text-gray-600">
// //                       {selectedUsers.length > 0 &&
// //                         `${selectedUsers.length} נבחרו`}
// //                     </span>
// //                   </div>
// //                   <span className="text-sm text-gray-600">
// //                     {filteredUsers.length} משתמשים נמצאו
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* Table Body */}
// //               <div className="divide-y divide-gray-200">
// //                 {filteredUsers.map((user) => (
// //                   <div
// //                     key={user.user_id}
// //                     className="px-6 py-4 hover:bg-gray-50 transition-colors"
// //                   >
// //                     <div className="flex items-center justify-between">
// //                       <div className="flex items-center gap-4">
// //                         <input
// //                           type="checkbox"
// //                           checked={selectedUsers.includes(user.user_id)}
// //                           onChange={() => handleSelectUser(user.user_id)}
// //                           className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                         />

// //                         <div className="flex items-center gap-3">
// //                           <img
// //                             src={user.avatar}
// //                             alt={user.name}
// //                             className="w-10 h-10 rounded-full border-2 border-gray-200"
// //                           />
// //                           <div>
// //                             <h3 className="font-medium text-gray-900">
// //                               {user.name}
// //                             </h3>
// //                             <p className="text-sm text-gray-600">
// //                               {user.email}
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="flex items-center gap-6">
// //                         <div className="text-center">
// //                           <p className="text-sm text-gray-500">תפקיד</p>
// //                           <span
// //                             className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
// //                               user.role_name
// //                             )}`}
// //                           >
// //                             {user.role_name}
// //                           </span>
// //                         </div>

// //                         <div className="text-center">
// //                           <p className="text-sm text-gray-500">הרשמה</p>
// //                           <div className="flex items-center gap-1">
// //                             <span className="text-sm">
// //                               {getProviderIcon(user.auth_provider)}
// //                             </span>
// //                             <span className="text-sm text-gray-700">
// //                               {user.auth_provider}
// //                             </span>
// //                           </div>
// //                         </div>

// //                         <div className="text-center">
// //                           <p className="text-sm text-gray-500">מיקום</p>
// //                           <p className="text-sm text-gray-700">
// //                             {user.location}
// //                           </p>
// //                         </div>

// //                         <div className="text-center">
// //                           <p className="text-sm text-gray-500">סטטוס</p>
// //                           <span
// //                             className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
// //                               user.is_banned
// //                                 ? "bg-red-100 text-red-800 border border-red-200"
// //                                 : "bg-green-100 text-green-800 border border-green-200"
// //                             }`}
// //                           >
// //                             {user.is_banned ? (
// //                               <UserX size={12} />
// //                             ) : (
// //                               <UserCheck size={12} />
// //                             )}
// //                             {user.is_banned ? "חסום" : "פעיל"}
// //                           </span>
// //                         </div>

// //                         <div className="text-center">
// //                           <p className="text-sm text-gray-500">עודכן</p>
// //                           <p className="text-sm text-gray-700">
// //                             {new Date(user.updated_at).toLocaleDateString(
// //                               "he-IL"
// //                             )}
// //                           </p>
// //                         </div>

// //                         <div className="flex items-center gap-2">
// //                           <button
// //                             onClick={() => handleBanUser(user.user_id)}
// //                             className={`p-2 rounded-lg transition-colors ${
// //                               user.is_banned
// //                                 ? "bg-green-100 text-green-600 hover:bg-green-200"
// //                                 : "bg-orange-100 text-orange-600 hover:bg-orange-200"
// //                             }`}
// //                             title={user.is_banned ? "בטל חסימה" : "חסום משתמש"}
// //                           >
// //                             {user.is_banned ? (
// //                               <UserCheck size={16} />
// //                             ) : (
// //                               <Ban size={16} />
// //                             )}
// //                           </button>

// //                           <button
// //                             onClick={() => handleDeleteUser(user.user_id)}
// //                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
// //                             title="מחק משתמש"
// //                           >
// //                             <Trash2 size={16} />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {filteredUsers.length === 0 && (
// //                 <div className="text-center py-12">
// //                   <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// //                   <h3 className="text-lg font-medium text-gray-900 mb-2">
// //                     לא נמצאו משתמשים
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     נסה להתאים את החיפוש או המסננים שלך
// //                   </p>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>

// //         {/* Bulk Actions */}
// //         {selectedUsers.length > 0 && (
// //           <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm font-medium text-gray-700">
// //                 {selectedUsers.length} משתמשים נבחרו
// //               </span>
// //               <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
// //                 חסום הכל
// //               </button>
// //               <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
// //                 מחק הכל
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// export default AdminUsersPage;

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Plus,
  UserCheck,
  UserX,
  Ban,
  Trash2,
} from "lucide-react";
import { useUserActions } from "@/hooks/useUserActions";
import { IUser } from "@/types/type";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

const AdminUsersPage = () => {
  const { getAllUsers, deleteUser, banUser } = useUserActions();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    role: "all",
    status: "all",
  });

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
    await banUser(userId);
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, is_banned: !user.is_banned } : user
      )
    );
  };

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
    setUsers((prev) => prev.filter((user) => user.user_id !== userId));
  };

  //   const filteredUsers = users.filter((user) => {
  //     const matchesSearch =
  //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesRole = filterRole === "all" || user.role_name === filterRole;
  //     const matchesStatus =
  //       filterStatus === "all" ||
  //       (filterStatus === "active" && !user.is_banned) ||
  //       (filterStatus === "banned" && user.is_banned);
  //     return matchesSearch && matchesRole && matchesStatus;
  //   });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesRole =
      filters.role === "all" || user.role_name === filters.role;

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && !user.is_banned) ||
      (filters.status === "banned" && user.is_banned);

    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "Google":
        return "🌐";
      case "Facebook":
        return "📘";
      case "Regular":
        return "✉️";
      default:
        return "👤";
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
        <p className="text-gray-600 mt-1">נהל וצפה במשתמשי המערכת</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">כל המשתמשים</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">משתמשים פעילים</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => !u.is_banned).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">משתמשים חסומים</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.is_banned).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">מנהלים</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role_name === "Admin").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש לפי שם או אימייל..."
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">כל התפקידים</option>
                <option value="Admin">מנהל</option>
                <option value="User">משתמש</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="banned">חסום</option>
              </select>
            </div>
          </div>
        </div>


        {/* Users Table with Grid Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto w-full">
          <div className="grid grid-cols-10 gap-4 items-center px-6 py-4 text-sm font-medium text-gray-600 bg-gray-50 border-b">
            <input
              type="checkbox"
              checked={
                selectedUsers.length === filteredUsers.length &&
                filteredUsers.length > 0
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="col-span-1">בחר</div>
            <div className="col-span-2">משתמש</div>
            <div className="col-span-1">תפקיד</div>
            <div className="col-span-1">הרשמה</div>
            <div className="col-span-1">מיקום</div>
            <div className="col-span-1">סטטוס</div>
            <div className="col-span-1">עודכן</div>
            <div className="col-span-1">פעולות</div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="grid grid-cols-9 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={() => handleSelectUser(user.user_id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3 truncate">
                  <img
                    src={user.profile_picture || `../assets/mo-image.svg`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 bg-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 text-sm text-center">
                  <p
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                      user.role_name
                    )}`}
                  >
                    {user.role_name}
                  </p>
                </div>

                <div className="col-span-1 text-sm text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{getProviderIcon(user.auth_provider)}</span>
                    <span className="text-gray-700">{user.auth_provider}</span>
                  </div>
                </div>

                <div className="col-span-1 text-sm text-center">
                  {user.location}
                </div>

                <div className="col-span-1 text-sm text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_banned
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {user.is_banned ? (
                      <UserX size={12} />
                    ) : (
                      <UserCheck size={12} />
                    )}
                    {user.is_banned ? "חסום" : "פעיל"}
                  </span>
                </div>

                <div className="col-span-1 text-sm text-center">
                  {new Date(user.updated_at).toLocaleDateString("he-IL")}
                </div>

                <div className="col-span-1 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleBanUser(user.user_id)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.is_banned
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    }`}
                    title={user.is_banned ? "בטל חסימה" : "חסום משתמש"}
                  >
                    {user.is_banned ? (
                      <UserCheck size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.user_id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="מחק משתמש"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;



// // ✅ קובץ AdminUsersPage.tsx לאחר שילוב קומפוננטת Filters ותיקון בעיית הסינון

// import { useEffect, useState } from "react";
// import { UserCheck, UserX, Ban, Trash2 } from "lucide-react";
// import { useUserActions } from "@/hooks/useUserActions";
// import { IUser } from "@/types/type";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { FilterField, Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";

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
//     await banUser(userId);
//     setUsers((prev) =>
//       prev.map((user) =>
//         user.user_id === userId ? { ...user, is_banned: !user.is_banned } : user
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
//     const getRoleBadgeColor = (role: string) => {
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
//     const getProviderIcon = (provider: string) => {
//     switch (provider) {
//       case "Google":
//         return "🌐";
//       case "Facebook":
//         return "📘";
//       case "Regular":
//         return "✉️";
//       default:
//         return "👤";
//     }
//   };

//   const filterFields: FilterField[] = [
//     {
//       key: "search",
//       type: "input",
//       placeholder: "חפש לפי שם או אימייל...",
//     },
//     {
//       key: "role",
//       type: "select",
//       placeholder: "כל התפקידים",
//       options: [
//         { label: "מנהל", value: "Admin" },
//         { label: "משתמש", value: "User" },
//       ],
//     },
//     {
//       key: "status",
//       type: "select",
//       placeholder: "כל הסטטוסים",
//       options: [
//         { label: "פעיל", value: "active" },
//         { label: "חסום", value: "banned" },
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
//         <p className="text-gray-600 mt-1">נהל וצפה במשתמשי המערכת</p>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Filters filters={filters} setFilters={setFilters} resetPage={() => {}} fields={filterFields} />


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
//             <div className="col-span-1">בחר</div>
//             <div className="col-span-2">משתמש</div>
//             <div className="col-span-1">תפקיד</div>
//             <div className="col-span-1">הרשמה</div>
//             <div className="col-span-1">מיקום</div>
//             <div className="col-span-1">סטטוס</div>
//             <div className="col-span-1">עודכן</div>
//             <div className="col-span-1">פעולות</div>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {filteredUsers.map((user) => (
//               <div
//                 key={user.user_id}
//                 className="grid grid-cols-9 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
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
//                     <span>{getProviderIcon(user.auth_provider)}</span>
//                     <span className="text-gray-700">{user.auth_provider}</span>
//                   </div>
//                 </div>

//                 <div className="col-span-1 text-sm text-center">
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

//                 <div className="col-span-1 text-sm text-center">
//                   {new Date(user.updated_at).toLocaleDateString("he-IL")}
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

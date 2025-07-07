import { useEffect, useState } from "react";
import { useUserActions } from "@/hooks/useUserActions";
import { IUser } from "@/types/type";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import StatsCardsSkeleton from "@/components/skelton/StatsCardsSkeleton";
import FiltersSkeleton from "@/components/skelton/FiltersSkeleton";
import UsersTableSkeleton from "@/components/skelton/UsersTableSkeleton";
import { userManagementFilterFields } from "@/lib/filters/userManagementFilterFields";
import GenericTable from "@/components/table/GenericTable";
import StatsCards from "@/components/StatsCards";
import { UserCheck, UserX, UsersRound, Shield } from "lucide-react";
import AppDialog from "@/components/AppDialog";
import { getUsersTableColumns } from "@/components/adminUsers/UsersTableColumns";
import UsersBulkActions from "@/components/adminUsers/UsersBulkActions";

const AdminUsersPage = () => {
  const {
    getAllUsers,
    deleteUser,
    banUser,
    deleteUsers,
    banUsers,
    updateUserRole,
  } = useUserActions();
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
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

  const handleBulkDelete = async () => {
    await deleteUsers(selectedUsers);
    setUsers((prev) =>
      prev.filter((user) => !selectedUsers.includes(user.user_id))
    );
    setSelectedUsers([]);
  };

  const handleBulkBanToggle = async () => {
    const result = await banUsers(selectedUsers);
    if (result) {
      setUsers((prev) =>
        prev.map((user) => {
          const match =
            result.banned.includes(user.user_id) ||
            result.unbanned.includes(user.user_id);
          return match ? { ...user, is_banned: !user.is_banned } : user;
        })
      );
      setSelectedUsers([]);
    }
  };

  const handleChangeRole = async (userId: number, newRoleName: string) => {
    const newRoleId = newRoleName === "Admin" ? 3 : 2;
    await updateUserRole(userId, newRoleId);
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === userId
          ? { ...u, role_name: newRoleName as "User" | "Admin" }
          : u
      )
    );
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

  const manageUsersCardstats = [
    {
      label: "כל המשתמשים",
      value: users.length,
      color: "blue",
      Icon: UsersRound,
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
      Icon: Shield,
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
        <StatsCards items={manageUsersCardstats}/>

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

        {selectedUsers.length > 0 && (
          <UsersBulkActions
            selectedUsers={selectedUsers}
            handleBulkBanToggle={handleBulkBanToggle}
            handleBulkDelete={handleBulkDelete}
          />
        )}

        {/* Table */}
        <GenericTable
          items={filteredUsers}
          columns={getUsersTableColumns({
            selectedUsers,
            handleSelectUser,
            handleBanUser,
            handleDeleteUser: (user) => setUserToDelete(user),
            handleChangeRole,
          })}
          rowKey={(user) => user.user_id}
        />
      </div>
      <AppDialog
        open={!!userToDelete}
        title="מחיקת משתמש"
        description={
          userToDelete && (
            <>
              האם את/ה בטוח/ה שברצונך למחוק את{" "}
              <strong>{userToDelete.name}</strong>?<br />
              פעולה זו אינה ניתנת לשחזור.
            </>
          )
        }
        confirmText="מחק"
        cancelText="בטל"
        confirmVariant="destructive"
        loading={isDeleting}
        onCancel={() => setUserToDelete(null)}
        onConfirm={async () => {
          if (!userToDelete) return;
          setIsDeleting(true);
          await handleDeleteUser(userToDelete.user_id);
          setIsDeleting(false);
          setUserToDelete(null);
        }}
      />

      <AppDialog
        open={showBulkDeleteDialog}
        title="מחיקת משתמשים"
        description={
          <>
            האם את/ה בטוח/ה שברצונך למחוק{" "}
            <strong>{selectedUsers.length}</strong> משתמשים?
            <br />
            פעולה זו אינה ניתנת לשחזור.
          </>
        }
        confirmText="מחק"
        cancelText="בטל"
        confirmVariant="destructive"
        loading={isDeleting}
        onCancel={() => setShowBulkDeleteDialog(false)}
        onConfirm={async () => {
          setIsDeleting(true);
          await handleBulkDelete();
          setIsDeleting(false);
          setShowBulkDeleteDialog(false);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;

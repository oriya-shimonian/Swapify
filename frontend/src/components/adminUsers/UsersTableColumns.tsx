import { Column } from "@/components/table/GenericTable";
import { IUser } from "@/types/type";
import { UserCheck, UserX, Ban, Trash2 } from "lucide-react";
import { getProviderImage } from "@/utils/manageUserUtils";

interface UsersTableColumnsParams {
  selectedUsers: number[];
  handleSelectUser: (userId: number) => void;
  handleBanUser: (userId: number) => void;
  handleDeleteUser: (user: IUser) => void;
  handleChangeRole: (userId: number, newRole: "User" | "Admin") => void;
}

export const getUsersTableColumns = ({
  selectedUsers,
  handleSelectUser,
  handleBanUser,
  handleDeleteUser,
  handleChangeRole,
}: UsersTableColumnsParams): Column<IUser>[] => [
  {
    label: "",
    renderCell: (user) => (
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
    renderCell: (user) => (
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
    renderCell: (user) => (
      <select
        value={user.role_name}
        onChange={(e) =>
          handleChangeRole(user.user_id, e.target.value as "User" | "Admin")
        }
        className="bg-transparent text-xs font-medium"
      >
        <option value="User">משתמש</option>
        <option value="Admin">מנהל</option>
      </select>
    ),
  },
  {
    label: "הרשמה",
    renderCell: (user) => (
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
    renderCell: (user) => <span>{user.location}</span>,
  },
  {
    label: "סטטוס",
    renderCell: (user) => (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
          user.is_banned
            ? "bg-red-100 text-red-800 border border-red-200"
            : "bg-green-100 text-green-800 border-green-200 border"
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
    renderCell: (user) =>
      new Date(user.updated_at).toLocaleString("he-IL"),
  },
  {
    label: "פעולות",
    renderCell: (user) => (
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
          onClick={() => handleDeleteUser(user)}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          title="מחק משתמש"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];

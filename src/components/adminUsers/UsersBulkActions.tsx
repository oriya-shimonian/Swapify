import { useState } from "react";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/AppDialog";

interface UsersBulkActionsProps {
  selectedUsers: number[];
  handleBulkBanToggle: () => Promise<void>;
  handleBulkDelete: () => Promise<void>;
}

export default function UsersBulkActions({
  selectedUsers,
  handleBulkBanToggle,
  handleBulkDelete,
}: UsersBulkActionsProps) {
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  if (selectedUsers.length === 0) return null;

  return (
    <>
      <div className="flex gap-4 justify-end mb-4">
        <Button
          onClick={handleBulkBanToggle}
          className="bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          חסום/שחרר נבחרים
        </Button>
        <Button
          onClick={() => setShowBulkDeleteDialog(true)}
          className="bg-red-100 text-red-800 hover:bg-red-200"
        >
          מחק נבחרים
        </Button>
      </div>

      <AppDialog
        open={showBulkDeleteDialog}
        title="מחיקת משתמשים"
        description={
          <>
            האם את/ה בטוח/ה שברצונך למחוק <strong>{selectedUsers.length}</strong> משתמשים?
            <br />
            פעולה זו אינה ניתנת לשחזור.
          </>
        }
        confirmText="מחק"
        cancelText="בטל"
        confirmVariant="destructive"
        loading={loading}
        onCancel={() => setShowBulkDeleteDialog(false)}
        onConfirm={async () => {
          setLoading(true);
          await handleBulkDelete();
          setLoading(false);
          setShowBulkDeleteDialog(false);
        }}
      />
    </>
  );
}

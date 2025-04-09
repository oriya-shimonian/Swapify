import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAboutSections } from "@/hooks/useAboutSections";
import AppDialog from "@/components/AppDialog";

export default function AboutPage() {
  const { user } = useAuth();
  const isAdmin = user?.role_name === "Admin";

  const {
    sections,
    editingSection,
    newSection,
    loading,
    setEditingSection,
    handleChange,
    createSection,
    updateSection,
    deleteSection,
  } = useAboutSections();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<null | number>(null);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 mt-[4.5rem]">
      <h1 className="text-3xl font-bold text-center dark:text-white">על Swapify</h1> {/* 🔄 */}

      {isAdmin && (
        <div className="text-right">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
          >
            ➕ הוספת חלק חדש
          </button>
        </div>
      )}

      {Array.isArray(sections) &&
        sections.map((section) => (
          <div
            key={section.section_id}
            className="border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700" // 🔄
          >
            {editingSection?.section_id === section.section_id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editingSection.title || ""}
                  onChange={(e) => handleChange(e)}
                  placeholder="כותרת"
                  className="w-full p-2 mb-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-600" // 🔄
                />
                <textarea
                  name="content"
                  value={editingSection.content || ""}
                  onChange={(e) => handleChange(e)}
                  placeholder="תוכן"
                  className="w-full p-2 mb-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-600" // 🔄
                />
                <div className="flex gap-2">
                  <button
                    onClick={updateSection}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                  >
                    שמירה
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="bg-gray-300 px-4 py-1 rounded dark:bg-gray-600 dark:text-white hover:bg-gray-400 transition" // 🔄
                  >
                    ביטול
                  </button>
                </div>
              </>
            ) : (
              <>
                {section.title && (
                  <h2 className="text-xl font-semibold dark:text-white"> {/* 🔄 */}
                    {section.title}
                  </h2>
                )}
                {section.content && (
                  <p className="text-gray-700 whitespace-pre-wrap dark:text-gray-300"> {/* 🔄 */}
                    {section.content}
                  </p>
                )}
                {isAdmin && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      ✏️ עריכה
                    </button>
                    <button
                      onClick={() => setDeleteDialog(section.section_id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      🗑️ מחיקה
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

      {/* הוספה */}
      <AppDialog
        open={isAddDialogOpen}
        title="הוספת חלק חדש"
        confirmText="שמירה"
        onConfirm={() => {
          createSection();
          setIsAddDialogOpen(false);
        }}
        onCancel={() => setIsAddDialogOpen(false)}
        loading={loading}
      >
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            value={newSection.title}
            onChange={(e) => handleChange(e, true)}
            placeholder="כותרת"
            className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-600" // 🔄
          />
          <textarea
            name="content"
            value={newSection.content}
            onChange={(e) => handleChange(e, true)}
            placeholder="תוכן"
            className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-600" // 🔄
          />
        </div>
      </AppDialog>

      {/* מחיקה */}
      <AppDialog
        open={deleteDialog !== null}
        title="אישור מחיקה"
        description="האם ברצונך למחוק את החלק הזה מהעמוד? פעולה זו אינה ניתנת לביטול."
        confirmText="מחק"
        confirmVariant="destructive"
        cancelText="ביטול"
        onCancel={() => setDeleteDialog(null)}
        onConfirm={async () => {
          if (deleteDialog !== null) {
            await deleteSection(deleteDialog);
            setDeleteDialog(null);
          }
        }}
        loading={loading}
      />
    </div>
  );
}

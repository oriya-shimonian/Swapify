import { useState } from "react";
import { useMeetingOptions } from "@/hooks/useMeetingOptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { MeetingOption } from "@/types/chat";

export default function MeetingOptionsAdminPage() {
  const {
    options,
    loading,
    createOption,
    updateOption,
    deleteOption,
  } = useMeetingOptions();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<MeetingOption | null>(null);

  const [form, setForm] = useState({
    city: "",
    location_name: "",
    hour: "",
    is_active: true,
  });

  const resetForm = () => {
    setForm({ city: "", location_name: "", hour: "", is_active: true });
    setSelected(null);
    setEditMode(false);
  };

  const handleSubmit = async () => {
    if (editMode && selected) {
      await updateOption(selected.id, form);
    } else {
      await createOption(form);
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (opt: MeetingOption) => {
    setSelected(opt);
    setForm(opt);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-[4.5rem]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">ניהול מיקומי החלפה</h1>
        <Button onClick={() => setOpen(true)}>הוסף מיקום</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-2">עיר</th>
              <th className="p-2">מקום</th>
              <th className="p-2">שעה</th>
              <th className="p-2">פעיל</th>
              <th className="p-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => (
              <tr key={opt.id} className="border-t">
                <td className="p-2">{opt.city}</td>
                <td className="p-2">{opt.location_name}</td>
                <td className="p-2">{opt.hour}</td>
                <td className="p-2">{opt.is_active ? "כן" : "לא"}</td>
                <td className="p-2 space-x-2 rtl:space-x-reverse">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(opt)}>
                    ערוך
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteOption(opt.id)}
                  >
                    מחק
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent>
          <DialogHeader>{editMode ? "עריכת מיקום" : "הוספת מיקום חדש"}</DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>עיר</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <Label>שם המקום</Label>
              <Input
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
              />
            </div>
            <div>
              <Label>שעה (בפורמט 14:30)</Label>
              <Input
                type="time"
                value={form.hour}
                onChange={(e) => setForm({ ...form, hour: e.target.value })}
              />
            </div>
            <div>
              <Label>פעיל</Label>
              <select
                className="w-full rounded border p-2"
                value={form.is_active ? "true" : "false"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
              >
                <option value="true">כן</option>
                <option value="false">לא</option>
              </select>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {editMode ? "שמור שינויים" : "הוסף מיקום"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

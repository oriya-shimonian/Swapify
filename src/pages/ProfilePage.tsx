import React, { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MdImageNotSupported } from "react-icons/md";
import { useUserActions } from "@/hooks/useUserActions";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import LocationPicker from "@/components/LocationPicker";
import LocationBubbles from "@/components/LocationBubbles";

interface Errors {
  [key: string]: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser, loading } = useUserActions();
  const [form, setForm] = useState({
    username: user!.name,
    email: user!.email,
    profileImage: user!.profile_picture,
    notifications: user!.notification_enabled,
    locations: user!.location.split(", "),
  });
  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: string): void => {
    const newErrors = { ...errors };
    switch (name) {
      case "username":
        if (!value) newErrors.username = "שם משתמש נדרש";
        else delete newErrors.username;
        break;
      case "email":
        if (!value) newErrors.email = "אימייל נדרש";
        else if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = "אימייל לא תקין";
        else delete newErrors.email;
        break;
    }
    setErrors(newErrors);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (value.length >= 3 || value.length === 0) {
      validateField(name, value);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || form.locations.length === 0) {
      setErrors({
        ...(form.username ? {} : { username: "שם משתמש נדרש" }),
        ...(form.email ? {} : { email: "אימייל נדרש" }),
        ...(form.locations.length > 0 ? {} : { locations: "מיקום נדרש" }),
      });
      return;
    }

    try {
      // await updateUser(form);
      // await checkAuth();
      // toast.success("הפרופיל עודכן בהצלחה");
      // setIsEditing(false);
    } catch (error) {
      // toast.error("אירעה שגיאה בעדכון הפרופיל");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl p-8"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-3">
          {form.username} הפרופיל של
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-600"
        >
          {isEditing ? <TiArrowBackOutline size={20} /> : <FaEdit size={20} />}
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-red-500 text-sm min-h-6">
                {errors.locations && `* ${errors.locations}`}
              </label>
              <p>מיקומים מועדפים להחלפה בישראל:</p>
              {!isEditing ? (
                <LocationBubbles locations={form.locations} />
              ) : (
                <LocationPicker
                  selectedLocations={form.locations}
                  onChange={(locations) => {
                    setForm((prev) => ({ ...prev, locations }));
                    setErrors((prev) => ({ ...prev, locations: "" }));
                  }}
                  error={errors.locations}
                />
              )}
            </div>

            <div>
              <div className="flex justify-center mb-3">
                <div className="relative">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-fit border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MdImageNotSupported className="text-gray-500 text-3xl" />
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
                      >
                        <FaCamera />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <label className="block text-red-500 text-sm min-h-6">
                {errors.username && `* ${errors.username}`}
              </label>
              {!isEditing ? (
                <p>{form.username} :שם משתמש</p>
              ) : (
                <Input
                  type="text"
                  name="username"
                  placeholder="שם משתמש"
                  value={form.username}
                  onChange={handleInputChange}
                  className={`w-full dark:bg-white dark:text-black ${
                    errors.username && "border border-red-500"
                  }`}
                />
              )}

              <label className="block text-red-500 text-sm min-h-6">
                {errors.email && `* ${errors.email}`}
              </label>
              {!isEditing ? (
                <p>{form.email} :מייל</p>
              ) : (
                <Input
                  type="email"
                  name="email"
                  placeholder="אימייל"
                  value={form.email}
                  onChange={handleInputChange}
                  className={`w-full dark:bg-white dark:text-black ${
                    errors.email && "border border-red-500"
                  }`}
                />
              )}

              <div className="flex items-center justify-between my-3">
                <Switch
                  checked={form.notifications}
                  onCheckedChange={(val) =>
                    setForm((prev) => ({ ...prev, notifications: val }))
                  }
                  disabled={!isEditing}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  קבלת התראות
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity ${
                loading && "loading-dots"
              }`}
            >
              {loading ? "נרשם..." : "שמור שינויים"}
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
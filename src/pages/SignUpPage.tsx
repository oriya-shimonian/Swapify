import React, { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaTimes } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MdImageNotSupported } from "react-icons/md";
import { useUserActions } from "@/hooks/useUserActions";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LocationPicker from "@/components/LocationPicker";

interface Errors {
  [key: string]: string;
}

export default function SignupPage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createUser, loading } = useUserActions();

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
      case "password":
        if (!value) newErrors.password = "סיסמה נדרשת";
        else if (!/^[a-zA-Z0-9]{6,12}$/.test(value))
          newErrors.password = "6-12 תווים, אותיות ומספרים בלבד";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "אישור סיסמה נדרש";
        else if (value !== password)
          newErrors.confirmPassword = "הסיסמאות אינן תואמות";
        else delete newErrors.confirmPassword;
        break;
    }
    setErrors(newErrors);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
    if (value.length >= 3 || value.length === 0) {
      validateField(name, value);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      locations.length === 0
    ) {
      setErrors({
        ...errors,
        ...(username ? {} : { username: "שם משתמש נדרש" }),
        ...(email ? {} : { email: "אימייל נדרש" }),
        ...(password ? {} : { password: "סיסמה נדרשת" }),
        ...(confirmPassword ? {} : { confirmPassword: "אישור סיסמה נדרש" }),
        ...(locations.length > 0 ? {} : { locations: "מיקום נדרש" }),
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: "הסיסמאות אינן תואמות" });
      return;
    }

    try {
      await createUser(username, email, password, notifications, locations);
      await checkAuth();
      navigate("/all-products");
    } catch (error) {
      console.log(error, "Error creating");

      // Handle error if needed
    }
  };

  return (
    <div className="min-h-screen sm:overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-auto">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl p-6 mt-14"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-3">
          הרשמה
        </h2>

        <div className="flex justify-center mb-3">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-fit border-4 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <MdImageNotSupported className="text-gray-500 text-3xl" />
              </div>
            )}
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
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <FaCamera />
            </button>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-2">
          <div>
            <label
              className="block text-red-500 text-sm min-h-6 "
              
            >
              {errors.username && `* ${errors.username}`}
            </label>
            <Input
              type="text"
              name="username"
              placeholder="שם משתמש"
              value={username}
              onChange={handleInputChange}
              className={`w-full dark:bg-white ${
                errors.username && "border border-red-500"
              }`}
              
            />
          </div>
          <div>
            <label
              className="block text-red-500 text-sm min-h-6 "
              
            >
              {errors.email && `* ${errors.email}`}
            </label>
            <Input
              type="email"
              name="email"
              placeholder="אימייל"
              value={email}
              onChange={handleInputChange}
              className={`w-full dark:bg-white ${
                errors.email && "border border-red-500"
              }`}
              
            />
          </div>

          <div>
            <label
              className="block text-red-500 text-sm min-h-6 "
              
            >
              {errors.password && `* ${errors.password}`}
            </label>
            <Input
              type="password"
              name="password"
              placeholder="סיסמה"
              value={password}
              onChange={handleInputChange}
              className={`w-full dark:bg-white ${
                errors.password && "border border-red-500"
              }`}
              
            />
          </div>

          <div>
            <label
              className="block text-red-500 text-sm min-h-6 "
              
            >
              {errors.confirmPassword && `* ${errors.confirmPassword}`}
            </label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="אישור סיסמה"
              value={confirmPassword}
              onChange={handleInputChange}
              className={`w-full dark:bg-white ${
                errors.confirmPassword && "border border-red-500"
              }`}
              
            />
          </div>

          <div className="flex items-center justify-between">
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <span className="text-gray-700 dark:text-gray-300">
              קבלת התראות
            </span>
          </div>

          <LocationPicker
            selectedLocations={locations}
            onChange={(newLocations) => {
              setLocations(newLocations);
              setErrors({ ...errors, locations: "" });
            }}
            error={errors.locations}
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity ${
              loading && "loading-dots"
            }`}
          >
            {loading ? "נרשם..." : "הרשמה"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

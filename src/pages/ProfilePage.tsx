// import React, { useState } from 'react';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { Calendar, Edit, Save, X, Camera, Moon, Sun } from 'lucide-react';
// import { IUser } from '@/types/type';
// import { useAuth } from '@/context/AuthContext';

// const ProfilePage = () => {
//   const { user } = useAuth();
//   // State for user data and edit mode
//   const [userData, setUserData] = useState<IUser>(user!);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState<Partial<IUser>>({});
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Handle edits
//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedData({
//       name: userData.name,
//       email: userData.email,
//       location: userData.location,
//       notification_enabled: userData.notification_enabled
//     });
//   };

//   // Handle save
//   const handleSave = () => {
//     setUserData({ ...userData, ...editedData });
//     setIsEditing(false);
//     setEditedData({});
//   };

//   // Handle cancel
//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedData({});
//   };

//   // Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedData({ ...editedData, [name]: value });
//   };

//   // Handle switch toggle
//   const handleSwitchToggle = () => {
//     setEditedData({
//       ...editedData,
//       notification_enabled: !editedData.notification_enabled
//     });
//   };

//   // Toggle dark/light mode
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>

//       {/* Gradient divider */}
//       <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

//       {/* Main content */}
//       <div className="max-w-3xl mx-auto py-8 px-4">
//         <div className={`rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
//           {/* Header with title */}
//           <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-white">User Profile</h1>
//             {!isEditing ? (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="text-white border-white hover:bg-white hover:text-blue-600"
//                 onClick={handleEdit}
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit Profile
//               </Button>
//             ) : (
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-white border-white hover:bg-white hover:text-green-600"
//                   onClick={handleSave}
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   Save
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-white border-white hover:bg-white hover:text-red-600"
//                   onClick={handleCancel}
//                 >
//                   <X className="h-4 w-4 mr-2" />
//                   Cancel
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Profile content */}
//           <div className="p-6">
//             <div className="flex items-start">
//               {/* Avatar */}
//               <div className="mr-6">
//                 <div className="relative">
//                   <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold overflow-hidden border-4 border-white">
//                     {userData.profile_picture ? (
//                       <img
//                         src={userData.profile_picture}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       userData.name.split(' ').map(n => n[0]).join('')
//                     )}
//                   </div>
//                   <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition">
//                     <Camera className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* User details */}
//               <div className="flex-1">
//                 {isEditing ? (
//                   <div className="space-y-4">
//                     <div>
//                       <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={editedData.name || ''}
//                         onChange={handleInputChange}
//                         className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border`}
//                       />
//                     </div>

//                     <div>
//                       <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={editedData.email || ''}
//                         onChange={handleInputChange}
//                         className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border`}
//                       />
//                     </div>

//                     <div>
//                       <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Location</label>
//                       <input
//                         type="text"
//                         name="location"
//                         value={editedData.location || ''}
//                         onChange={handleInputChange}
//                         className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border`}
//                       />
//                     </div>

//                     <div className="flex items-center">
//                       <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mr-3`}>Enable Notifications</label>
//                       <Switch
//                         checked={editedData.notification_enabled !== undefined ? editedData.notification_enabled : userData.notification_enabled}
//                         onCheckedChange={handleSwitchToggle}
//                         className="data-[state=checked]:bg-blue-500"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{userData.name}</h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
//                         <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.email}</p>
//                       </div>

//                       <div>
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
//                         <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.location}</p>
//                       </div>

//                       <div>
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Authentication</p>
//                         <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.auth_provider}</p>
//                       </div>

//                       <div>
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role</p>
//                         <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.role_name}</p>
//                       </div>

//                       <div className="flex items-center">
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`}>Notifications</p>
//                         <Switch
//                           checked={userData.notification_enabled}
//                           disabled
//                           className="data-[state=checked]:bg-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Status</p>
//                         <p className={`font-medium ${userData.is_banned ? 'text-red-500' : 'text-green-500'}`}>
//                           {userData.is_banned ? 'Banned' : 'Active'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Account information section */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Information</h3>

//               <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center">
//                     <Calendar className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                     <div>
//                       <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</p>
//                       <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{formatDate(userData.created_at)}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center">
//                     <Calendar className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                     <div>
//                       <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated</p>
//                       <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{formatDate(userData.updated_at)}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>User ID</p>
//                     <p className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData.user_id}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaTimes } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MdImageNotSupported } from "react-icons/md";
import { useUserActions } from "@/hooks/useUserActions";
import toast from "react-hot-toast";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LocationPicker from "@/components/LocationPicker";

interface Errors {
  [key: string]: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser, loading } = useUserActions();
  const [username, setUsername] = useState<string>(user!.name);
  const [email, setEmail] = useState<string>(user!.email);
  //   const [password, setPassword] = useState<string>();
  //   const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(
    user!.profile_picture
  );
  const [notifications, setNotifications] = useState<boolean>(
    user!.notification_enabled
  );
  const [locations, setLocations] = useState<string[]>(
    user!.location.split(", ")
  );
  const [errors, setErrors] = useState<Errors>({});
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
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
    if (!username || !email || locations.length === 0) {
      setErrors({
        ...errors,
        ...(username ? {} : { username: "שם משתמש נדרש" }),
        ...(email ? {} : { email: "אימייל נדרש" }),
        ...(locations.length > 0 ? {} : { locations: "מיקום נדרש" }),
      });
      return;
    }

    try {
      //   await createUser(username, email, password, notifications, locations);
      //   await checkAuth();
      //   navigate("/all-products");
    } catch (error) {
      //   console.log(error, "Error creating");
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
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl p-8"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-3">
          {user?.name} הפרופיל של
        </h2>
        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 left-4 text-gray-500 bg-transparent hover:text-gray-600 transition-colors"
          >
            {isEditing ? (
              <TiArrowBackOutline size={20} />
            ) : (
              <FaEdit size={20} />
            )}
          </button>
        </div>

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-12">
            <div>
              {/* password, confirm password, locations */}
              <div className="relative">
                {!isEditing ? (
                  <>
                    <label
                      className="block text-red-500 text-sm min-h-6"

                    >
                      {errors.locations && `* ${errors.locations}`}
                    </label>
                    <p>:מיקומים מועדפים להחלפה</p>
                    <div className="flex flex-wrap flex-row-reverse gap-2 mt-2">
                      {locations.map((location) => (
                        <div
                          key={location}
                          className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm"
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <LocationPicker
                    selectedLocations={locations}
                    onChange={(newLocations) => {
                      setLocations(newLocations);
                      setErrors({ ...errors, locations: "" });
                    }}
                    error={errors.locations}
                  />
                )}
              </div>
            </div>

            <div>
              {/* profile picture, username, email, notifications */}
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
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaCamera />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block text-red-500 text-sm min-h-6 "
                  
                >
                  {errors.username && `* ${errors.username}`}
                </label>
                {!isEditing ? (
                  <p>{username} :שם משתמש</p>
                ) : (
                  <Input
                    type="text"
                    name="username"
                    placeholder="שם משתמש"
                    value={username}
                    onChange={handleInputChange}
                    className={`w-full dark:bg-white dark:text-black ${
                      errors.username && "border border-red-500"
                    }`}
                    
                  />
                )}
              </div>
              <div>
                <label
                  className="block text-red-500 text-sm min-h-6 "
                  
                >
                  {errors.email && `* ${errors.email}`}
                </label>
                {!isEditing ? (
                  <p>{email} :מייל</p>
                ) : (
                  <Input
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    value={email}
                    onChange={handleInputChange}
                    className={`w-full dark:bg-white dark:text-black ${
                      errors.email && "border border-red-500"
                    }`}
                    
                  />
                )}
              </div>
              <div className="flex items-center justify-between my-3">
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  disabled={!isEditing}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  קבלת התראות
                </span>
              </div>
            </div>
          </div>

          {/* submit button */}
          {isEditing && (
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity ${
                loading && "loading-dots"
              }`}
            >
              {loading ? "נרשם..." : "הרשמה"}
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
}

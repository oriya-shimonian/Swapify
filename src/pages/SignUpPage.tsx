// // import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
// // import { motion } from 'framer-motion';
// // import { FaCamera, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
// // import { Switch } from '@/components/ui/switch';
// // import { Input } from '@/components/ui/input';
// // import { MdImageNotSupported } from "react-icons/md";

// // const SignupPage: React.FC = () => {
// //   // State Types
// //   const [username, setUsername] = useState<string>('');
// //   const [password, setPassword] = useState<string>('');
// //   const [confirmPassword, setConfirmPassword] = useState<string>('');
// //   const [profileImage, setProfileImage] = useState<string | null>(null);
// //   const [notifications, setNotifications] = useState<boolean>(false);
// //   const [locations, setLocations] = useState<string[]>([]);
// //   const [locationInput, setLocationInput] = useState<string>('');

// //   // Ref for file input
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   // Image Upload Handler
// //   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setProfileImage(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // Location Search Handler
// //   const handleLocationSearch = (e: FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (locationInput && !locations.includes(locationInput)) {
// //       setLocations(prevLocations => [...prevLocations, locationInput]);
// //       setLocationInput('');
// //     }
// //   };

// //   // Remove Location
// //   const removeLocation = (locationToRemove: string) => {
// //     setLocations(prevLocations => 
// //       prevLocations.filter(loc => loc !== locationToRemove)
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-auto">
// //       {/* Background Glow Effect */}
// //       <div className="absolute inset-0 pointer-events-none">
// //         <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
// //         <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
// //       </div>

// //       <motion.div 
// //         initial={{ opacity: 0, scale: 0.9 }}
// //         animate={{ opacity: 1, scale: 1 }}
// //         transition={{ duration: 0.5 }}
// //         className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 mt-3"
// //       >
// //         <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
// //         <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
// //           הרשמה
// //         </h2>

// //         {/* Rest of the component remains the same as in the previous TypeScript version */}
// //         {/* Profile Image Upload */}
// //         <div className="flex justify-center mb-6">
// //           <div className="relative">
// //             {profileImage ? (
// //               <img 
// //                 src={profileImage} 
// //                 alt="Profile" 
// //                 className="w-32 h-32 rounded-full object-fit border-4 border-blue-500"
// //               />
// //             ) : (
// //               <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
// //                 <MdImageNotSupported className="text-gray-500 text-3xl" />
// //               </div>
// //             )}
// //             <input 
// //               type="file" 
// //               ref={fileInputRef}
// //               onChange={handleImageUpload}
// //               accept="image/*"
// //               className="hidden"
// //             />
// //             <button 
// //               type="button"
// //               onClick={() => fileInputRef.current?.click()}
// //               className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
// //             >
// //               <FaCamera />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Signup Form */}
// //         <form onSubmit={handleLocationSearch} className="space-y-4">
// //           <Input 
// //             type="text"
// //             placeholder="שם משתמש"
// //             value={username}
// //             onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
// //             className="w-full dark:bg-white"
// //             style={{ direction: "rtl", textAlign: "right" }}
// //           />
// //           <Input 
// //             type="password"
// //             placeholder="סיסמה"
// //             value={password}
// //             onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
// //             className="w-full dark:bg-white"
// //             style={{ direction: "rtl", textAlign: "right" }}
// //           />
// //           <Input 
// //             type="password"
// //             placeholder="אישור סיסמה"
// //             value={confirmPassword}
// //             onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
// //             className="w-full dark:bg-white"
// //             style={{ direction: "rtl", textAlign: "right" }}
// //           />

// //           {/* Notifications Toggle */}
// //           <div className="flex items-center justify-between">
// //           <Switch 
// //               checked={notifications}
// //               onCheckedChange={(checked: boolean) => setNotifications(checked)}
// //             />
// //             <span className="text-gray-700 dark:text-gray-300">
// //               קבלת התראות
// //             </span>
            
// //           </div>

// //           {/* Location Search */}
// //           <div>
// //             <div className="relative">
// //               <Input 
// //                 type="text"
// //                 placeholder="חפש מיקום שבו תחליף פריטים"
// //                 value={locationInput}
// //                 onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationInput(e.target.value)}
// //                 className="w-full dark:bg-white"
// //                 style={{ direction: "rtl", textAlign: "right" }}

// //               />
// //               <button 
// //                 type="button"
// //                 onClick={() => {
// //                   if (locationInput && !locations.includes(locationInput)) {
// //                     setLocations(prevLocations => [...prevLocations, locationInput]);
// //                     setLocationInput('');
// //                   }
// //                 }}
// //                 className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
// //               >
// //                 <FaMapMarkerAlt />
// //               </button>
// //             </div>

// //             {/* Selected Locations */}
// //             {locations.length > 0 && (
// //               <div className="flex flex-wrap gap-2 mt-2">
// //                 {locations.map((location) => (
// //                   <div 
// //                     key={location} 
// //                     className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm"
// //                   >
// //                     {location}
// //                     <button 
// //                       type="button"
// //                       onClick={() => removeLocation(location)}
// //                       className="ml-2 text-red-500 hover:text-red-600"
// //                     >
// //                       <FaTimes />
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Submit Button */}
// //           <motion.button 
// //             type="submit"
// //             whileTap={{ scale: 0.95 }}
// //             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
// //           >
// //             הירשם
// //           </motion.button>
// //         </form>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default SignupPage;


// import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
// import { motion } from 'framer-motion';
// import { FaCamera, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
// import { Switch } from '@/components/ui/switch';
// import { Input } from '@/components/ui/input';
// import { MdImageNotSupported } from "react-icons/md";

// const SignupPage: React.FC = () => {
//   const [username, setUsername] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [notifications, setNotifications] = useState<boolean>(false);
//   const [locations, setLocations] = useState<string[]>([]);
//   const [locationInput, setLocationInput] = useState<string>('');
//   const [suggestedLocations, setSuggestedLocations] = useState<{ display_name: string }[]>([]);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const fetchLocations = async (query: string) => {
//     if (!query.trim()) return;
//     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=he`);
//     const data = await response.json();
//     setSuggestedLocations(data.slice(0, 5));
//   };

//   const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setLocationInput(value);
//     fetchLocations(value);
//   };

//   const selectLocation = (location: string) => {
//     if (!locations.includes(location)) {
//       setLocations([...locations, location]);
//     }
//     setLocationInput('');
//     setSuggestedLocations([]);
//   };

//   const removeLocation = (locationToRemove: string) => {
//     setLocations(locations.filter(loc => loc !== locationToRemove));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-auto">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6 mt-3"
//       >
//         <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">הרשמה</h2>

//         <div className="flex justify-center mb-6">
//           <div className="relative">
//             {profileImage ? (
//               <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-fit border-4 border-blue-500" />
//             ) : (
//               <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
//                 <MdImageNotSupported className="text-gray-500 text-3xl" />
//               </div>
//             )}
//             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
//             <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
//               <FaCamera />
//             </button>
//           </div>
//         </div>

//         <form className="space-y-4">
//           <Input type="text" placeholder="שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full dark:bg-white" />
//           <Input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full dark:bg-white" />
//           <Input type="password" placeholder="אישור סיסמה" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full dark:bg-white" />

//           <div className="flex items-center justify-between">
//             <Switch checked={notifications} onCheckedChange={setNotifications} />
//             <span className="text-gray-700 dark:text-gray-300">קבלת התראות</span>
//           </div>

//           <div className="relative">
//             <Input type="text" placeholder="חפש מיקום" value={locationInput} onChange={handleLocationInputChange} className="w-full dark:bg-white" />
//             {suggestedLocations.length > 0 && (
//               <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg z-10">
//                 {suggestedLocations.map((loc, index) => (
//                   <li key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => selectLocation(loc.display_name)}>
//                     {loc.display_name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-2 mt-2">
//             {locations.map((location) => (
//               <div key={location} className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm">
//                 {location}
//                 <button type="button" onClick={() => removeLocation(location)} className="ml-2 text-red-500 hover:text-red-600">
//                   <FaTimes />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <motion.button type="submit" whileTap={{ scale: 0.95 }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
//             הירשם
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default SignupPage;
import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { MdImageNotSupported } from "react-icons/md";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>('');
  const [suggestedLocations, setSuggestedLocations] = useState<{ label: string }[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchLocations = async (query: string) => {
    if (!query.trim()) return;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=he`);
    const data = await response.json();
    setSuggestedLocations(data.slice(0, 5).map((loc: { display_name: string }) => ({ label: loc.display_name.split(",")[0] })));
  };

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    fetchLocations(value);
  };

  const selectLocation = (location: string) => {
    if (!locations.includes(location)) {
      setLocations([...locations, location]);
    }
    setLocationInput('');
    setSuggestedLocations([]);
  };

  const removeLocation = (locationToRemove: string) => {
    setLocations(locations.filter(loc => loc !== locationToRemove));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 overflow-auto">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-b-2xl p-8 space-y-6 mt-14"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">הרשמה</h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-fit border-4 border-blue-500" />
            ) : (
              <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <MdImageNotSupported className="text-gray-500 text-3xl" />
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
              <FaCamera />
            </button>
          </div>
        </div>

        <form onSubmit={()=>  console.log("submit")} className="space-y-4">
          <Input type="text" placeholder="שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full dark:bg-white" style={{ direction: "rtl", textAlign: "right" }}/>
          <Input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full dark:bg-white" style={{ direction: "rtl", textAlign: "right" }}/>
          <Input type="password" placeholder="אישור סיסמה" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full dark:bg-white" style={{ direction: "rtl", textAlign: "right" }}/>

          <div className="flex items-center justify-between">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
            <span className="text-gray-700 dark:text-gray-300">קבלת התראות</span>
          </div>

          <div className="relative">
            <Input type="text" placeholder="חפש מיקום" value={locationInput} onChange={handleLocationInputChange} className="w-full dark:bg-white" style={{ direction: "rtl", textAlign: "right" }}/>
            {suggestedLocations.length > 0 && (
              <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg z-10">
                {suggestedLocations.map((loc, index) => (
                  <li key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => selectLocation(loc.label)}>
                    {loc.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap flex-row-reverse gap-2 mt-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm">
                {location}
                <button type="button" onClick={() => removeLocation(location)} className="ml-2 text-red-500 hover:text-red-600">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <motion.button type="submit" whileTap={{ scale: 0.95 }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
            הירשם
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;
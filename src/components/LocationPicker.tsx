// import React, { useState, ChangeEvent, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { FaTimes } from 'react-icons/fa';

// interface LocationPickerProps {
//   selectedLocations: string[];
//   onChange: (locations: string[]) => void;
//   error?: string;
// }

// export default function LocationPicker({ selectedLocations, onChange, error }: LocationPickerProps) {
//   const [input, setInput] = useState('');
//   const [suggested, setSuggested] = useState<{ label: string }[]>([]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       if (!input.trim()) return;
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&accept-language=he`);
//       const data = await response.json();
//       setSuggested(data.slice(0, 5).map((loc: { display_name: string }) => ({ label: loc.display_name.split(',')[0] })));
//     };

//     const delayDebounce = setTimeout(fetchLocations, 500);
//     return () => clearTimeout(delayDebounce);
//   }, [input]);

//   const handleSelect = (location: string) => {
//     if (!selectedLocations.includes(location)) {
//       onChange([...selectedLocations, location]);
//     }
//     setInput('');
//     setSuggested([]);
//   };

//   const handleRemove = (loc: string) => {
//     onChange(selectedLocations.filter(l => l !== loc));
//   };

//   return (
//     <div className="relative">
//       <label className="block text-red-500 text-sm min-h-6">
//         {error && `* ${error}`}
//       </label>
//       <Input
//         type="text"
//         placeholder="חפש מיקום"
//         value={input}
//         onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
//         className={`w-full dark:bg-white ${error && 'border border-red-500'}`}
//       />
//       {suggested.length > 0 && (
//         <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg z-10">
//           {suggested.map((loc, index) => (
//             <li
//               key={index}
//               className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
//               onClick={() => handleSelect(loc.label)}
//             >
//               {loc.label}
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="flex flex-wrap gap-2 mt-2">
//         {selectedLocations.map(location => (
//           <div key={location} className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm">
//             <button type="button" onClick={() => handleRemove(location)} className="ml-2 text-red-500 hover:text-red-600">
//               <FaTimes />
//             </button>
//             {location}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaTimes } from "react-icons/fa";

interface LocationPickerProps {
  selectedLocations: string[];
  onChange: (locations: string[]) => void;
  error?: string;
  readonly?: boolean; // חדש
}

export default function LocationPicker({
  selectedLocations,
  onChange,
  error,
  readonly = false,
}: LocationPickerProps) {
  const [input, setInput] = useState("");
  const [suggested, setSuggested] = useState<{ label: string }[]>([]);

  useEffect(() => {
    if (readonly || !input.trim()) return;

    const fetchLocations = async () => {
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/search?format=json&q=${input}&accept-language=he&countrycodes=IL`
      // );

      // const data = await response.json();
      // setSuggested(
      //   data.slice(0, 5).map((loc: { display_name: string }) => ({
      //     label: loc.display_name.split(",")[0],
      //   }))
      // );

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}&accept-language=he&countrycodes=IL&addressdetails=1`
      );
      const data = await response.json();
      setSuggested(
        data
          .filter((loc: any) =>
            // {
            // console.log(loc, 444);
            ["city", "town", "village", "hamlet", "valley", "region", "ridge"].includes(loc.addresstype)
            
          // }
          )
          .slice(0, 5)
          .map((loc: any) => ({
            label:
              loc.address?.city ||
              loc.address?.valley ||
              loc.address?.town ||
              loc.address?.village ||
              loc.address?.hamlet ||
              loc.address?.region ||
              loc.address?.ridge ||
              loc.display_name.split(",")[0],
          }))
      );
    };

    const delayDebounce = setTimeout(fetchLocations, 500);
    return () => clearTimeout(delayDebounce);
  }, [input, readonly]);

  const handleSelect = (location: string) => {
    if (!selectedLocations.includes(location)) {
      onChange([...selectedLocations, location]);
    }
    setInput("");
    setSuggested([]);
  };

  const handleRemove = (loc: string) => {
    onChange(selectedLocations.filter((l) => l !== loc));
  };

  return (
    <div className="relative">
      {error && (
        <label className="block text-red-500 text-sm min-h-6">* {error}</label>
      )}

      {!readonly && (
        <Input
          type="text"
          placeholder="חפש מיקום"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          className={`w-full dark:bg-white ${error && "border border-red-500"}`}
        />
      )}

      {!readonly && suggested.length > 0 && (
        <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg z-10">
          {suggested.map((loc, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => handleSelect(loc.label)}
            >
              {loc.label}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedLocations.map((location) => (
          <div
            key={location}
            className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm"
          >
            {!readonly && (
              <button
                type="button"
                onClick={() => handleRemove(location)}
                className="ml-2 text-red-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
            )}
            {location}
          </div>
        ))}
      </div>
    </div>
  );
}

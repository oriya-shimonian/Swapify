// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Select, SelectItem } from "@/components/ui/select";
// import { useMeetingOptions } from "@/hooks/useMeetingOptions";

// interface MeetingSuggestionDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (meetingOptionId: number) => void;
// }

// export function MeetingSuggestionDialog({ open, onClose, onSelect }: MeetingSuggestionDialogProps) {
//   const { cities, optionsByCity } = useMeetingOptions();
//   const [selectedCity, setSelectedCity] = useState<string>("");
//   const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

//   const locations = selectedCity ? optionsByCity[selectedCity] || [] : [];

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>בחר מקום ושעה למפגש</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <Select
//             // placeholder="בחר עיר"
//             value={selectedCity}
//             onValueChange={(value) => {
//               setSelectedCity(value);
//               setSelectedOptionId(null);
//             }}
//           >
//             {cities.map((city) => (
//               <SelectItem key={city} value={city}>
//                 {city}
//               </SelectItem>
//             ))}
//           </Select>

//           {locations.length > 0 && (
//             <Select
//             //   placeholder="בחר מקום ושעה"
//               value={selectedOptionId?.toString() || ""}
//               onValueChange={(value) => setSelectedOptionId(parseInt(value))}
//             >
//               {locations.map((option) => (
//                 <SelectItem key={option.id} value={option.id.toString()}>
//                   {`${option.location_name}, ${option.hour.slice(0, 5)}`}
//                 </SelectItem>
//               ))}
//             </Select>
//           )}
//         </div>

//         <DialogFooter className="pt-4">
//           <Button
//             onClick={() => selectedOptionId && onSelect(selectedOptionId)}
//             disabled={!selectedOptionId}
//           >
//             שלח הצעה
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Badge } from "@/components/ui/badge";

const baseClasses = "text-white px-2 py-1 rounded-full text-xs font-bold";

export function getStatusBadge(status?: string) {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm";
  
  switch (status) {
    case "Pending":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 text-amber-800 hover:shadow-amber-200/50 hover:shadow-md`}
        >
          ממתין
        </Badge>
      );
      
    case "Approved":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 text-emerald-800 hover:shadow-emerald-200/50 hover:shadow-md`}
        >
          אושר
        </Badge>
      );
      
    case "Rejected":
      return (
        <Badge 
          variant="destructive" 
          className={`${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-800 hover:shadow-red-200/50 hover:shadow-md`}
        >
          נדחה
        </Badge>
      );
      
    case "Completed":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 text-blue-800 hover:shadow-blue-200/50 hover:shadow-md`}
        >
          הושלם
        </Badge>
      );
      
    default:
      return (
        <Badge 
          variant="default" 
          className={`${baseClasses} bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/60 text-gray-600 hover:shadow-gray-200/50 hover:shadow-md`}
        >
          לא ידוע
        </Badge>
      );
  }
}

// export function getAvailabilityBadge(availability?: string) {
//   switch (availability) {
//     case "Available":
//       return <Badge variant="secondary" className={`${baseClasses} bg-green-500`}>זמין</Badge>;
//     case "Interested":
//       return <Badge variant="secondary" className={`${baseClasses} bg-yellow-500`}>מוצר מבוקש</Badge>;
//     case "Pending":
//       return <Badge variant="secondary" className={`${baseClasses} bg-orange-500`}>בתהליך החלפה</Badge>;
//     case "Exchanged":
//       return <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>הוחלף</Badge>;
//     default:
//       return <Badge variant="default" className={baseClasses}>לא ידוע</Badge>;
//   }
// }


export function getAvailabilityBadge(availability?: string) {
  const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-md border";
  
  switch (availability) {
    case "Available":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} text-xs w-max px-1 bg-transparent border-sky-600 text-sky-700 hover:bg-sky-50/80 hover:border-sky-300`}
        >
          זמין
        </Badge>
      );
      
    case "Interested":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} text-xs w-max px-1 bg-transparent border-purple-600 text-purple-700 hover:bg-purple-50/80 hover:border-purple-300`}
        >
          מוצר מבוקש
        </Badge>
      );
      
    case "Pending":
      return (
        <Badge 
          variant="secondary" 
          className={`${baseClasses} text-xs w-max px-1 bg-transparent border-amber-600 text-amber-700 hover:bg-amber-50/80 hover:border-amber-300`}
        >
          בתהליך החלפה
        </Badge>
      );
      
    case "Exchanged":
      return (
        <Badge 
          variant="destructive" 
          className={`${baseClasses} text-xs w-max px-1 bg-transparent border-rose-600 text-rose-700 hover:bg-rose-50/80 hover:border-rose-300`}
        >
          הוחלף
        </Badge>
      );
      
    default:
      return (
        <Badge 
          variant="default" 
          className={`${baseClasses} text-xs w-max px-1 bg-transparent border-slate-500 text-slate-600 hover:bg-slate-50/80 hover:border-slate-300`}
        >
          לא ידוע
        </Badge>
      );
  }
}
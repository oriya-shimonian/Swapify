import { Badge } from "@/components/ui/badge";

const baseClasses = "text-white px-2 py-1 rounded-full text-xs font-bold";

export function getStatusBadge(status?: string) {
  switch (status) {
    case "Pending":
      return <Badge variant="secondary" className={`${baseClasses} bg-yellow-500`}>ממתין</Badge>;
    case "Approved":
      return <Badge variant="secondary" className={`${baseClasses} bg-green-500`}>אושר</Badge>;
    case "Rejected":
      return <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>נדחה</Badge>;
    case "Completed":
      return <Badge variant="secondary" className={`${baseClasses} bg-blue-500`}>הושלם</Badge>;
    default:
      return <Badge variant="default" className={baseClasses}>לא ידוע</Badge>;
  }
}

export function getAvailabilityBadge(availability?: string) {
  switch (availability) {
    case "Available":
      return <Badge variant="secondary" className={`${baseClasses} bg-green-500`}>זמין</Badge>;
    case "Interested":
      return <Badge variant="secondary" className={`${baseClasses} bg-yellow-500`}>מעוניינים</Badge>;
    case "Pending":
      return <Badge variant="secondary" className={`${baseClasses} bg-orange-500`}>בתהליך החלפה</Badge>;
    case "Exchanged":
      return <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>הוחלף</Badge>;
    default:
      return <Badge variant="default" className={baseClasses}>לא ידוע</Badge>;
  }
}

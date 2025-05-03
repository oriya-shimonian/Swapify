import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null; // ✅ לא מציגים פאגינציה אם יש עמוד אחד בלבד

  return (
    <div className="flex justify-center gap-2 mt-6" role="navigation" aria-label="Pagination Navigation">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        הקודם
      </Button>
      <span className="px-3 py-1">{currentPage} מתוך {totalPages}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        הבא
      </Button>
    </div>
  );
}

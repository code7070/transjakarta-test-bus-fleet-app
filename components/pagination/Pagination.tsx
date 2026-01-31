import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate exactly 3 page numbers centered on currentPage
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    // Adjust if we're near the end
    if (end - start < 2 && totalPages >= 3) {
      start = Math.max(1, end - 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 py-6 border-t border-muted/20 mt-8">
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        title="First Page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        title="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
              ${
                currentPage === page
                  ? "bg-primary text-surface shadow-md scale-105"
                  : "text-foreground hover:bg-muted/10 hover:text-primary"
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        title="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        title="Last Page"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  );
};

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div
      className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 
                  flex flex-col sm:flex-row justify-between items-center gap-4
                  shadow-md z-10"
    >
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <span className="px-3 py-1 border border-gray-300 rounded-md bg-gray-50">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { TABLE_HEADERS } from "@/constants";
import { Advocate } from "@/types";
import { AdvocatesCardView } from "@/components/AdvocatesCardView";
import { AdvocatesTable } from "@/components/AdvocatesTable";
import { Pagination } from "@/components/Pagination";
import { Header } from "@/components/Header";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Single pagination state object
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // Function to fetch paginated data
  const fetchAdvocates = useCallback(
    async (page = 1, searchTerm = "") => {
      setIsLoading(true);

      // Build URL with query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      try {
        const response = await fetch(`/api/advocates?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        setAdvocates(result.data);
        setFilteredAdvocates(result.data);
        setPagination({
          page: result.meta.page,
          pageSize: result.meta.pageSize,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
          hasMore: result.meta.hasMore,
        });
      } catch (error) {
        console.error("Error fetching advocates:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageSize]
  );

  // Initial data load
  useEffect(() => {
    fetchAdvocates(1);
  }, [fetchAdvocates]);

  const handleReset = () => {
    setSearchTerm("");
    fetchAdvocates(1, "");
  };

  // Search handler (debounced)
  const handleSearch = useDebounce((term: string) => {
    setPagination(prev => ({...prev, page: 1}));
    fetchAdvocates(1, term);
  }, 300);

  // Update the onChange handler
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    handleSearch(term);
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    fetchAdvocates(newPage, searchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Solace Advocates"
        searchTerm={searchTerm}
        onChange={onChange}
        onReset={handleReset}
      />
      <main className="flex-grow px-4 py-6 mt-4 mb-16 max-w-full">
        <div className="my-5"></div>
        {/* Only render views when not loading */}
        {!isLoading && filteredAdvocates.length > 0 && (
          <>
            <AdvocatesTable advocates={filteredAdvocates} headers={TABLE_HEADERS} />
            <AdvocatesCardView advocates={filteredAdvocates} />
          </>
        )}

        {/* Show message when no results */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {/* No results message */}
        {!isLoading && filteredAdvocates.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No advocates found matching your search criteria.</p>
          </div>
        )}
      </main>

      {/* Fixed footer - always at bottom */}
      {!isLoading && filteredAdvocates.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0">
          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

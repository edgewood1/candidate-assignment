"use client";

import React, { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { TABLE_HEADERS } from "@/constants";
import { Advocate } from "@/types";
import { AdvocatesCardView } from "@/components/AdvocatesCardView";
import { AdvocatesTable } from "@/components/AdvocatesTable";
import { Pagination } from "@/components/Pagination";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";

interface AdvocatesClientPageProps {
  initialData: {
    data: Advocate[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

const API_URL = "/api/mock-advocates"; 

export default function AdvocatesClientPage({ initialData }: AdvocatesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(initialData.meta.page);
  const pageSize = initialData.meta.pageSize;

  const { data, isLoading } = useQuery({
    queryKey: ['advocates', page, searchTerm, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`${API_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
          

      return response.json();
    },
    initialData: page === 1 && searchTerm === "" ? initialData : undefined,
    
  });
  
  const advocates = data?.data || [];
  const pagination = data?.meta || initialData.meta;

  const handleReset = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleSearch = useDebounce((term: string) => {
    setPage(1);
  }, 300);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    handleSearch(term);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
        {!isLoading && advocates.length > 0 && (
          <>
            <AdvocatesTable advocates={advocates} headers={TABLE_HEADERS} />
            <AdvocatesCardView advocates={advocates} />
          </>
        )}

        {/* Show loading spinner */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* No results message */}
        {!isLoading && advocates.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No advocates found matching your search criteria.</p>
          </div>
        )}
      </main>

      {/* Fixed footer - always at bottom */}
      {!isLoading && advocates.length > 0 && (
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
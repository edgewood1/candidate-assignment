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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAdvocates.slice(startIndex, endIndex);
  };

  const currentAdvocates = getCurrentPageData();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
        setIsLoading(false);
      });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Optionally scroll to top
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAdvocates.length]);

  const filterAdvocates = useCallback(
    (term: string) => {
      const filtered = advocates.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(term) ||
          advocate.lastName.toLowerCase().includes(term) ||
          advocate.city.toLowerCase().includes(term) ||
          advocate.degree.toLowerCase().includes(term) ||
          advocate.specialties.some((specialty) => specialty.toLowerCase().includes(term)) ||
          advocate.yearsOfExperience.toString().includes(term) ||
          advocate.phoneNumber.toString().includes(term)
        );
      });

      setFilteredAdvocates(filtered);
    },
    [advocates]
  );

  const debouncedFilter = useDebounce(filterAdvocates, 300);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    debouncedFilter(term);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
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
            <AdvocatesTable advocates={currentAdvocates} headers={TABLE_HEADERS} />
            <AdvocatesCardView advocates={currentAdvocates} />
          </>
        )}

        {/* Show message when no results */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
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
            currentPage={currentPage}
            totalItems={filteredAdvocates.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

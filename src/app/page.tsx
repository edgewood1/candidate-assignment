"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "@/components/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { TABLE_HEADERS } from "@/constants";
import { Advocate } from "@/types";
import { AdvocatesCardView } from "@/components/AdvocatesCardView";
import { AdvocatesTable } from "@/components/AdvocatesTable";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      });
    });
  }, []);

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
    <main style={{ margin: "24px" }} className="max-w-full">
      <h1 className="m-4 text-2xl font-bold text-gray-800 text-center">Solace Advocates</h1>
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {searchTerm && (
            <>
              Searching for: <span className="font-semibold text-blue-700">{searchTerm}</span>
            </>
          )}
        </span>
      </div>
      <SearchBar searchTerm={searchTerm} onChange={onChange} onReset={handleReset} />
      <div className="my-5"></div>
      {/* Only render views when not loading */}
      {!isLoading && (
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
      {!isLoading && filteredAdvocates.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No advocates found matching your search criteria.</p>
        </div>
      )}
    </main>
  );
}

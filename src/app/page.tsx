"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "@/components/SearchBar";

type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

function useDebounce(fn: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}

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

  const headers = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Years of Experience",
    "Phone Number",
  ];

  function getAdvocateRowValues(advocate: Advocate) {
    return [
      advocate.firstName,
      advocate.lastName,
      advocate.city,
      advocate.degree,
      advocate.specialties,
      advocate.yearsOfExperience,
      advocate.phoneNumber,
    ];
  }
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
      {/* table for desktop/tablet */}
      <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdvocates.map((advocate) => (
              <tr key={advocate.id} className="hover:bg-gray-50">
                {getAdvocateRowValues(advocate).map((value, idx) =>
                  idx === 4 ? (
                    <td key={idx} className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {advocate.specialties.map((specialty, i) => (
                          <span
                            key={`${advocate.id}-specialty-${i}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                  ) : (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                      {value}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {filteredAdvocates.map((advocate) => (
          <div
            key={advocate.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {advocate.firstName} {advocate.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {advocate.city} • {advocate.degree}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">{advocate.yearsOfExperience} yrs exp</div>
                <div className="text-sm text-gray-500">
                  {advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs uppercase font-medium text-gray-500 mb-1">Specialties</p>
              <div className="flex flex-wrap gap-1">
                {advocate.specialties.map((specialty, i) => (
                  <span
                    key={`${advocate.id}-specialty-${i}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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

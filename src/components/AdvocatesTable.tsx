import React from "react";
import { Advocate } from "@/types";

interface AdvocatesTableProps {
  advocates: Advocate[];
  headers: string[];
}

export const AdvocatesTable: React.FC<AdvocatesTableProps> = ({ advocates, headers }) => {
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
          {advocates.map((advocate) => (
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
  );
};

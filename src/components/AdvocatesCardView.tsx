import React from "react";
import { Advocate } from "../types";

interface AdvocatesCardViewProps {
  advocates: Advocate[];
}

export const AdvocatesCardView: React.FC<AdvocatesCardViewProps> = ({ advocates }) => {
  return (
    <div className="md:hidden space-y-4">
      {advocates.map((advocate) => (
        <div key={advocate.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
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
  );
};

import React from "react";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  title: string;
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, searchTerm, onChange, onReset }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">{title}</h1>

        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {searchTerm && (
              <>
                Searching for: <span className="font-semibold text-blue-700">{searchTerm}</span>
              </>
            )}
          </span>
        </div>

        <SearchBar searchTerm={searchTerm} onChange={onChange} onReset={onReset} />
      </div>
    </header>
  );
};

"use client";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useState } from "react";

interface SearchBarProps {
  handleSetSearchTerm: (searchTerm: string) => void;
}

export default function SearchBar({ handleSetSearchTerm }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSetSearchTerm(e.target.value);
  };


  return (
    <div className="flex gap-2 items-center py-2 px-4 h-14">
      <FiMenu size={24} className="cursor-pointer" />
      <div className="flex items-center gap-2 bg-light-gray p-2 rounded-full flex-1">
        <FiSearch size={24} />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}

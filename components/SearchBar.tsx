import React, { useEffect, useRef } from "react";
import { Input } from "./ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder?: string; // Optional placeholder prop
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearch,
  placeholder = "Search...",
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.blur(); // Blur the input on mount
    }
  }, []);

  return (
    <div className="mb-4">
      <Input
        type="text"
        ref={inputRef} // Attach the ref to the input
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="border rounded p-2 w-full outline-none focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;

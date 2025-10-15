"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Suggestion {
  name?: string;
  brand?: string;
  collections?: string;
  variants?: {
    color?: string;
  };
}

const AdvancedSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  let debounceTimer: NodeJS.Timeout;

  // Sync input with URL
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounce function (NO useCallback needed)
  const fetchSuggestions = async (value: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (!value) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      const res = await fetch(`/api/search-suggestions?q=${value}`);
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
    }, 400);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    fetchSuggestions(value);

    // Update URL in real-time
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Handle suggestion click
  const applySuggestion = (text: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", text);
    router.push(`/shop?${params.toString()}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative mb-4">
      <Input
        value={searchValue}
        onChange={handleChange}
        placeholder="Search by name, brand, color, collection..."
        className="h-11 rounded-md"
      />

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-y-auto z-50">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => applySuggestion(item.name || item.brand || "")}
            >
              {item.name ||
                item.brand ||
                item.collections ||
                item.variants?.color}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;

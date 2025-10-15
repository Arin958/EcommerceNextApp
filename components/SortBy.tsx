'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortDropdownProps {
  currentSort: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: 'new', label: 'New Arrivals' },
    { value: 'bestseller', label: 'Best Sellers' },
    { value: 'trending', label: 'Trending' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set or update the sort parameter
    params.set('sort', sortValue);
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-end mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Sort by:</label>
        <select 
          value={currentSort || 'new'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortDropdown;
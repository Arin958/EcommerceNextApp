'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


interface FilterSidebarProps {
    categories: string[];
    colors: string[];
    sizes: string[];
    collections: string[];
    maxPriceValue?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
    categories, 
    colors, 
    sizes, 
    collections, 
    maxPriceValue = 1000 
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || maxPriceValue);

    const updateQuery = (key: string, value: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        searchParams.forEach((val, k) => {
            if (!params.has(k)) params.set(k, val);
        });

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.push(`/shop?${params.toString()}`);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        searchParams.forEach((val, k) => {
            if (!params.has(k)) params.set(k, val);
        });

        params.set('minPrice', minPrice.toString());
        params.set('maxPrice', maxPrice.toString());

        router.push(`/shop?${params.toString()}`);
    };

    useEffect(() => {
        if (searchParams.get('minPrice')) setMinPrice(Number(searchParams.get('minPrice')));
        if (searchParams.get('maxPrice')) setMaxPrice(Number(searchParams.get('maxPrice')));
    }, [searchParams]);

    const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="border-b border-gray-200 pb-6 last:border-b-0">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">{title}</h3>
            {children}
        </div>
    );

    const FilterButton = ({ item, filterKey }: { item: string; filterKey: string }) => {
        const isActive = searchParams.get(filterKey) === item;
        
        return (
            <button
                onClick={() => updateQuery(filterKey, item)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
            >
                {item}
            </button>
        );
    };

    return (
        <aside className="w-full sm:w-80 p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full mt-2"></div>
            </div>

            <FilterSection title="Category">
                <div className="space-y-2">
                    {categories.map(cat => (
                        <FilterButton key={cat} item={cat} filterKey="category" />
                    ))}
                </div>
            </FilterSection>

            {/* <FilterSection title="Color">
                <div className="space-y-2">
                    {colors.map(color => (
                        <FilterButton key={color} item={color} filterKey="color" />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Size">
                <div className="space-y-2">
                    {sizes.map(size => (
                        <FilterButton key={size} item={size} filterKey="size" />
                    ))}
                </div>
            </FilterSection> */}

            <FilterSection title="Collections">
                <div className="space-y-2">
                    {collections.map(collection => (
                        <FilterButton key={collection} item={collection} filterKey="collections" />
                    ))}
                </div>
            </FilterSection>

        

            <div className="pt-4">
                <button
                    onClick={() => router.push('/shop')}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium border border-gray-300 hover:border-gray-400"
                >
                    Clear All Filters
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
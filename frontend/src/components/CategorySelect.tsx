// components/CategorySelect.js
"use client"
import { BACKEND_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Category, dbResponse } from '@/type/type';
const CategorySelect = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Make a GET request to your backend API endpoint to fetch categories.
        console.log("fetching")
        fetch(`${BACKEND_URL}/api/categories`)
            .then((response) => response.json())
            .then((datas : dbResponse<Category>) => setCategories(datas.data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    return (
        <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">Category</label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Your SVG icon code */}
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default CategorySelect;

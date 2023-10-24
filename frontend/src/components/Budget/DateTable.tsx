"use effect"
import React, { useState } from 'react'

export default function DateTable() {
    const months = [
        { name: 'January', index: 1 },
        { name: 'February', index: 2 },
        { name: 'March', index: 3 },
        { name: 'April', index: 4 },
        { name: 'May', index: 5 },
        { name: 'June', index: 6 },
        { name: 'July', index: 7 },
        { name: 'August', index: 8 },
        { name: 'September', index: 9 },
        { name: 'October', index: 10 },
        { name: 'November', index: 11 },
        { name: 'December', index: 12 },
    ];

    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const handleMonthClick = (index: number) => {
        setSelectedMonth(index);
    };
    return (
        <table className="table-auto">
            <tbody>
                <tr>
                    {months.map((month) => (
                        <td
                            key={month.index}
                            onClick={() => handleMonthClick(month.index)}
                            className={`p-2 cursor-pointer ${selectedMonth === month.index ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {month.name}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

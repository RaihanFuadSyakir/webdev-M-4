"use client"
import axiosInstance from '@/utils/fetchData';
import { Report, dbResponse } from '@/utils/type';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
function formatMonthYearDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const month = parseInt((date.getMonth() + 1).toString().padStart(2, '0'));
    const year = date.getFullYear().toString();

    return `${months[month - 1]} ${year}`;
}
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export default function ListReport() {
    const [reports, setReports] = useState<Report[]>();
    useEffect(() => {
        axiosInstance.get('/reports')
            .then((response: AxiosResponse<dbResponse<Report[]>>) => {
                const data = response.data.data;
                setReports(data);
            })
            .catch((err_res: AxiosError<dbResponse<Report[]>>) => {
                console.log(JSON.stringify(err_res.response?.data));
            })
    })
    return (
        <div>
            <h2>ListReport</h2>
            <div>
                {reports?.map((report) => (
                    <>
                        <p>{formatMonthYearDate(report.date)}</p>
                        <div>
                            Total Income : Rp. {report.total_income}
                        </div>
                        <div>
                            Total Outcome : Rp. {report.total_outcome}
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

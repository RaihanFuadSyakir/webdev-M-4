"use client"
import axiosInstance from '@/utils/fetchData';
import { Report, dbResponse } from '@/utils/type';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import numeral from 'numeral';
function formatMonthYearDate(dateStr: string): string {
    const datePortion = dateStr.split('T')[0];
    const date = new Date(datePortion);

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
                console.log(JSON.stringify(data));
            })
            .catch((err_res: AxiosError<dbResponse<Report[]>>) => {
                console.log(JSON.stringify(err_res.response?.data));
            })
    }, [])
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'month',
            width: 110,
            valueFormatter: (params: GridValueFormatterParams<Report>) => params.value.date
        },
        {
            field: 'total_income',
            headerName: 'Total Income,',
            width: 80,
            valueFormatter: (params: GridValueFormatterParams<Report>) => `Rp. ${numeral(params.value.total_income).format('0,0')}`
        },
        {
            field: 'total_outcome',
            headerName: 'Total Outcome,',
            width: 80,
            valueFormatter: (params: GridValueFormatterParams<Report>) => `Rp. ${numeral(params.value.total_outcome).format('0,0')}`
        }
    ]
    return (
        <div>
            <h2>ListReport</h2>
            <div>
                {reports && <DataGrid
                    rows={reports}
                    columns={columns}
                    autoHeight
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    checkboxSelection={false}
                />}

            </div>
        </div>
    )
}

"use client"
import axiosInstance from '@/utils/fetchData'
import { Budget, dbResponse } from '@/utils/type'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export default function BudgetLeft() {
    const [budgets, setbudgets] = useState<Budget[]>();
    useEffect(() => {
        axiosInstance.get('/budgets/')
            .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
                const data = response.data.data;
                setbudgets(data);
            })
            .catch((err_res: AxiosError<dbResponse<Budget>>) => {
                console.log(JSON.stringify(err_res.response?.data.msg));
            })
    }, [])
    return (
        <div>
            <div className='flex'>
                <div></div>
            </div>
            <h2>Budget Left</h2>
            <div>{budgets?.map((budget) => (
                <>
                    <div className='flex'>
                        <p>
                            {budget.current_budget < 0 ?
                                `You've exceed Budget by Rp.${budget.current_budget * -1}`
                                :
                                `You've saved budget by Rp.${budget.current_budget}`
                            }
                            <span>{` at ${months[budget.month - 1]} ${budget.year}`}</span>
                        </p>
                    </div>


                </>

            ))}</div>
        </div>
    )
}

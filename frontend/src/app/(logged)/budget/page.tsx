"use client"
import Link from "next/link";
import Breadcrumb from "@/components/template/Breadcrumbs/Breadcrumb";
import CardSwitcher from "@/components/Card/CardSwitcher"
import BudgetSelect from "@/components/Budget/BudgetSelect";
import { Metadata } from "next";
import ListBudget from "@/components/Budget/ListBudget";
import { useEffect, useState } from "react";
import { Budget, dbResponse } from "@/utils/type";
import axiosInstance from "@/utils/fetchData";
import { AxiosError, AxiosResponse } from "axios";
export const metadata: Metadata = {
  title: "Buttons Page | Next.js E-commerce Dashboard Template",
  description: "This is Buttons page for TailAdmin Next.js",
  // other metadata
};

const Budget = () => {
  const [seed,setSeed] = useState(0);
  const [budgets,setBudgets] = useState<Budget[]>([]);
  useEffect(()=>{
    axiosInstance.get('/budgets/')
    .then((response : AxiosResponse<dbResponse<Budget[]>>)=>{
      const data = response.data.data;
      setBudgets(data)
    })
    .catch((err_res : AxiosError<dbResponse<Budget[]>>)=>{
      console.log(JSON.stringify(err_res.response?.data)) 
    })
  },[])
  return (
    <>
      <Breadcrumb pageName="Budget" />

      {/* <!-- Normal Button Items --> */}
      {/* <div className="my-10 rounded-sm border border-stroke bg-white shadow-default">
        <CardSwitcher cards={financialCards} />
      </div> */}
    <div className="flex">
        <div className="flex-1 p-2">
          <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              <h2 className="font-bold text-xl mb-2 text-black text-center">Create Budget</h2>
              <BudgetSelect setDataBudgets={setBudgets} budgets={budgets}/>
            </div>

          </div>
        </div>
        <div className="flex-1 p-2">
          {budgets && <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              <h2 className="font-bold text-xl mb-2 text-black">Budget List</h2>
              <ListBudget budgets={budgets} setDataBudgets={setBudgets}/>
            </div>
          </div>}
        </div> 
    </div>
    </>
  );
};

export default Budget;

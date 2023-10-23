"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Income, Outcome, dbResponse } from '@/utils/type';
import ListRecap from '@/components/Recap/ListRecap'; // Import the ListRecap component
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';


const Recap = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  // Fetch incomes and outcomes data when the component mounts
  useEffect(() => {
    const fetchIncome = axiosInstance.get(`/incomes/user`); // Replace with your actual endpoint
    const fetchOutcome = axiosInstance.get(`${BACKEND_URL}/api/outcomes/`); // Replace with your actual endpoint

    Promise.all([fetchIncome, fetchOutcome])
      .then((responses) => {
        const incomeResponse = responses[0];
        const outcomeResponse = responses[1];

        const incomeData = incomeResponse.data.data;
        const outcomeData = outcomeResponse.data.data;

        setIncomes(incomeData);
        setOutcomes(outcomeData);
      })
      .catch((errors) => {
        const incomeError = errors[0];
        const outcomeError = errors[1];

        console.error('Failed to fetch incomes:', incomeError);
        console.error('Failed to fetch outcomes:', outcomeError);
      });
  }, []);

  return (
    <>
      <Breadcrumb pageName="Recap" />
      <div className="flex">
        <div className='flex-1 p-2'>          
          <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              
              
              {/* Include the ListRecap component here */}
              <ListRecap incomes={incomes} outcomes={outcomes} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recap;

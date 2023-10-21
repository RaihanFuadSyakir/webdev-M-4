"use client"
import LineChart from '@/components/Dashboard/LineChart';
import LineChartIncome from '@/components/Dashboard/LineChartIncome';
import IncomeInput from '@/components/income/IncomeInput';
import OutcomeInput from '@/components/outcome/OutcomeInput';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type';
import { Button } from '@mui/material';
import { AxiosResponse } from 'axios';
// No code changes needed. Run `npm install axios @types/axios` in the terminal to install required packages.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';

export default function Dashboard() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [showIncomeInput, setShowIncomeInput] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipIncome = () => {
    setIsFlipped(true);
  };

  const handleFlipOutcome = () => {
    setIsFlipped(false);
  };

  console.log(username);
  useEffect(() => {
    axiosInstance.get('/users/personal')
      .then((response: AxiosResponse<dbResponse<User>>) => {
        setUsername(response.data.data.username);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        router.push('/login')
      })
  }, [])
  return (
    <div>
      <div className='flex-initial mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default'>
        <div className='flex'>
          <div>
            <div className='text-center'>
              <Button 
                onClick={handleFlipOutcome} 
                className='m-2 bg-blue-400 text-white hover:bg-blue-700'
                color='primary'
              >
                Income
              </Button>
              <Button 
                onClick={handleFlipIncome}  
                className='m-2 bg-red-400 text-white hover:bg-red-700'
                color='secondary'
              >
                Outcome
              </Button>
            </div>
            <div>
              <ReactCardFlip isFlipped={isFlipped}>
                <div key='front'>
                  <h1 className='text-center font-bold text-xl'>Quick Income</h1>
                  <IncomeInput />
                </div>
                <div key='back'>
                  <h1 className='text-center font-bold text-xl'>Quick Outcome</h1>
                  <OutcomeInput />
                </div>
              </ReactCardFlip>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-100">
        <div className="w-1/2 p-4 rounded-lg">
          <div style={{ width: '100%', height: '300px' }}>
            <LineChart />
          </div>
        </div>
        <div className="w-1/2 p-4 rounded-lg">
          <div style={{ width: '100%', height: '300px' }}>
            <LineChartIncome />
          </div>
        </div>
      </div>
    </div>
  );
}
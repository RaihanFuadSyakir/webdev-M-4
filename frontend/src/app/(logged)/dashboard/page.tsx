"use client"
import LineChart from '@/components/Dashboard/LineChart';
import LineChartIncome from '@/components/Dashboard/LineChartIncome';
import IncomeInput from '@/components/income/IncomeInput';
import OutcomeInput from '@/components/outcome/OutcomeInput';
import BarChartReport from '@/components/Dashboard/BarChartReport';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Income, Outcome, User, dbResponse } from '@/utils/type';
import { Button } from '@mui/material';
import { AxiosResponse } from 'axios';
// No code changes needed. Run `npm install axios @types/axios` in the terminal to install required packages.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import PieChartWallet from '@/components/Dashboard/PieChartWallet';
import ReactCardFlip from 'react-card-flip';
import ListIncomes from '@/components/income/ListIncome';
import ListOutcomes from '@/components/outcome/ListOutcomes';

// ... imports ...

export default function Dashboard() {
  const [activeButton, setActiveButton] = useState('all');
  const [selectedChart, setSelectedChart] = useState('all');
  const [showIncomeInput, setShowIncomeInput] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const limitedOutcomes = outcomes.slice(-5);
  const limitedIncomes = incomes.slice(-5);

  const handleLinkClick = (chart: SetStateAction<string>) => {
    setSelectedChart(chart);
    setActiveButton(chart);
  };

  const handleFlipIncome = () => {
    setIsFlipped(true);
  };

  const handleFlipOutcome = () => {
    setIsFlipped(false);
  };

  useEffect(() => {
    axiosInstance.get('/users/personal')
      .then((response: AxiosResponse<dbResponse<User>>) => {
        setUsername(response.data.data.username);
      })
      .catch((error) => {
        console.log(error);
        router.push('/login');
      });
  }, []);

    // Fetch Incomes data when the component mounts
    useEffect(() => {
      axiosInstance
        .get(`/incomes/user`) // Replace with your actual endpoint
        .then((response: AxiosResponse<dbResponse<Income[]>>) => {
          const res: dbResponse<Income[]> = response.data;
          setIncomes(res.data);
        })
        .catch((error) => {
          console.error('Failed to fetch incomes:', error);
        });
    }, []);

    useEffect(() => {
      axiosInstance
        .get(`${BACKEND_URL}/api/outcomes/`) // Replace with your actual endpoint
        .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
          const res: dbResponse<Outcome[]> = response.data;
          setOutcomes(res.data);
        })
        .catch((error) => {
          console.error('Failed to fetch outcomes:', error);
        });
    }, []);

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'all':
        return (
          <>
            <div className="p-2 rounded-lg mb-4 mx-auto">
              <BarChartReport />
            </div>
            <div className="flex">
              <div className="p-2 rounded-lg flex-1">
                <LineChart />
              </div>
              <div className="p-2 rounded-lg ml-4 flex-1">
                <LineChartIncome />
              </div>
            </div>
            <div className="flex">
              <div className="p-2 rounded-lg ml-4 flex-1">
                <PieChartWallet />
              </div>
            </div>
          </>
        );
      case 'wallet':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <PieChartWallet />
          </div>
        );
      case 'outcomes':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <LineChart />
          </div>
        );
      case 'incomes':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <LineChartIncome />
          </div>
        );
      // Add other cases for different charts if needed
      default:
        return null;
    }
  };

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
                  <div className='flex'>
                    <div className='p-2'>
                      <h1 className='text-center font-bold text-xl'>Quick Income</h1>
                      <IncomeInput />
                    </div>
                    <div className='p-2 ml-26'>
                    <h1 className='text-center font-bold text-xl pb-2'>Recent Income</h1>
                      <ListIncomes incomes={limitedIncomes} setIncomes={setIncomes}/>
                    </div>
                  </div>
                </div>
                <div key='back'>
                  <div className='flex'>
                    <div className='p-2'>
                      <h1 className='text-center font-bold text-xl'>Quick Outcome</h1>
                      <OutcomeInput />
                    </div>
                    <div className='p-2 ml-15'>
                    <h1 className='text-center font-bold text-xl pb-2'>Recent Outcome</h1>
                      <ListOutcomes outcomes={limitedOutcomes} setOutcomes={setOutcomes} />
                    </div>
                  </div>
                </div>
              </ReactCardFlip>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-slate-700 flex justify-center text-white'>
        <button
          onClick={() => handleLinkClick('all')}
          className={`m-2 text-blue ${activeButton === 'all' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  All  
        </button>
        <button
          onClick={() => handleLinkClick('wallet')}
          className={`m-2 text-blue ${activeButton === 'wallet' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Wallet  
        </button>
        <button
          onClick={() => handleLinkClick('outcomes')}
          className={`m-2 text-blue ${activeButton === 'outcomes' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Outcome  
        </button>
        <button
          onClick={() => handleLinkClick('incomes')}
          className={`m-2 text-blue ${activeButton === 'incomes' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Income  
        </button>
        <button onClick={() => handleLinkClick('budget')} className='m-2'>Budget</button>
        <button onClick={() => handleLinkClick('categories')} className='m-2'>Categories</button>
      </div>
      <h2 style={{ textAlign:'center', fontSize: '2rem', color: '#ffff', fontStyle: 'italic', marginBottom: '1rem' }}>Hello {username} !</h2>

      <div className="flex flex-col bg-gray-100">
        {renderSelectedChart()}
      </div>
    </div>
  );
}

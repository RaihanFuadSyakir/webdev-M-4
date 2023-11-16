import React, { useEffect, useState } from 'react';
import { Budget, dbResponse, Category } from '@/utils/type';
import { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from '@/utils/fetchData';
import { Card, Progress, Dropdown, Menu, Button } from 'antd';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BudgetLeft = () => {
  const [budgets, setBudgets] = useState<Budget[] | undefined>();
  const [category, setCategory] = useState<string>('All');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance.get('/budgets/')
      .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
        const data = response.data.data;
        setBudgets(data);
        setLoading(false);
      })
      .catch((err_res: AxiosError<dbResponse<Budget>>) => {
        console.error('Error fetching budgets:', err_res.response?.data);
        setLoading(false);
      });

    axiosInstance.get('/categories/user')
      .then((response: AxiosResponse<dbResponse<Category[]>>) => {
        const categories = response.data.data;
        setCategories(categories);
      })
      .catch((err: AxiosError) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const categoryMenu = (
    <Menu onClick={({ key }) => handleCategoryChange(key)}>
      <Menu.Item key="All">All</Menu.Item>
      {categories.map((cat) => (
        <Menu.Item key={cat.category_name}>{cat.category_name}</Menu.Item>
      ))}
    </Menu>
  );

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className='bg-white rounded-sm border border-stroke shadow-default overflow-auto min-h-50 max-h-60 w-100'>
      <div className='flex p-3 sticky top-0 justify-between z-1 bg-white'>
        <h2 className='font-bold text-xl'>Budget Savings</h2>
        {/* <div>
          <Dropdown overlay={categoryMenu}>
            <Button>
              {category || 'Choose a Category'}
            </Button>
          </Dropdown>
        </div> */}
      </div>
      <div>
        {loading ? (
          <p>Loading budgets...</p>
        ) : (
          budgets?.map((budget) => (
            category === 'All' ? (
              <Card
                key={`${budget.year}-${budget.month}`}
                title={`Budget for ${months[budget.month - 1]} ${budget.year}`}
                style={{ width: 300, margin: '10px auto' }}
              >
                <p>
                  {budget.current_budget < 0 ?
                    `You've exceeded the budget by ${formatRupiah(budget.current_budget * -1)}`
                    :
                    `Budget left to spend ${formatRupiah(budget.current_budget)}`
                  }
                </p>
                <Progress
                  percent={Math.abs(100 - (budget.current_budget / budget.total_budget) * 100)}
                  status={budget.current_budget < 0 ? 'exception' : 'active'}
                />
              </Card>
            ) : null
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetLeft;

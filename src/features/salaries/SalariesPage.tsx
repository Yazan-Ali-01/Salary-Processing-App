// src/features/salaries/SalariesPage.tsx
import React from 'react';
import { SalaryTable } from '@/features/salaries/components/SalaryTable';
import useStore from '@/store/useStore';

const SalariesPage: React.FC = () => {
  const { employees } = useStore(state => ({
    employees: state.employees,
  }));

  return (
    <div className='flex flex-col px-8 max-h-screen'>
      <div className='flex justify-between items-center mr-10 my-4'>
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight ">
          Salaries Table
        </h2>
      </div>
      <SalaryTable employees={employees} />
    </div>
  );
};

export default SalariesPage;

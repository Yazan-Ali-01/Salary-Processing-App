// src/features/salaries/SalariesPage.tsx
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SalariesProcessingTable } from './components/SalariesProcessingTable';
import useStore from '@/store/useStore';

const SalariesProcessingPage: React.FC = () => {

  const { salaryRecords } = useStore(state => ({
    salaryRecords: state.salaryRecords,
  }));

  return (
    <div className='flex flex-col px-8 max-h-screen'>
      <div className='flex justify-between  items-center my-4 w-full'>
        <NavLink to='/salaries'>
          <div className='flex justify-center items-center opacity-90 hover:opacity-100 hover:scale-105'>
            <ArrowLeft size={20} />
            <Button variant="link" className='underline'>Go Back To Salaries</Button>
          </div>
        </NavLink>
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight mr-8">
          Salaries Processing Table
        </h2>
      </div>
      <SalariesProcessingTable salaryRecords={salaryRecords} />
    </div>
  );
};

export default SalariesProcessingPage;

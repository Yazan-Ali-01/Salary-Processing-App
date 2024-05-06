// src/features/salaries/SalariesPage.tsx
import React from 'react';
import { PaymentHistoryTable } from './components/PaymentHistoryTable';
import useStore from '@/store/useStore';
import { Button } from '@/components/ui/button';

const PaymentHistoryPage: React.FC = () => {
  const { paymentHistories } = useStore(state => ({
    paymentHistories: state.paymentHistories,
  }));

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className='flex flex-col px-8 max-h-screen'>
      <div className='flex justify-between items-center mr-2 my-4'>
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight ">
          Payment History
        </h2>
        <Button onClick={handlePrint} variant="outline" className='hover:bg-slate-100'>Print Payments</Button>
      </div>
      <PaymentHistoryTable paymentHistories={paymentHistories} />
    </div>
  );
};

export default PaymentHistoryPage;

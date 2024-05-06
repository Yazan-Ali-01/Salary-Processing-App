import React from 'react';
import { LoginForm } from '@/features/login/components/LoginForm';
import { LoginCarousel } from '@/features/login/components/LoginCarousel';
const LoginPage: React.FC = () => {
  return (
    <>
      <img src="https://sso.eu.edenredcdn.com/assets/core/images/logos/edenred.svg?v=we104uGGquP0z-0DZS4FfrgGBz7lRPURCLJ35xb2uMA" alt="edenRed-Payroll-System-Logo" className='h-24 w-24 fixed top-2 ml-20 z-50' />
      <div className="flex h-screen w-full">
        <div className="w-1/2 flex flex-col justify-center items-start px-24 mt-24">
          <h2 className="text-4xl font-extrabold text-slate-900/90 mb-8">Log In</h2>
          <LoginForm />
        </div>
        <div className="w-1/2 bg-[#EA6257] flex justify-center items-center">
          <LoginCarousel />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

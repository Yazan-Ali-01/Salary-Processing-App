import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/features/home/HomePage';
import PrivateRoute from '@/routes/PrivateRoute';
import { LoginPage } from '@/features/login';
import { RegisterPage } from '@/features/register';
import PrivateLayout from '@/routes/PrivateLayout';
import { EmployeesPage } from '@/features/employees';
import { SalariesPage, SalariesProcessingPage } from '@/features/salaries';
import { PaymentHistoryPage } from '@/features/payment';
// import AboutPage from '@/features/about/AboutPage';
// import NotFoundPage from '@/features/notFound/NotFoundPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        {/* Once authenticated, render the layout that includes the sidebar */}
        <Route element={<PrivateLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/employees' element={<EmployeesPage />} />
          <Route path='/salaries' element={<SalariesPage />} />
          <Route path='/salaries-processing' element={<SalariesProcessingPage />} />
          <Route path='/payment-history' element={<PaymentHistoryPage />} />
          {/* Add more private routes here that are children of the private layout */}
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;

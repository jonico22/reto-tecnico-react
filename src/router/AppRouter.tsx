import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import HomePage from '../pages/HomePage/HomePage';
import PlansPage from '../pages/PlansPage/PlansPage';
import QuoteSummaryPage from '../pages/QuoteSummaryPage/QuoteSummaryPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path='planes' element={<PlansPage />} /> 
          <Route path="resumen" element={<QuoteSummaryPage />} />
          <Route path="*" element={<NotFoundPage />} />  
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
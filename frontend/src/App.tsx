import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Sellers from './pages/Sellers';
import SellerDetail from './pages/SellerDetail';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 container max-w-screen-lg mx-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/sellers" element={<Sellers />} />
            <Route path="/dashboard/sellers/:id" element={<SellerDetail />} />
			
			{/* Seller */}
			<Route path="/dashboard/sellers/:id/seller-dashboard" element={<SellerDashboard />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
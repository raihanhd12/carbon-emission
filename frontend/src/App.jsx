import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SellerDashboard from "./pages/seller/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import BuyerDashboard from "./pages/buyer/Dashboard";
import Sellers from "./pages/buyer/Sellers";
import SellerDetail from "./pages/buyer/SellerDetail";

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 container max-w-screen-lg mx-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Seller */}
            <Route
              path="/dashboard/sellers/:id/seller-dashboard"
              element={<SellerDashboard />}
            />
            {/* Admin */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            {/* Buyer */}
            <Route path="/dashboard/buyer/" element={<BuyerDashboard />} />
            <Route path="/dashboard/buyer/sellers" element={<Sellers />} />
            <Route
              path="/dashboard/buyer/sellers/:id"
              element={<SellerDetail />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

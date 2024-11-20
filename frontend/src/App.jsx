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
import Certificates from "./pages/buyer/Certificates";
import CertificateDetail from "./pages/buyer/CertificateDetail";

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Seller */}
            <Route
              path="/dashboard/sellers/:address"
              element={<SellerDashboard />}
            />
            {/* Admin */}
            <Route
              path="/dashboard/admin/:address"
              element={<AdminDashboard />}
            />
            {/* Buyer */}
            <Route
              path="/dashboard/buyer/:address"
              element={<BuyerDashboard />}
            />
            <Route path="/dashboard/buyer/sellers" element={<Sellers />} />
            <Route
              path="/dashboard/buyer/sellers/:id/:submissionId"
              element={<SellerDetail />}
            />
            <Route
              path="/dashboard/buyer/certificates/:address"
              element={<Certificates />}
            />
            <Route
              path="/dashboard/buyer/certificates/:address/:submissionId"
              element={<CertificateDetail />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

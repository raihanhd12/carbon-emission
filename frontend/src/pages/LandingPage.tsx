// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { Navigate } from 'react-router-dom';
import { client } from "../client";

const LandingPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  if (isConnected) {
    return <Navigate to="/dashboard" />;
  }

  const handleConnect = (wallet: any) => {
    console.log("Wallet connected:", wallet);
    setIsConnected(true);
  };

  return (
    <div className="py-20">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        Welcome to <span className="text-violet-500">CarbonEmission</span>
      </h1>
      <p className="text-zinc-300 text-base mb-8">
        Track and manage your carbon footprint with blockchain technology.
      </p>
    </div>
  );
};

export default LandingPage;
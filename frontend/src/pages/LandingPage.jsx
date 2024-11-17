import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Shield,
  BarChart3,
  Award,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isConnected) {
    return <Navigate to="/dashboard" />;
  }

  const handleConnect = (wallet) => {
    console.log("Wallet connected:", wallet);
    setIsConnected(true);
  };

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-400" />,
      title: "Carbon Credit Trading",
      description:
        "Trade carbon credits securely and transparently on the blockchain",
    },
    {
      icon: <Shield className="w-8 h-8 text-violet-400" />,
      title: "Verified Emissions",
      description:
        "Get your carbon emissions verified by authorized institutions",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Real-time Tracking",
      description:
        "Monitor your carbon footprint in real-time with detailed analytics",
    },
  ];

  const benefits = [
    "Transparent carbon credit verification",
    "Immutable blockchain records",
    "Automated compliance reporting",
    "Real-time emission monitoring",
    "Secure trading platform",
    "Environmental impact tracking",
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-violet {
          animation: pulse 2s infinite;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-[url('/api/placeholder/1920/600')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 to-zinc-900/90" />
        <div
          className={`container mx-auto px-4 py-32 relative transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-zinc-100 animate-float">
              Welcome to <span className="text-violet-500">CarbonEmission</span>
            </h1>
            <p
              className="text-xl text-zinc-300 mb-8 slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Revolutionizing carbon credit management through blockchain
              technology. Track, verify, and trade carbon emissions with
              complete transparency.
            </p>
            <button className="inline-flex items-center px-8 py-4 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-all duration-300 text-lg animate-pulse-violet hover:scale-105 transform">
              Get Started
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-24 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-violet-400 mb-4 slide-up">
              Why Choose CarbonEmission?
            </h2>
            <p
              className="text-xl text-zinc-300 slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Leading the way in blockchain-based carbon credit management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-violet-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/20 slide-up"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="mb-6 bg-zinc-700/30 w-16 h-16 rounded-full flex items-center justify-center transform transition-transform duration-500 hover:rotate-12">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full py-24 bg-[url('/api/placeholder/1920/600')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-zinc-900/80" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { number: "100+", label: "Companies Registered" },
              { number: "50K+", label: "Carbon Credits Traded" },
              { number: "1M+", label: "Tons CO2 Offset" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-12 bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-zinc-700/30 hover:border-violet-500/30 transition-all duration-500 transform hover:scale-105 slide-up"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="text-5xl font-bold text-violet-400 mb-4">
                  {stat.number}
                </div>
                <div className="text-xl text-zinc-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full py-24 bg-gradient-to-b from-zinc-900 to-zinc-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-violet-400 mb-4 slide-up">
              Platform Benefits
            </h2>
            <p
              className="text-xl text-zinc-300 slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Everything you need to manage your carbon credits effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-violet-500/50 transition-all duration-300 transform hover:-translate-y-1 slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-24 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-500/20 to-green-500/20 rounded-2xl p-16 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6 slide-up">
                Ready to Start Your Carbon Credit Journey?
              </h2>
              <p
                className="text-xl text-zinc-300 mb-12 slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                Join the growing network of companies managing their carbon
                footprint with blockchain technology. Get started today and
                contribute to a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="px-8 py-4 rounded-lg bg-violet-500 text-white text-lg font-semibold hover:bg-violet-600 transition-all duration-300 transform hover:scale-105 animate-pulse-violet">
                  Connect Wallet
                </button>
                <button className="px-8 py-4 rounded-lg bg-zinc-700 text-white text-lg font-semibold hover:bg-zinc-600 transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in">
            <h3 className="text-2xl font-bold text-violet-400 mb-4">
              CarbonEmission
            </h3>
            <p className="text-zinc-400">
              Revolutionizing carbon credit management through blockchain
              technology
            </p>
            <div className="mt-8 text-zinc-500">
              &copy; 2024 CarbonEmission. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { useFetchSubmission, useFetchUserData } from "../../contracts/others";
import {
  Search,
  Filter,
  Building2,
  User2,
  Wallet,
  Scale,
  Calendar,
  CheckCircle2,
} from "lucide-react";

// SellerCard Component
const SellerCard = ({ seller }) => {
  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  const sellerAddress = seller.sellerAddress;

  const { data: userData, isLoading: userDataLoading } =
    useFetchUserData(sellerAddress);

  let name = "N/A";
  let company = "N/A";

  if (userData && Array.isArray(userData) && userData.length >= 3) {
    name = userData[1];
    company = userData[2];
  }

  return (
    <Link
      to={`/dashboard/buyer/sellers/${seller.sellerAddress}/${seller.submissionId}`}
      className="block transform transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative bg-zinc-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-zinc-700/50 hover:border-violet-500/50 transition-all duration-300">
        <div className="absolute top-4 right-4">
          <div className="flex items-center bg-green-400/20 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400 text-sm font-medium">Verified</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <User2 className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              <div className="flex items-center text-zinc-400 text-sm">
                <Building2 className="w-4 h-4 mr-1" />
                {company}
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center space-x-2 bg-zinc-900/50 px-3 py-2 rounded-lg">
            <Wallet className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400 font-mono text-sm">
              {formatAddress(seller.sellerAddress)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-zinc-900/30 p-3 rounded-lg">
              <div className="text-sm text-zinc-400 mb-1">Emission</div>
              <div className="text-violet-400 font-semibold flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                {seller.verifiedAmount.toString()} tons
              </div>
            </div>
            <div className="bg-zinc-900/30 p-3 rounded-lg">
              <div className="text-sm text-zinc-400 mb-1">Price</div>
              <div className="text-violet-400 font-semibold">
                {seller.verifiedPrice} ETH
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center text-zinc-400 text-sm mt-4">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(Number(seller.timestamp) * 1000).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

const Sellers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [submissionData, setSubmissionData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    data: fetchedData,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmission();

  useEffect(() => {
    if (fetchedData && fetchedData.length > 1) {
      const sellers = fetchedData[0] || [];
      const submissions = fetchedData[1] || [];

      const verifiedSubmissions = submissions
        .filter((submission) => submission.verified)
        .map((submission, index) => ({
          ...submission,
          sellerAddress: sellers[index],
        }));

      setSubmissionData(verifiedSubmissions);
      setIsLoaded(true);
    }
  }, [fetchedData]);

  const filteredSubmissions = submissionData.filter(
    (submission) =>
      submission.sellerAddress
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" ||
        (statusFilter === "verified" && submission.verifiedAmount > 0))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 py-10 px-4">
      <style jsx>{`
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
        .animate-slide-up {
          animation: slideUp 0.5s ease forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <Breadcrumb />
          <h2 className="text-4xl font-bold mb-4 text-white">
            Verified Sellers
          </h2>
          <p className="text-zinc-400 text-lg">
            Browse and connect with verified carbon credit sellers
          </p>
        </div>

        {/* Search and Filter Section */}
        <div
          className="mb-8 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-700/50 text-white placeholder-zinc-400 border border-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="relative min-w-[150px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-700/50 text-white border border-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {submissionDetailsLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        )}

        {submissionDetailsError && (
          <div className="text-center p-12 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-red-400">Error fetching submissions data.</p>
          </div>
        )}

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((seller, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <SellerCard seller={seller} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {isLoaded && filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-zinc-800/50 rounded-xl p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No sellers found
              </h3>
              <p className="text-zinc-400">
                Try adjusting your search criteria or check back later for new
                listings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;

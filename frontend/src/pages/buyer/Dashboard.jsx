import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { useFetchSubmission } from "../../contracts/others";
import {
  TrendingUp,
  Clock,
  ChevronRight,
  Wallet,
  Scale,
  DollarSign,
  CalendarDays,
  ArrowUpRight,
  Loader,
} from "lucide-react";

const StatCard = ({ title, value, change }) => (
  <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
    <h3 className="text-zinc-400 text-sm mb-2">{title}</h3>
    <div className="text-2xl font-bold text-white mb-2">{value}</div>
    {change && (
      <div className="flex items-center text-sm text-green-400">
        <TrendingUp className="w-4 h-4 mr-1" />
        {change} from last month
      </div>
    )}
  </div>
);

const SubmissionCard = ({ submission, formatAddress, convertWeiToEth }) => (
  <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden hover:border-violet-500/50 transition-all duration-300 transform hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-500/20 rounded-lg">
            <Wallet className="w-5 h-5 text-violet-400" />
          </div>
          <span className="font-mono text-sm text-zinc-400">
            {formatAddress(submission.sellerAddress)}
          </span>
        </div>
        <Link
          to={`/dashboard/buyer/sellers/${submission.sellerAddress}/${submission.submissionId}`}
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-900/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-zinc-400 mb-1">
            <Scale className="w-4 h-4 mr-1" />
            Verified Amount
          </div>
          <div className="text-lg font-semibold text-green-400">
            {submission.verifiedAmount.toString()} tons
          </div>
        </div>
        <div className="bg-zinc-900/50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-zinc-400 mb-1">
            <DollarSign className="w-4 h-4 mr-1" />
            Verified Price
          </div>
          <div className="text-lg font-semibold text-violet-400">
            {convertWeiToEth(submission.verifiedPrice.toString())} ETH
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm text-zinc-400">
        <CalendarDays className="w-4 h-4 mr-1" />
        {new Date(Number(submission.timestamp) * 1000).toLocaleDateString()}
      </div>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, linkText }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-zinc-800 rounded-lg">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <Link
      to="/dashboard/buyer/sellers"
      className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
    >
      {linkText}
      <ChevronRight className="w-4 h-4 ml-1" />
    </Link>
  </div>
);

const Dashboard = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  const convertWeiToEth = (wei) => (Number(wei) / 1e18).toFixed(4);

  const {
    data: fetchedData,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmission();

  useEffect(() => {
    if (fetchedData && fetchedData.length > 1) {
      const sellers = fetchedData[0];
      const submissions = fetchedData[1];

      const verifiedSubmissions = submissions
        .filter((submission) => submission.verified)
        .map((submission, index) => ({
          ...submission,
          sellerAddress: sellers[index],
        }));

      setSubmissionData(verifiedSubmissions);
    }
  }, [fetchedData]);

  const topVerifiedSubmissions = submissionData
    .slice()
    .sort((a, b) => Number(b.verifiedAmount) - Number(a.verifiedAmount))
    .slice(0, 3);

  const latestSubmissions = submissionData
    .slice()
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  const totalVerifiedAmount = submissionData.reduce(
    (acc, sub) => acc + Number(sub.verifiedAmount),
    0
  );

  if (submissionDetailsLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-violet-400 animate-spin mb-4" />
          <p className="text-zinc-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (submissionDetailsError) {
    return (
      <div className="min-h-screen bg-zinc-900 p-8">
        <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20 text-center">
          <p className="text-red-400">Error fetching submissions data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumb />
          <h1 className="text-4xl font-bold text-white mb-6">
            Buyer Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Total Verified Emissions"
              value={`${totalVerifiedAmount} tons`}
              change="+12.5%"
            />
            <StatCard
              title="Active Sellers"
              value={submissionData.length}
              change="+5.2%"
            />
            <StatCard
              title="Total Transactions"
              value={submissionData.length}
              change="+8.1%"
            />
          </div>

          {/* Top Verified Amount Section */}
          <div className="mb-12">
            <SectionHeader
              icon={TrendingUp}
              title="Top Verified Emissions"
              linkText="View All Sellers"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topVerifiedSubmissions.length > 0 ? (
                topVerifiedSubmissions.map((submission, index) => (
                  <SubmissionCard
                    key={index}
                    submission={submission}
                    formatAddress={formatAddress}
                    convertWeiToEth={convertWeiToEth}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <p className="text-zinc-400">No top submissions found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Verified Submissions Section */}
          <div>
            <SectionHeader
              icon={Clock}
              title="Latest Verifications"
              linkText="View All Sellers"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestSubmissions.length > 0 ? (
                latestSubmissions.map((submission, index) => (
                  <SubmissionCard
                    key={index}
                    submission={submission}
                    formatAddress={formatAddress}
                    convertWeiToEth={convertWeiToEth}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <p className="text-zinc-400">No latest submissions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

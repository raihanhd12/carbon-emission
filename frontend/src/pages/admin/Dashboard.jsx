import React, { useState, useEffect } from "react";
import { useFetchSubmission } from "../../contracts/others";
import VerifyCarbon from "./VerifyCarbon";
import { toast } from "react-hot-toast";
import { ArrowUpDown, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [unverifiedData, setUnverifiedData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const convertWeiToEth = (wei) => (Number(wei) / 1e18).toString();

  // Helper function to safely truncate addresses
  const truncateAddress = (address) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const {
    data: fetchedData,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmission();

  useEffect(() => {
    if (fetchedData && fetchedData.length > 1) {
      const sellers = fetchedData[0];
      const submissions = fetchedData[1];

      const filteredData = submissions
        .map((submission, index) => ({
          seller: sellers[index] || "Unknown",
          submissionId: submission.submissionId.toString(),
          amount: submission.amount.toString(),
          pricePerTon: submission.price.toString(),
          verified: submission.verified,
          timestamp: new Date(
            Number(submission.timestamp) * 1000
          ).toLocaleString(),
        }))
        .filter((submission) => !submission.verified);

      setUnverifiedData(filteredData);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (fetchedData && fetchedData.length > 1) {
      const sellers = fetchedData[0];
      const submissions = fetchedData[1];

      const filteredVerifiedData = submissions
        .map((submission, index) => ({
          seller: sellers[index] || "Unknown",
          submissionId: submission.submissionId.toString(),
          verifiedAmount: submission.verifiedAmount.toString(),
          verifiedPrice: submission.verifiedPrice.toString(),
          verifier: submission.verifier || "Unknown",
          blockNumber: submission.blockNumber,
          verified: submission.verified,
          timestamp: new Date(
            Number(submission.timestamp) * 1000
          ).toLocaleString(),
        }))
        .filter((submission) => submission.verified);

      setVerifiedData(filteredVerifiedData);
    }
  }, [fetchedData]);

  const LoadingState = () => (
    <div className="flex items-center justify-center p-8 text-gray-400">
      <Clock className="w-6 h-6 animate-spin mr-2" />
      <span>Loading data...</span>
    </div>
  );

  const EmptyState = ({ message, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center p-12 text-gray-400">
      <div className="bg-zinc-700/30 rounded-full p-4 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-lg">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-violet-400 mb-3">
              Carbon Credit Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and verify carbon credit submissions
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Total Submissions</h3>
                <ArrowUpDown className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {unverifiedData.length + verifiedData.length}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Pending Verification</h3>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {unverifiedData.length}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Verified Credits</h3>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {verifiedData.length}
              </p>
            </div>
          </div>

          {/* Unverified Submissions Section */}
          <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700/50">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-400" />
                Pending Submissions
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto rounded-lg border border-zinc-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-700/50">
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Submission ID
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Amount (tons)
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Price per Ton
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {submissionDetailsLoading ? (
                      <tr>
                        <td colSpan={6}>
                          <LoadingState />
                        </td>
                      </tr>
                    ) : unverifiedData.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <EmptyState
                            message="No pending submissions to verify"
                            icon={AlertCircle}
                          />
                        </td>
                      </tr>
                    ) : (
                      unverifiedData.map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-zinc-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300">
                            {submission.submissionId}
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-mono">
                            {truncateAddress(submission.seller)}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.amount}
                          </td>
                          <td className="px-6 py-4 text-violet-400">
                            {convertWeiToEth(submission.pricePerTon)} ETH
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.timestamp}
                          </td>
                          <td className="px-6 py-4">
                            <VerifyCarbon
                              submission={submission}
                              onVerify={() =>
                                toast.success(
                                  `Successfully verified ${submission.amount} tons of carbon`
                                )
                              }
                              onError={(errorMessage) =>
                                toast.error(errorMessage)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Verified Submissions Section */}
          <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700/50">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                Verified Submissions
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto rounded-lg border border-zinc-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-700/50">
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Submission ID
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Verified Amount
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Verified Price
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {submissionDetailsLoading ? (
                      <tr>
                        <td colSpan={6}>
                          <LoadingState />
                        </td>
                      </tr>
                    ) : verifiedData.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <EmptyState
                            message="No verified submissions found"
                            icon={AlertCircle}
                          />
                        </td>
                      </tr>
                    ) : (
                      verifiedData.map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-zinc-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300">
                            {submission.submissionId}
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-mono">
                            {truncateAddress(submission.seller)}
                          </td>
                          <td className="px-6 py-4 text-green-400">
                            {submission.verifiedAmount} tons
                          </td>
                          <td className="px-6 py-4 text-violet-400">
                            {convertWeiToEth(submission.verifiedPrice)} ETH
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.timestamp}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

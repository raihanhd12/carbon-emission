import React, { useState, useEffect } from "react";
import { useFetchUnverifiedSubmissions } from "../../contracts/admin";
import VerifyCarbon from "./VerifyCarbon";
import { getCarbonVerifiedEvents } from "../../contracts/events";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [unverifiedSubmissions, setUnverifiedSubmissions] = useState([]);
  const [verifiedSubmissions, setVerifiedSubmissions] = useState([]);
  const [loadingUnverified, setLoadingUnverified] = useState(true);
  const [loadingVerified, setLoadingVerified] = useState(true);
  const [ethRate, setEthRate] = useState(0);

  const { data: submissionsData, error: submissionsError } =
    useFetchUnverifiedSubmissions();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const convertToEth = (amountInRupiah) =>
    (amountInRupiah / ethRate).toFixed(6);

  // Fetch ETH to Rupiah exchange rate
  useEffect(() => {
    const fetchEthRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr"
        );
        const data = await response.json();
        setEthRate(data.ethereum.idr);
      } catch (error) {
        console.error("Error fetching ETH rate:", error);
        toast.error("Error fetching ETH rate. Please try again later.");
      }
    };
    fetchEthRate();
  }, []);

  // Fetch verified submissions
  useEffect(() => {
    const fetchVerifiedEvents = async () => {
      try {
        const verifiedEvents = await getCarbonVerifiedEvents();
        const sortedVerifiedEvents = verifiedEvents.sort((a, b) => b.id - a.id); // Sort descending by ID

        setVerifiedSubmissions(sortedVerifiedEvents);
        setLoadingVerified(false);
      } catch (error) {
        toast.error(
          "Error fetching verified submissions. Please try again later."
        );
        console.error("Verified Events Error:", error);
      }
    };
    fetchVerifiedEvents();
  }, []);

  // Fetch unverified submissions
  useEffect(() => {
    if (submissionsError) {
      toast.error(
        "Error fetching unverified submissions. Please try again later."
      );
      console.error("Submissions Error:", submissionsError);
    } else if (submissionsData) {
      const processedSubmissions = submissionsData.map((submission, index) => ({
        submissionId: submission.id ? submission.id.toString() : `ID-${index}`,
        seller: submission.seller || "Unknown",
        amount: submission.amount ? submission.amount.toString() : "0",
        pricePerTon: submission.pricePerTon
          ? submission.pricePerTon.toString()
          : "N/A",
        timestamp: submission.timestamp
          ? new Date(
              Number(submission.timestamp.toString()) * 1000
            ).toLocaleString()
          : "Unknown",
      }));
      setUnverifiedSubmissions(processedSubmissions);
      setLoadingUnverified(false);
    }
  }, [submissionsData, submissionsError]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center p-8 text-gray-400">
      <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Loading data...</span>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <div className="text-4xl mb-2">📊</div>
      <p>{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-violet-400 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Manage and verify carbon submissions
            </p>
          </div>
          <div className="bg-zinc-800 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm text-gray-400">Current ETH Rate</p>
            <p className="text-lg font-semibold text-violet-400">
              {ethRate ? formatPrice(ethRate) : "Loading..."}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Unverified Submissions Section */}
          <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                <span className="mr-2">🔄</span>
                Pending Carbon Submissions
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
                        Price per Ton (Wei)
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Price per Ton (ETH)
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {loadingUnverified ? (
                      <tr>
                        <td colSpan={6}>
                          <LoadingState />
                        </td>
                      </tr>
                    ) : unverifiedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <EmptyState message="No pending submissions to verify" />
                        </td>
                      </tr>
                    ) : (
                      unverifiedSubmissions.map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-zinc-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300">
                            {submission.submissionId}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.seller}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.amount}
                          </td>
                          <td className="px-6 py-4 text-violet-400">
                            {submission.pricePerTon === "N/A"
                              ? "N/A"
                              : formatPrice(submission.pricePerTon)}
                          </td>
                          <td className="px-6 py-4 text-violet-400">
                            {submission.pricePerTon === "N/A"
                              ? "N/A"
                              : (submission.pricePerTon / ethRate).toFixed(4) +
                                " ETH"}
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
          <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-semibold text-violet-300 flex items-center">
                <span className="mr-2">✅</span>
                Verified Carbon Submissions
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
                        Verifier
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
                        Verified Price (ETH)
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Block Number
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-300">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {loadingVerified ? (
                      <tr>
                        <td colSpan={7}>
                          <LoadingState />
                        </td>
                      </tr>
                    ) : verifiedSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <EmptyState message="No verified submissions found" />
                        </td>
                      </tr>
                    ) : (
                      verifiedSubmissions.map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-zinc-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300">
                            {submission.id}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {formatAddress(submission.verifier)}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {formatAddress(submission.seller)}
                          </td>
                          <td className="px-6 py-4 text-green-400 font-medium">
                            {submission.verifiedAmount} tons
                          </td>
                          <td className="px-6 py-4 text-violet-400 font-medium">
                            {formatPrice(submission.verifiedPrice)}
                          </td>
                          <td className="px-6 py-4 text-violet-400 font-medium">
                            {convertToEth(submission.verifiedPrice)}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {submission.blockNumber}
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

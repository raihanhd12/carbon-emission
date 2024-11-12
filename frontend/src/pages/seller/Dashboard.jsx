import React, { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import SubmitCarbon from "./SubmitCarbon";
import { toast } from "react-hot-toast";
import {
  useSubmitCarbon,
  useFetchSubmissionsForSeller,
  useFetchSubmissionDetails,
} from "../../contracts/seller";
import { useFetchUserInfo } from "../../contracts/others";

const Dashboard = () => {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const [userInfo, setUserInfo] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  // Fetch submissions details directly using the smart contract getter
  const {
    data: submissionDetails,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmissionDetails(address, submissionId);

  // Fetch submissions directly using the smart contract getter
  const {
    data: contractSubmissions,
    error: submissionsError,
    isLoading: submissionsLoading,
  } = useFetchSubmissionsForSeller(address);

  // Fetch user info
  const { data: userInfoData, error: userInfoError } =
    useFetchUserInfo(address);

  const { submitCarbon } = useSubmitCarbon();

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const formatPrice = (priceInWei) => {
    const priceInEth = Number(priceInWei) / 1e18; // Convert Wei to ETH
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(priceInEth); // Format in IDR
  };

  useEffect(() => {
    // Check if contractSubmissions has data and set the first submissionId if not set
    if (contractSubmissions && contractSubmissions.length > 0) {
      const firstSubmissionId = contractSubmissions[0].id;
      if (!submissionId) {
        setSubmissionId(firstSubmissionId); // Set submissionId to the first one if not set
      }
    }
  }, [contractSubmissions, submissionId, submissionDetails, address]);

  useEffect(() => {
    if (contractSubmissions && contractSubmissions.length > 0) {
      // Urutkan contractSubmissions secara menurun berdasarkan ID
      const sortedSubmissions = [...contractSubmissions].sort(
        (a, b) => Number(b.id) - Number(a.id)
      );
      const latestSubmission = sortedSubmissions[0];
      setSubmissionId(latestSubmission.id);
    }
  }, [contractSubmissions]);

  useEffect(() => {
    if (userInfoData && userInfoData.length >= 2) {
      setUserInfo({ name: userInfoData[0], company: userInfoData[1] });
    }
  }, [userInfoData]);

  if (submissionsError) {
    toast.error("Error fetching submissions. Please try again later.");
    console.error("Submissions Error:", submissionsError);
  }

  if (userInfoError) {
    toast.error("Error fetching user information.");
    console.error("User Info Error:", userInfoError);
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">
          Seller Dashboard
        </h1>
      </div>
    );
  }

  if (submissionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">
          Seller Dashboard
        </h1>
        <p className="text-gray-400">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info Header */}
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-4 text-violet-400">
          Seller Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-300">Name</h2>
            <p className="text-xl font-semibold text-white">
              {userInfo?.name || "Not available"}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-300">Company</h2>
            <p className="text-xl font-semibold text-white">
              {userInfo?.company || "Not available"}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-300">
              Wallet Address
            </h2>
            <p className="text-sm font-mono text-gray-400 break-all">
              {address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Carbon Emission Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Submitted:</span>
              <span className="text-violet-400 font-bold">
                {contractSubmissions?.reduce(
                  (total, sub) => total + Number(sub.amount),
                  0
                ) || 0}{" "}
                tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Verified:</span>
              <span className="text-green-400 font-bold">
                {contractSubmissions?.reduce(
                  (total, sub) => total + Number(sub.verifiedAmount),
                  0
                ) || 0}{" "}
                tons
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Submit New Carbon Emission
          </h2>
          <SubmitCarbon
            address={address}
            hasUnverifiedSubmission={
              contractSubmissions &&
              contractSubmissions.length > 0 &&
              !contractSubmissions[contractSubmissions.length - 1].verified
            }
            onSubmit={async (parsedAmount, parsedPrice) => {
              const success = await submitCarbon(
                parsedAmount,
                parsedPrice,
                (error) => toast.error(error)
              );
              if (success) toast.success("Carbon submission successful!");
            }}
          />
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          Recent Submission Status
        </h2>
        {contractSubmissions && contractSubmissions.length > 0 ? (
          <div className="space-y-2">
            {/* Ambil data dari submission pertama (yang terbaru) */}
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                Most Recent Submission Amount:
              </span>
              <span className="text-violet-400 font-bold">
                {contractSubmissions[0].amount.toString()} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Verified Amount:</span>
              <span className="text-green-400 font-bold">
                {contractSubmissions[0].verifiedAmount.toString()} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Submission Status:</span>
              <span
                className={
                  contractSubmissions[0].verified
                    ? "text-green-400 font-bold"
                    : "text-yellow-400 font-bold"
                }
              >
                {contractSubmissions[0].verified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Submission Date:</span>
              <span className="text-violet-400 font-bold">
                {new Date(
                  Number(contractSubmissions[0].timestamp) * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No recent submissions found.</p>
        )}
      </div>

      {/* Submission Details Table */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          All Submission
        </h2>
        {contractSubmissions && contractSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price Per Ton
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Verified Price
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {contractSubmissions
                  .sort((a, b) => Number(b.id) - Number(a.id)) // Sort by descending ID
                  .map((submission, index) => (
                    <tr
                      key={index}
                      className="hover:bg-zinc-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {submission.id.toString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {submission.amount.toString()} tons
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-violet-400">
                        {submission.pricePerTon.toString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                        {submission.verifiedPrice ? (
                          submission.verifiedPrice.toString()
                        ) : (
                          <span className="text-yellow-400 font-bold">
                            Pending
                          </span>
                        )}{" "}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {submission.verified ? (
                          <span className="text-green-400 font-bold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-yellow-400 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {new Date(
                          Number(submission.timestamp) * 1000
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No submission details found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

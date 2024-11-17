import React, { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import SubmitCarbon from "./SubmitCarbon";
import { toast } from "react-hot-toast";
import { useSubmitCarbon } from "../../contracts/seller";
import { useFetchUserData, useFetchSubmission } from "../../contracts/others";

const Dashboard = () => {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const [submissionId, setSubmissionId] = useState(1);
  const walletAddress = activeAccount?.address;
  const convertWeiToEth = (wei) => (Number(wei) / 1e18).toString();

  const { data: userData, isLoading: userDataLoading } =
    useFetchUserData(walletAddress);

  console.log(userData);

  const {
    data: fetchedData,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmission();

  const [addresses, submissions] = fetchedData || [[], []];

  const submissionDetails = submissions.map((submission, index) => ({
    ...submission,
    seller: addresses[index],
  }));

  const filteredSubmissions = submissionDetails.filter(
    (sub) => sub.seller?.toLowerCase() === walletAddress?.toLowerCase()
  );

  const totalSubmitted = filteredSubmissions?.reduce(
    (acc, sub) => acc + (Number(sub.amount) || 0),
    0
  );

  const totalVerified = filteredSubmissions?.reduce(
    (acc, sub) => acc + (sub.verifiedAmount ? Number(sub.verifiedAmount) : 0),
    0
  );

  // Fixed sorting function for BigInt values
  const sortBySubmissionId = (a, b) => {
    try {
      const idA = BigInt(a.submissionId || 0);
      const idB = BigInt(b.submissionId || 0);
      if (idA < idB) return 1;
      if (idA > idB) return -1;
      return 0;
    } catch (error) {
      return 0;
    }
  };

  const mostRecentSubmission = [...filteredSubmissions].sort(
    sortBySubmissionId
  )[0];

  const isSubmitDisabled =
    mostRecentSubmission &&
    !mostRecentSubmission.verified &&
    mostRecentSubmission.verifiedAmount <= 0;

  const { submitCarbon } = useSubmitCarbon();

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">
          Seller Dashboard
        </h1>
        <p className="text-gray-300">Please connect your wallet.</p>
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
            <p className="text-xl font-semibold text-white">{userData?.[1]}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-300">Company</h2>
            <p className="text-xl font-semibold text-white">{userData?.[2]}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-300">
              Wallet Address
            </h2>
            <p className="text-sm font-mono text-gray-400 break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carbon Emission Summary */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Carbon Emission Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Submitted:</span>
              <span className="text-violet-400 font-bold">
                {totalSubmitted > 0
                  ? `${totalSubmitted.toString()} tons`
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Verified:</span>
              <span
                className={`font-bold ${
                  totalVerified > 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {totalVerified > 0
                  ? `${totalVerified.toString()} tons`
                  : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Form untuk submit carbon */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Submit New Carbon Emission
          </h2>
          <SubmitCarbon address={address} isDisabled={isSubmitDisabled} />
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          Recent Submission Status
        </h2>

        {filteredSubmissions && filteredSubmissions.length > 0 ? (
          (() => {
            const recentSubmission = [...filteredSubmissions].sort(
              sortBySubmissionId
            )[0];

            return (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">
                    Most Recent Submission Amount:
                  </span>
                  <span className="text-violet-400 font-bold">
                    {recentSubmission?.amount
                      ? recentSubmission.amount.toString()
                      : "N/A"}{" "}
                    tons
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Verified Amount:</span>
                  <span
                    className={`font-bold ${
                      recentSubmission?.verifiedAmount &&
                      recentSubmission.verifiedAmount > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {recentSubmission?.verifiedAmount &&
                    recentSubmission.verifiedAmount > 0
                      ? `${recentSubmission.verifiedAmount.toString()} tons`
                      : "Not Verified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Submission Status:</span>
                  <span
                    className={`font-bold ${
                      recentSubmission?.verified
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {recentSubmission?.verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Submission Date:</span>
                  <span className="text-violet-400 font-bold">
                    {recentSubmission?.timestamp
                      ? new Date(
                          Number(recentSubmission.timestamp) * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            );
          })()
        ) : (
          <p className="text-gray-400">No recent submissions found.</p>
        )}
      </div>

      {/* Submission Details Table */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          All Submissions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Price Per Ton
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Verified Amount
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Verified Price
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {filteredSubmissions && filteredSubmissions.length > 0 ? (
                [...filteredSubmissions]
                  .sort(sortBySubmissionId)
                  .map((sub, index) => (
                    <tr
                      key={index}
                      className="hover:bg-zinc-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-white">
                        {sub?.submissionId
                          ? sub.submissionId.toString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {sub?.amount ? sub.amount.toString() : "N/A"} tons
                      </td>
                      <td className="px-4 py-3 text-sm text-violet-400">
                        {sub?.price
                          ? convertWeiToEth(sub.price.toString())
                          : "N/A"}{" "}
                        ETH
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {sub?.verifiedAmount ? (
                          <span className="text-green-400 font-bold">
                            {sub.verifiedAmount.toString()} tons
                          </span>
                        ) : (
                          <span className="text-yellow-400 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sub?.verifiedPrice ? (
                          <span className="text-green-400 font-bold">
                            {convertWeiToEth(sub.verifiedPrice.toString())} ETH
                          </span>
                        ) : (
                          <span className="text-yellow-400 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sub?.verified ? (
                          <span className="text-green-400 font-bold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-yellow-400 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {sub?.timestamp
                          ? new Date(
                              Number(sub.timestamp) * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-4">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

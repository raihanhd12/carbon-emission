import React, { useState, useEffect, useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import SubmitCarbon from "./SubmitCarbon";
import { toast } from "react-hot-toast";
import {
  useSubmitCarbon,
  useFetchSubmissionsForSeller,
} from "../../contracts/seller";

const Dashboard = () => {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const [recentSubmission, setRecentSubmission] = useState(null);

  // Fetch contract submissions for the logged-in address using the new hook
  const {
    data: contractSubmissions,
    error: submissionsError,
    isLoading: submissionsLoading,
  } = useFetchSubmissionsForSeller(address);

  const { submitCarbon } = useSubmitCarbon();

  // Handle errors
  useEffect(() => {
    if (submissionsError) {
      toast.error("Error fetching submissions. Please try again later.");
      console.error("Submissions Error:", submissionsError);
    }
  }, [submissionsError]);

  useEffect(() => {
    if (contractSubmissions && contractSubmissions.length > 0) {
      const processedSubmissions = contractSubmissions.map((submission) => ({
        id: submission.id.toString(),
        amount: submission.amount.toString(),
        verified: submission.verified,
        verifiedAmount: submission.verifiedAmount.toString(),
        timestamp: new Date(
          Number(submission.timestamp.toString()) * 1000
        ).toLocaleString(),
      }));

      const latestSubmission =
        processedSubmissions[processedSubmissions.length - 1];
      setRecentSubmission(latestSubmission);

      if (latestSubmission && !latestSubmission.verified) {
        toast("Your latest submission is pending verification.", {
          icon: "🔔",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      }
    }
  }, [contractSubmissions]);

  const totalSubmitted = useMemo(() => {
    return (
      contractSubmissions?.reduce(
        (total, submission) => total + Number(submission.amount.toString()),
        0
      ) || 0
    );
  }, [contractSubmissions]);

  const totalVerified = useMemo(() => {
    return (
      contractSubmissions?.reduce(
        (total, submission) =>
          total + Number(submission.verifiedAmount.toString()),
        0
      ) || 0
    );
  }, [contractSubmissions]);

  const pendingVerification = useMemo(() => {
    return (
      contractSubmissions?.reduce(
        (total, submission) =>
          !submission.verified ? total + Number(submission.amount) : total,
        0
      ) || 0
    );
  }, [contractSubmissions]);

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
      <h1 className="text-3xl font-bold mb-2 text-violet-400">
        Seller Dashboard
      </h1>
      <p className="text-gray-400 mb-6">Wallet Address: {address}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Carbon Emission Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Submitted:</span>
              <span className="text-violet-400 font-bold">
                {totalSubmitted || 0} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Verified:</span>
              <span className="text-green-400 font-bold">
                {totalVerified || 0} tons
              </span>
            </div>
            {pendingVerification > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Pending Verification:</span>
                <span className="text-yellow-400 font-bold">
                  {pendingVerification || 0} tons
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">
            Submit New Carbon Emission
          </h2>
          <SubmitCarbon
            address={address}
            hasUnverifiedSubmission={
              recentSubmission && !recentSubmission.verified
            }
            onSubmit={async (parsedAmount) => {
              // Make sure to pass parsedAmount, not the original string
              const success = await submitCarbon(parsedAmount, (errorMessage) =>
                toast.error(errorMessage)
              );
              if (success) {
                toast.success("Carbon submission successful!");
              }
            }}
          />
        </div>
      </div>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          Recent Submission Status
        </h2>
        {recentSubmission ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                Most Recent Submission Amount:
              </span>
              <span className="text-violet-400 font-bold">
                {recentSubmission.amount} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Verified Amount:</span>
              <span className="text-green-400 font-bold">
                {recentSubmission.verifiedAmount} tons
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Submission Status:</span>
              <span
                className={
                  recentSubmission.verified
                    ? "text-green-400 font-bold"
                    : "text-yellow-400 font-bold"
                }
              >
                {recentSubmission.verified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Submission Date:</span>
              <span className="text-violet-400 font-bold">
                {recentSubmission.timestamp}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No recent submissions found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

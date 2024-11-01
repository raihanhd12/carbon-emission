import React, { useState, useEffect, useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import SubmitCarbon from "./SubmitCarbon";
import { toast } from "react-hot-toast";
import {
  useSubmitCarbon,
  useFetchSubmissionsForSeller,
} from "../../contracts/seller";
import { useFetchUserInfo } from "../../contracts/others";
import { getCarbonSubmittedEvents } from "../../contracts/events"; // Update import

const Dashboard = () => {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const [recentSubmission, setRecentSubmission] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [carbonEvents, setCarbonEvents] = useState([]); // State to store CarbonSubmitted events

  // Fetch contract submissions for the logged-in address using the new hook
  const {
    data: contractSubmissions,
    error: submissionsError,
    isLoading: submissionsLoading,
  } = useFetchSubmissionsForSeller(address);

  // Fetch user info using the new hook
  const { data: userInfoData, error: userInfoError } =
    useFetchUserInfo(address);

  const { submitCarbon } = useSubmitCarbon();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle errors
  useEffect(() => {
    if (submissionsError) {
      toast.error("Error fetching submissions. Please try again later.");
      console.error("Submissions Error:", submissionsError);
    }
    if (userInfoError) {
      toast.error("Error fetching user information.");
      console.error("User Info Error:", userInfoError);
    }
  }, [submissionsError, userInfoError]);

  // Process user info
  useEffect(() => {
    if (userInfoData && userInfoData.length >= 2) {
      setUserInfo({
        name: userInfoData[0], // Name is the first element
        company: userInfoData[1], // Company is the second element
      });
    }
  }, [userInfoData]);

  // Fetch and display 'CarbonSubmitted' events using ethers.js
  useEffect(() => {
    const fetchCarbonEvents = async () => {
      try {
        const events = await getCarbonSubmittedEvents(); // Fetch the events
        setCarbonEvents(events); // Set the events in state
      } catch (error) {
        toast.error("Error fetching CarbonSubmitted events.");
        console.error("Error fetching events:", error);
      }
    };

    fetchCarbonEvents();
  }, []);

  // Previous useEffect for submissions remains the same
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

  // Previous useMemo calculations remain the same
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
            onSubmit={async (parsedAmount, parsedPrice) => {
              const success = await submitCarbon(
                parsedAmount,
                parsedPrice,
                (errorMessage) => {
                  toast.error(errorMessage);
                }
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
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          Carbon Submitted Events
        </h2>
        {carbonEvents.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price/Ton
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-4 py-3 bg-zinc-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {carbonEvents.map((event, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-700 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      #{event.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a
                        href={`https://etherscan.io/tx/${event.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 font-mono"
                      >
                        {formatAddress(event.transactionHash)}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="text-gray-300 font-mono">
                        {formatAddress(event.seller)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="text-green-400 font-semibold">
                        {event.amount} tons
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="text-violet-400">
                        {formatPrice(event.pricePerTon)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {event.blockNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {event.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

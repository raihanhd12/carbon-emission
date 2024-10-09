import React, { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import SubmitCarbon from './SubmitCarbon';
import { ethers } from 'ethers';
import { carbonTokenContract } from '../../contracts/carbonTokenContract';
import { useFetchCarbonSubmittedEvents, useFetchCarbonVerifiedEvents } from '../../contracts/events';

const SellerDashboard: React.FC = () => {
  const activeAccount = useActiveAccount(); // Get the active account
  const address = activeAccount?.address; // Use the wallet address

  const [totalSubmitted, setTotalSubmitted] = useState(0);
  const [totalVerified, setTotalVerified] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(0);
  const [recentSubmission, setRecentSubmission] = useState<any>(null); // Store the latest submission
  const [events, setEvents] = useState<any[]>([]); // Store all events

  // Fetch all submissions using the smart contract's getAllSubmissions method
  const { data: contractSubmissions } = useReadContract({
    contract: carbonTokenContract,
    method: 'getAllSubmissions',
    params: [address],
  });

  // Fetch CarbonSubmitted events
  const { data: submissionEvents } = useFetchCarbonSubmittedEvents();

  // Fetch CarbonVerified events
  const { data: verifiedEvents } = useFetchCarbonVerifiedEvents();

  useEffect(() => {
    if (contractSubmissions && contractSubmissions.length > 0) {
      // Process all submissions for this seller
      const processedSubmissions = contractSubmissions.map((submission: any) => ({
        id: submission.id.toString(),
        amount: Number(ethers.utils.formatUnits(submission.amount, 0)),
        verified: submission.verified,
      }));

      // Get the latest submission (the one with the highest id)
      const latestSubmission = processedSubmissions[processedSubmissions.length - 1];

      // Calculate totals for submitted and verified amounts
      const totalSubmittedTemp = processedSubmissions.reduce((total, submission) => total + submission.amount, 0);
      const totalVerifiedTemp = processedSubmissions
        .filter((submission) => submission.verified)
        .reduce((total, submission) => total + submission.amount, 0);

      // Update state with the latest submission and totals
      setTotalSubmitted(totalSubmittedTemp);
      setTotalVerified(totalVerifiedTemp);
      setPendingVerification(totalSubmittedTemp - totalVerifiedTemp);
      setRecentSubmission(latestSubmission);
    }

    if (submissionEvents || verifiedEvents) {
      // Combine CarbonSubmitted and CarbonVerified events into one list
      const allEvents = [
        ...(submissionEvents || []).map((event: any) => ({
          eventType: 'Carbon Submitted',
          transactionHash: event.transactionHash,
          blockNumber: Number(event.blockNumber),
          date: new Date(Number(event.blockTimestamp) * 1000).toLocaleString(), // Convert to milliseconds and format
          amount: Number(ethers.utils.formatUnits(event.args?.amount, 0)),
        })),
        ...(verifiedEvents || []).map((event: any) => ({
          eventType: 'Carbon Verified',
          transactionHash: event.transactionHash,
          blockNumber: Number(event.blockNumber),
          date: event.blockTimestamp ? new Date(event.blockTimestamp * 1000).toLocaleString() : 'Unknown',
          amount: Number(ethers.utils.formatUnits(event.args?.verifiedAmount, 0)),
        })),
      ];

      // Sort events by block number (latest first)
      setEvents(allEvents.sort((a, b) => b.blockNumber - a.blockNumber));
    }
  }, [contractSubmissions, submissionEvents, verifiedEvents]);

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">Seller Dashboard</h1>
        <p className="text-gray-400 mb-6">Error: Wallet not connected</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-violet-400">Seller Dashboard</h1>
      <p className="text-gray-400 mb-6">Wallet Address: {address}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">Carbon Emission Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Submitted:</span>
              <span className="text-violet-400 font-bold">{totalSubmitted} tons</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Verified:</span>
              <span className="text-green-400 font-bold">{totalVerified} tons</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending Verification:</span>
              <span className="text-yellow-400 font-bold">{pendingVerification} tons</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-violet-300">Submit New Carbon Emission</h2>
          <SubmitCarbon address={address} />
        </div>
      </div>

      {/* Submission Status Section */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">Recent Submission Status</h2>
        {recentSubmission ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Most Recent Submission Amount:</span>
              <span className="text-violet-400 font-bold">{recentSubmission.amount} tons</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Submission Status:</span>
              <span className={recentSubmission.verified ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                {recentSubmission.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No recent submissions found.</p>
        )}
      </div>

      {/* Events Section */}
      <div className="mt-8 bg-zinc-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">Event History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-700">
                <th className="px-4 py-2 text-left text-gray-300">Event Type</th>
                <th className="px-4 py-2 text-left text-gray-300">Transaction Hash</th>
                <th className="px-4 py-2 text-left text-gray-300">Block Number</th>
                <th className="px-4 py-2 text-left text-gray-300">Date</th>
                <th className="px-4 py-2 text-left text-gray-300">Amount (tons)</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400">No events found.</td>
                </tr>
              ) : (
                events.map((event, index) => (
                  <tr key={index} className="border-b border-zinc-700">
                    <td className="px-4 py-2 text-gray-300">{event.eventType}</td>
                    <td className="px-4 py-2 text-gray-300">{event.transactionHash}</td>
                    <td className="px-4 py-2 text-gray-300">{event.blockNumber}</td>
                    <td className="px-4 py-2 text-gray-300">{event.date}</td>
                    <td className="px-4 py-2 text-gray-300">{event.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

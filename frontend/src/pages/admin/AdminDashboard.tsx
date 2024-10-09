import React, { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import VerifyCarbon from './VerifyCarbon';
import { carbonTokenContract } from '../../contracts/carbonTokenContract';
import { useFetchCarbonSubmittedEvents, useFetchCarbonVerifiedEvents } from '../../contracts/events';
import { ethers } from 'ethers';

const AdminDashboard: React.FC = () => {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionEvents, setSubmissionEvents] = useState<any[]>([]);

  // Fetch all submissions using the smart contract's getAllSubmissions method
  const { data: contractSubmissions } = useReadContract({
    contract: carbonTokenContract,
    method: 'getAllSubmissions',
    params: [address],
  });

  // Fetch CarbonSubmitted events for the "Events Submission" section
  const { data: carbonSubmittedEvents } = useFetchCarbonSubmittedEvents();

  // Fetch CarbonVerified events for the "Events Submission" section
  const { data: carbonVerifiedEvents } = useFetchCarbonVerifiedEvents();

  useEffect(() => {
    if (contractSubmissions) {
      const processedSubmissions = contractSubmissions.map((submission: any, index: number) => ({
        submissionId: submission.id.toString(),
        seller: address,
        amount: Number(ethers.utils.formatUnits(submission.amount, 0)),
        verified: submission.verified,
      }));
      setSubmissions(processedSubmissions);
    }

    // Combine CarbonSubmitted and CarbonVerified events for the event section
    if (carbonSubmittedEvents || carbonVerifiedEvents) {
      const combinedEvents = [
        ...carbonSubmittedEvents.map((event) => ({
          type: 'CarbonSubmitted',
          seller: event.args?.seller,
          amount: Number(ethers.utils.formatUnits(event.args.amount, 0)),
          submissionId: event.args?.id.toString(),
        })),
        ...carbonVerifiedEvents.map((event) => ({
          type: 'CarbonVerified',
          verifier: event.args?.verifier,
          seller: event.args?.seller,
          verifiedAmount: Number(ethers.utils.formatUnits(event.args.verifiedAmount, 0)),
          submissionId: event.args?.id.toString(),
        })),
      ];
      setSubmissionEvents(combinedEvents);
    }
  }, [contractSubmissions, carbonSubmittedEvents, carbonVerifiedEvents, address]);

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">Admin Dashboard</h1>
        <p className="text-gray-400 mb-6">Error: Wallet not connected</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-violet-400">Admin Dashboard</h1>
      <p className="text-gray-400 mb-6">Admin Address: {address}</p>

      {/* Main table for submissions fetched from getAllSubmissions */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">Pending Carbon Submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-700">
                <th className="px-4 py-2 text-left text-gray-300">Submission ID</th>
                <th className="px-4 py-2 text-left text-gray-300">Seller</th>
                <th className="px-4 py-2 text-left text-gray-300">Amount (tons)</th>
                <th className="px-4 py-2 text-left text-gray-300">Verified</th>
                <th className="px-4 py-2 text-left text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-4">No submissions found.</td>
                </tr>
              ) : (
                submissions.map((submission, index) => (
                  <tr key={index} className="border-b border-zinc-700">
                    <td className="px-4 py-2 text-gray-300">{submission.submissionId}</td>
                    <td className="px-4 py-2 text-gray-300">{submission.seller}</td>
                    <td className="px-4 py-2 text-gray-300">{submission.amount}</td>
                    <td className="px-4 py-2 text-gray-300">{submission.verified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">
                      {!submission.verified && <VerifyCarbon submission={submission} />}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events section below the main table */}
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">Events Submission</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-700">
                <th className="px-4 py-2 text-left text-gray-300">Event Type</th>
                <th className="px-4 py-2 text-left text-gray-300">Submission ID</th>
                <th className="px-4 py-2 text-left text-gray-300">Seller</th>
                <th className="px-4 py-2 text-left text-gray-300">Amount (tons)</th>
              </tr>
            </thead>
            <tbody>
              {submissionEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-4">No events found.</td>
                </tr>
              ) : (
                submissionEvents.map((event, index) => (
                  <tr key={index} className="border-b border-zinc-700">
                    <td className="px-4 py-2 text-gray-300">{event.type}</td>
                    <td className="px-4 py-2 text-gray-300">{event.submissionId}</td>
                    <td className="px-4 py-2 text-gray-300">{event.seller}</td>
                    <td className="px-4 py-2 text-gray-300">{event.amount || event.verifiedAmount}</td>
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

export default AdminDashboard;

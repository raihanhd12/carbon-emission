import React, { useState, useEffect } from "react";
import { useFetchUnverifiedSubmissions } from "../../contracts/admin"; // Use the hook from admin.js
import VerifyCarbon from "./VerifyCarbon";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [unverifiedSubmissions, setUnverifiedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: submissionsData, error: submissionsError } =
    useFetchUnverifiedSubmissions(); // Fetch unverified submissions

  useEffect(() => {
    if (submissionsError) {
      toast.error(
        "Error fetching unverified submissions. Please try again later."
      );
      console.error("Submissions Error:", submissionsError);
    } else if (submissionsData) {
      console.log("Submissions Data:", submissionsData); // Add this line to inspect the data structure
      const processedSubmissions = submissionsData.map((submission, index) => ({
        submissionId: submission.id ? submission.id.toString() : `ID-${index}`, // Use index as a fallback ID
        seller: submission.seller,
        amount: submission.amount.toString(),
        timestamp: new Date(
          Number(submission.timestamp.toString()) * 1000
        ).toLocaleString(),
      }));
      setUnverifiedSubmissions(processedSubmissions);
      setLoading(false);
    }
  }, [submissionsData, submissionsError]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-violet-400">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-violet-400">
        Admin Dashboard
      </h1>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-violet-300">
          Pending Carbon Submissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-700 text-left">
                <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Submission ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Seller
                </th>
                <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Amount (tons)
                </th>
                <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-600">
              {unverifiedSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No unverified submissions found.
                  </td>
                </tr>
              ) : (
                unverifiedSubmissions.map((submission, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {submission.submissionId
                        ? submission.submissionId
                        : "No ID Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {submission.seller}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {submission.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <VerifyCarbon
                        submission={submission}
                        onVerify={() =>
                          toast.success(
                            `Successfully verified ${submission.amount} tons of carbon`
                          )
                        }
                        onError={(errorMessage) => toast.error(errorMessage)}
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
  );
};

export default Dashboard;

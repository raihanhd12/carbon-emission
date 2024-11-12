import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchSubmissionDetails } from "../../contracts/buyer"; // Import hook
import Breadcrumb from "../../components/Breadcrumb";

const SellerDetail = () => {
  const { id: sellerAddress, submissionId } = useParams(); // Ambil `sellerAddress` dan `submissionId` dari URL
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submission detail berdasarkan `sellerAddress` dan `submissionId`
  const {
    data: submissionDetails,
    error: fetchError,
    isLoading,
  } = useFetchSubmissionDetails(sellerAddress, submissionId);

  useEffect(() => {
    console.log("Seller Address:", sellerAddress);
    console.log("Submission ID:", submissionId);

    if (fetchError) {
      console.error("Error fetching submission details:", fetchError);
      setError(fetchError);
    }

    if (submissionDetails) {
      console.log("Fetched submission details:", submissionDetails);
      setSubmission(submissionDetails);
      setLoading(false);
    }
  }, [submissionDetails, fetchError, sellerAddress, submissionId]);

  if (isLoading || loading) {
    return <p className="text-gray-400">Loading submission data...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error fetching data: {error.message || "Unknown error"}
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-zinc-300">
        Submission not found for this ID: {submissionId}
      </div>
    );
  }

  // **Validasi sebelum memanggil `.toString()`**
  const { id, amount, verifiedAmount, verifiedPrice, timestamp, verified } =
    submission || {};

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">
        Submission Details
      </h2>
      <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-violet-400 mb-4">
          Seller Address: {sellerAddress}
        </h3>
        <p className="text-zinc-300 mb-2">
          Submission ID: {id?.toString() || "N/A"}
        </p>
        <p className="text-zinc-300 mb-2">
          Emission Amount: {amount?.toString() || "N/A"} tons
        </p>
        <p className="text-zinc-300 mb-2">
          Verified Amount: {verifiedAmount?.toString() || "N/A"} tons
        </p>
        <p className="text-zinc-300 mb-2">
          Verified Price: {verifiedPrice?.toString() || "N/A"} Wei
        </p>
        <p className="text-zinc-300 mb-2">
          Submission Date:{" "}
          {timestamp
            ? new Date(Number(timestamp) * 1000).toLocaleDateString()
            : "N/A"}
        </p>
        <p
          className={`mb-4 font-semibold ${
            verified ? "text-green-400" : "text-yellow-400"
          }`}
        >
          Status: {verified ? "Verified" : "Pending"}
        </p>
        <Link
          to="/dashboard/buyer/sellers"
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Back to All Sellers
        </Link>
      </div>
    </div>
  );
};

export default SellerDetail;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useFetchAllSellers,
  useFetchAllSubmission,
} from "../../contracts/buyer";
import Breadcrumb from "../../components/Breadcrumb";

// Fungsi untuk memformat harga dalam bentuk rupiah
const formatPrice = (priceInWei) => {
  const priceInEth = Number(priceInWei) / 1e18; // Konversi dari Wei ke ETH
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(priceInEth);
};

const Dashboard = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [sellerData, setSellerData] = useState([]);

  // Panggil hook untuk mengambil data submission
  const {
    data: allSubmission,
    error: allSubmissionError,
    isLoading: allSubmissionLoading,
  } = useFetchAllSubmission();

  const {
    data: sellers,
    error: sellersError,
    isLoading: sellersLoading,
  } = useFetchAllSellers();

  // Fetch data submission
  useEffect(() => {
    if (allSubmission) {
      setSubmissionData(allSubmission);
    }
  }, [allSubmission]);

  // Fetch data sellers
  useEffect(() => {
    if (sellers) {
      setSellerData(sellers);
    }
  }, [sellers]);

  // Sort submissions by latest timestamp
  const latestSubmissions = submissionData
    .slice()
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">
        Carbon Emission Dashboard
      </h2>

      {/* Loading State */}
      {allSubmissionLoading && (
        <p className="text-gray-400">Loading submissions...</p>
      )}
      {sellersLoading && <p className="text-gray-400">Loading sellers...</p>}

      {/* Error State */}
      {allSubmissionError && (
        <p className="text-red-500">Error fetching submissions data.</p>
      )}
      {sellersError && (
        <p className="text-red-500">Error fetching sellers data.</p>
      )}

      {/* Section: Top Verified Sellers */}
      <div className="mt-10 relative">
        <h3 className="text-2xl font-semibold text-violet-400 mb-6">
          Top Verified Submissions
        </h3>
        <Link
          to="/dashboard/buyer/sellers"
          className="absolute top-0 right-0 text-violet-600 hover:text-violet-800"
        >
          See All
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissionData.slice(0, 3).map((submission, index) => (
            <div
              key={index}
              className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4"
            >
              <h4 className="text-xl font-semibold text-violet-400 mb-2">
                Seller: {submission.seller}
              </h4>
              <p className="text-zinc-300">
                Verified Amount: {submission.verifiedAmount.toString()} tons
              </p>
              <p className="text-zinc-300">
                Verified Price: {formatPrice(submission.verifiedPrice)}
              </p>
              <p className="text-zinc-300">
                Submission Date:{" "}
                {new Date(
                  Number(submission.timestamp) * 1000
                ).toLocaleDateString()}
              </p>
              <Link
                to={`/dashboard/buyer/sellers/${submission.seller}/${submission.id}`}
                className="text-violet-600 mt-4 inline-block"
              >
                View Seller Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Latest Submissions */}
      <div className="mt-10 relative">
        <h3 className="text-2xl font-semibold text-violet-400 mb-6">
          Latest Submissions
        </h3>
        <Link
          to="/dashboard/buyer/sellers"
          className="absolute top-0 right-0 text-violet-600 hover:text-violet-800"
        >
          See All
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestSubmissions.map((submission, index) => (
            <div
              key={index}
              className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4"
            >
              <h4 className="text-xl font-semibold text-violet-400 mb-2">
                Seller: {submission.seller}
              </h4>
              <p className="text-zinc-300">
                Verified Amount: {submission.verifiedAmount.toString()} tons
              </p>
              <p className="text-zinc-300">
                Verified Price: {formatPrice(submission.verifiedPrice)}
              </p>
              <p className="text-zinc-300">
                Submission Date:{" "}
                {new Date(
                  Number(submission.timestamp) * 1000
                ).toLocaleDateString()}
              </p>
              <Link
                to={`/dashboard/buyer/sellers/${submission.seller}/${submission.id}`}
                className="text-violet-600 mt-4 inline-block"
              >
                View Seller Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useFetchAllSellers,
  useFetchAllSubmission,
} from "../../contracts/buyer";
import Breadcrumb from "../../components/Breadcrumb";

// SellerCard Component
const SellerCard = ({ seller }) => {
  return (
    <Link to={`/dashboard/buyer/sellers/${seller.seller}`} className="block">
      <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4 hover:bg-zinc-700 transition-colors">
        <h3 className="text-xl font-semibold text-violet-400 mb-2">
          Seller Address: {seller.seller}
        </h3>
        <p className="text-zinc-300">
          Emission: {seller.verifiedAmount.toString()} tons
        </p>
        <p className="text-zinc-300">
          Verified Price: {seller.verifiedPrice.toString()} Wei
        </p>
        <p className="text-zinc-300">
          Submission Date:{" "}
          {new Date(Number(seller.timestamp) * 1000).toLocaleDateString()}
        </p>
        <p className={`mt-2 font-semibold text-green-400`}>Status: Verified</p>
      </div>
    </Link>
  );
};

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all submissions (which include seller details)
  const {
    data: allSubmissions,
    error: submissionsError,
    isLoading: submissionsLoading,
  } = useFetchAllSubmission();

  // Fetch sellers from contract and update state
  useEffect(() => {
    if (allSubmissions) {
      setSellers(allSubmissions);
    }
  }, [allSubmissions]);

  // Filter sellers based on search term and status
  const filteredSellers = sellers.filter(
    (seller) =>
      seller.seller.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" ||
        (statusFilter === "verified" && seller.verifiedAmount > 0))
  );

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">All Sellers</h2>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
        >
          <option value="all">All Statuses</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {submissionsLoading && (
        <p className="text-gray-400">Loading sellers...</p>
      )}
      {submissionsError && (
        <p className="text-red-500">Error fetching submissions data.</p>
      )}

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller, index) => (
          <SellerCard key={index} seller={seller} />
        ))}
      </div>

      {/* No Results Message */}
      {filteredSellers.length === 0 && (
        <p className="text-zinc-300 text-center mt-6">
          No sellers found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default Sellers;

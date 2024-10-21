import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DUMMY_SELLERS, STATUS_COLORS } from "../../constants"; // Removed Seller interface import
import Breadcrumb from "../../components/Breadcrumb";

// No more interfaces, just use plain JavaScript props
const SellerCard = ({ seller }) => {
  return (
    <Link to={`/dashboard/buyer/sellers/${seller.id}`} className="block">
      <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4 hover:bg-zinc-700 transition-colors">
        <h3 className="text-xl font-semibold text-violet-400 mb-2">
          {seller.name}
        </h3>
        <p className="text-zinc-300">Emission: {seller.emissionAmount} tons</p>
        <p className="text-zinc-300">
          Verified:{" "}
          {seller.verifiedAmount !== null
            ? `${seller.verifiedAmount} tons`
            : "Pending"}
        </p>
        <p className={`mt-2 font-semibold ${STATUS_COLORS[seller.status]}`}>
          Status:{" "}
          {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
        </p>
      </div>
    </Link>
  );
};

const Sellers = () => {
  const [sellers, setSellers] = useState(DUMMY_SELLERS); // No type annotations in JSX
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const filteredSellers = DUMMY_SELLERS.filter(
      (seller) =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || seller.status === statusFilter)
    );
    setSellers(filteredSellers);
  }, [searchTerm, statusFilter]);

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
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>

      {/* No Results Message */}
      {sellers.length === 0 && (
        <p className="text-zinc-300 text-center mt-6">
          No sellers found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default Sellers;

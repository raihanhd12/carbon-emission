import React from "react";
import { useParams, Link } from "react-router-dom";
import { DUMMY_SELLERS, STATUS_COLORS } from "../../constants";
import Breadcrumb from "../../components/Breadcrumb";

const SellerDetail = () => {
  const { id } = useParams(); // No need for type annotations in JSX
  const seller = DUMMY_SELLERS.find((s) => s.id === id);

  if (!seller) {
    return <div className="text-zinc-300">Seller not found</div>;
  }

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">{seller.name}</h2>
      <div className="bg-zinc-800 rounded-lg shadow-md p-6">
        <p className="text-zinc-300 mb-2">ID: {seller.id}</p>
        <p className="text-zinc-300 mb-2">
          Emission Amount: {seller.emissionAmount} tons
        </p>
        <p className="text-zinc-300 mb-2">
          Verified Amount:{" "}
          {seller.verifiedAmount !== null
            ? `${seller.verifiedAmount} tons`
            : "Pending"}
        </p>
        <p className={`mb-4 font-semibold ${STATUS_COLORS[seller.status]}`}>
          Status:{" "}
          {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
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

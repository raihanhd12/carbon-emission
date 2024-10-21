import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchAllSellers } from "../../contracts/buyer"; // Import the hook
import Breadcrumb from "../../components/Breadcrumb";

const Dashboard = () => {
  const { data: sellers, isLoading } = useFetchAllSellers(); // Fetch all sellers
  const [sellerData, setSellerData] = useState([]);

  useEffect(() => {
    if (sellers) {
      // Process the sellers data when available
      setSellerData(
        sellers.map((seller) => ({
          id: seller,
          name: seller, // Placeholder, replace with actual name data if available
          emissionAmount: 0, // Placeholder, adjust accordingly
          verifiedAmount: 0, // Placeholder, adjust accordingly
          status: "pending", // Placeholder, adjust accordingly
        }))
      );
    }
  }, [sellers]);

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">
        Carbon Emission Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerData.map((seller) => (
          <div
            key={seller.id}
            className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4"
          >
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              {seller.name}
            </h3>
            <p className="text-zinc-300">
              Emission: {seller.emissionAmount} tons
            </p>
            <p className="text-zinc-300">
              Verified:{" "}
              {seller.verifiedAmount !== null
                ? `${seller.verifiedAmount} tons`
                : "Pending"}
            </p>
            <p className="text-zinc-300">Status: {seller.status}</p>
            <Link
              to={`/dashboard/buyer/sellers/${seller.id}`}
              className="text-violet-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

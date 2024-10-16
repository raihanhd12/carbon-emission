import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  DUMMY_SELLERS,
  MAX_DISPLAY_SELLERS,
  STATUS_COLORS,
} from "../constants";
import Breadcrumb from "../components/Breadcrumb";

// SellerCard component in plain JavaScript
const SellerCard = ({ seller }) => {
  return (
    <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-4 min-w-[250px]">
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
        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const sliderRef = useRef(null);
  const totalEmission = DUMMY_SELLERS.reduce(
    (sum, seller) => sum + seller.emissionAmount,
    0
  );
  const totalVerified = DUMMY_SELLERS.reduce(
    (sum, seller) => sum + (seller.verifiedAmount || 0),
    0
  );

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-10 px-4">
      <Breadcrumb />
      <h2 className="text-3xl font-bold mb-6 text-zinc-100">
        Carbon Emission Dashboard
      </h2>

      {/* First Row: Seller Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-zinc-200">
            Recent Sellers
          </h3>
          <Link
            to="/dashboard/sellers"
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            See All Sellers
          </Link>
        </div>
        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 transform -translate-x-full text-white p-2 rounded-full z-10 hover:bg-zinc-600 transition-colors"
          >
            &#8592;
          </button>
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-4 transition-all duration-300 ease-in-out"
              style={{
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {DUMMY_SELLERS.slice(0, MAX_DISPLAY_SELLERS).map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 transform translate-x-full  text-white p-2 rounded-full z-10 hover:bg-zinc-600 transition-colors"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Second Row: Additional Dashboard Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Statistics */}
        <div className="bg-zinc-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-zinc-200">Summary</h3>
          <p className="text-zinc-300">Total Emission: {totalEmission} tons</p>
          <p className="text-zinc-300">Total Verified: {totalVerified} tons</p>
          <p className="text-zinc-300">
            Verification Rate:{" "}
            {((totalVerified / totalEmission) * 100).toFixed(2)}%
          </p>
        </div>

        {/* Recent Activities or News */}
        <div className="bg-zinc-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-zinc-200">
            Recent Activities
          </h3>
          <ul className="text-zinc-300">
            <li className="mb-2">New seller "Green Tech" registered</li>
            <li className="mb-2">
              Verification completed for "Eco Solutions Inc."
            </li>
            <li className="mb-2">
              Carbon credits issued to "Sustainable Futures"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

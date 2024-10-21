import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { prepareContractCall } from "thirdweb";
import {
  ConnectButton,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import { useFetchAdmin } from "../contracts/admin";
import { useFetchUserRole } from "../contracts/others";
import { carbonTokenContract } from "../services/carbonTokenContract";
import { client } from "../services/client";
import { Toaster, toast } from "react-hot-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const { mutateAsync: sendTransaction } = useSendTransaction();

  // Fetch the admin address using useFetchAdmin
  const { data: adminAddress, error: adminError } = useFetchAdmin();

  // Fetch the user role using useFetchUserRole
  const { data: roleNumber, error: roleError } =
    useFetchUserRole(walletAddress);

  // Handle admin address fetch error
  useEffect(() => {
    if (adminError) {
      console.error("Error fetching admin address:", adminError);
      toast.error("Failed to fetch admin address.");
      setLoading(false);
    }
  }, [adminError]);

  // Check if the connected wallet is the admin
  useEffect(() => {
    if (adminAddress && walletAddress) {
      if (walletAddress.toLowerCase() === adminAddress.toLowerCase()) {
        setUserRole("admin");
        setLoading(false);
      }
    }
  }, [adminAddress, walletAddress]);

  // Check and handle user role
  useEffect(() => {
    if (roleError) {
      console.error("Error fetching user role:", roleError);
      toast.error("Failed to fetch user role.");
      setLoading(false);
      return;
    }

    if (roleNumber !== undefined && userRole !== "admin") {
      let roleEnum;

      // Check if roleNumber is a BigNumber
      if (
        typeof roleNumber === "object" &&
        roleNumber !== null &&
        typeof roleNumber.toNumber === "function"
      ) {
        roleEnum = roleNumber.toNumber();
      } else if (typeof roleNumber === "number") {
        roleEnum = roleNumber;
      } else {
        console.error("Unexpected roleNumber type:", typeof roleNumber);
        toast.error("Unexpected role data received.");
        setLoading(false);
        return;
      }

      if (roleEnum === 0) {
        // Unassigned
        setShowRoleModal(true);
      } else if (roleEnum === 1) {
        // Seller
        setUserRole("seller");
        setLoading(false);
      } else if (roleEnum === 2) {
        // Buyer
        setUserRole("buyer");
        setLoading(false);
      }
    }
  }, [roleNumber, userRole]);

  // Handle account switch
  useEffect(() => {
    const previousAddress = localStorage.getItem("walletAddress");

    if (walletAddress && previousAddress && walletAddress !== previousAddress) {
      toast.success("Account switched, refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    localStorage.setItem("walletAddress", walletAddress || "");
  }, [walletAddress]);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-violet-700 text-white"
        : "text-gray-300 hover:bg-violet-600 hover:text-white"
    }`;

  const handleConnect = () => {
    setLoading(true);
  };

  const handleDisconnect = () => {
    toast.error("Wallet disconnected");
    setUserRole(null);
    setLoading(false);
    navigate("/");
  };

  const handleRoleSelection = async (role) => {
    try {
      const roleIndex = role === "seller" ? 1 : 2; // Seller is 1, Buyer is 2

      const transaction = prepareContractCall({
        contract: carbonTokenContract,
        method: "userSelectRole",
        params: [roleIndex],
      });

      await sendTransaction(transaction);

      setShowRoleModal(false);
      localStorage.setItem("userRole", role);
      setUserRole(role);
      toast.success(`Role selected: ${role}`);
    } catch (error) {
      console.error("Role selection failed:", error);
      toast.error("Failed to select role. Please try again.");
    }
  };

  return (
    <header className="bg-zinc-900 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tighter text-zinc-100">
              Carbon<span className="text-violet-500">Emission</span>
            </h1>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex flex-grow justify-center">
            <div className="flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
              {userRole === "admin" ? (
                <NavLink to="/dashboard/admin" className={navLinkClass}>
                  Dashboard
                </NavLink>
              ) : userRole === "seller" && walletAddress ? (
                <NavLink
                  to={`/dashboard/sellers/${walletAddress}/seller-dashboard`}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
              ) : (
                <NavLink to="/dashboard/buyer" className={navLinkClass}>
                  Dashboard
                </NavLink>
              )}
            </div>
          </nav>

          {/* Connect Wallet Button - Right */}
          <div className="flex-shrink-0">
            <ConnectButton
              client={client}
              connectButton={{
                style: {
                  backgroundColor: "#8B5CF6",
                  color: "#FFFFFF",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "background-color 0.2s ease-in-out",
                },
                className:
                  "hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
              }}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            {userRole === "admin" ? (
              <NavLink to="/dashboard/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
            ) : userRole === "seller" && walletAddress ? (
              <NavLink
                to={`/dashboard/sellers/${walletAddress}/seller-dashboard`}
                className={navLinkClass}
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-violet-400">
              Choose Your Role
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection("seller")}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Seller</span>
              </button>
              <p className="text-sm text-gray-400 text-center">
                Submit and manage your carbon emissions
              </p>

              <button
                onClick={() => handleRoleSelection("buyer")}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Buyer</span>
              </button>
              <p className="text-sm text-gray-400 text-center">
                Purchase and trade carbon credits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </header>
  );
};

export default Header;

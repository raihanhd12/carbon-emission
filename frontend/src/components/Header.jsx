import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../services/client";
import { Toaster, toast } from "react-hot-toast";
import { useFetchUserData, useRegisterUser } from "../contracts/others";
import { useFetchAdmin } from "../contracts/admin";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
  });

  const navigate = useNavigate();
  const location = useLocation(); // Tambahkan ini
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  const { data: userData, isLoading: userDataLoading } =
    useFetchUserData(walletAddress);
  const { data: adminAddress, isLoading: adminLoading } = useFetchAdmin();
  const { registerUser } = useRegisterUser();

  const isAdmin =
    walletAddress &&
    adminAddress &&
    walletAddress.toLowerCase() === adminAddress.toLowerCase();

  // Check wallet connection and user role
  useEffect(() => {
    if (walletAddress && !userDataLoading && !adminLoading) {
      if (isAdmin) {
        // Jika pengguna adalah admin, arahkan ke dashboard admin
        navigate(`/dashboard/admin/${walletAddress}`);
      } else if (userData && userData[0] === 0) {
        // Jika pengguna belum terdaftar
        setShowRoleModal(true);
      } else {
        setShowRoleModal(false);
      }
    }
  }, [
    walletAddress,
    userData,
    isAdmin,
    userDataLoading,
    adminLoading,
    navigate,
  ]);

  const handleDashboardClick = () => {
    if (userData) {
      const role = userData[0]; // Role: 1 = Seller, 2 = Buyer, 3 = Admin
      if (role === 1) {
        navigate(`/dashboard/sellers/${walletAddress}`);
      } else if (role === 2) {
        navigate(`/dashboard/buyer/${walletAddress}`);
      } else if (isAdmin) {
        navigate(`/dashboard/admin/${walletAddress}`);
      } else {
        toast.error("Role not assigned. Please register.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.role) {
      toast.error("All fields are required");
      return;
    }

    if (formData.role === "seller" && !formData.company) {
      toast.error("Company is required for sellers");
      return;
    }

    const roleIndex = formData.role === "seller" ? 1 : 2;
    try {
      const success = await registerUser(
        roleIndex,
        formData.name,
        formData.company || ""
      );
      if (success) {
        toast.success("Registration successful!");
        setShowRoleModal(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <header className="bg-zinc-900 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold tracking-tighter text-zinc-100">
            Carbon<span className="text-violet-500">Emission</span>
          </h1>
          <nav className="hidden md:flex flex-grow justify-center">
            {/* Home Link */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 text-sm font-medium text-white bg-violet-600"
                  : "px-3 py-2 text-sm font-medium text-gray-300 hover:bg-violet-600 hover:text-white"
              }
            >
              Home
            </NavLink>

            {/* Dashboard Link */}
            <NavLink
              to={
                userData
                  ? userData[0] === 1
                    ? `/dashboard/sellers/${walletAddress}`
                    : userData[0] === 2
                    ? `/dashboard/buyer/${walletAddress}`
                    : `/dashboard/admin/${walletAddress}`
                  : "#"
              }
              className={() =>
                location.pathname.startsWith("/dashboard")
                  ? "px-3 py-2 text-sm font-medium text-white bg-violet-600"
                  : "px-3 py-2 text-sm font-medium text-gray-300 hover:bg-violet-600 hover:text-white"
              }
              onClick={handleDashboardClick}
            >
              Dashboard
            </NavLink>
          </nav>
          <ConnectButton client={client} />
        </div>
      </div>
      {/* Modal untuk registrasi hanya jika role bukan admin */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full relative">
            <h2 className="text-2xl font-bold mb-6 text-center text-violet-400">
              Complete Your Profile
            </h2>
            {userDataLoading ? (
              <div className="text-center text-gray-300">Loading...</div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 rounded-md bg-zinc-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full p-3 rounded-md bg-zinc-700 text-white"
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-3 rounded-md bg-zinc-700 text-white"
                >
                  <option value="">Select Role</option>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700"
                >
                  Complete Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </header>
  );
};

export default Header;

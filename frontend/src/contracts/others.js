import { useReadContract } from "thirdweb/react";
import { carbonTokenContract } from "../services/carbonTokenContract";

// Hook to fetch the user role using wallet address
export const useFetchUserRole = (walletAddress) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "userRoles",
        params: walletAddress ? [walletAddress] : [],
    });
};

// Hook to fetch the user information (name and company) using wallet address
export const useFetchUserInfo = (walletAddress) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "userDetails",
        params: walletAddress ? [walletAddress] : [],
    });
};

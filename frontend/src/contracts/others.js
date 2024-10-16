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

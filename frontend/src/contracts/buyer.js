import { useReadContract } from "thirdweb/react";
import { carbonTokenContract } from "../services/carbonTokenContract";

// Hook to fetch all sellers
export const useFetchAllSellers = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "sellers",
        params: [],
        watch: true, // Auto-refresh when the contract data changes
    });
};

// Hook to fetch submissions for a specific seller
export const useFetchSubmissionsForSeller = (sellerAddress) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getSubmissionsForSeller",
        params: sellerAddress ? [sellerAddress] : [],
        watch: true, // Auto-refresh when the contract data changes
    });
};

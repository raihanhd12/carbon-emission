import { useReadContract } from "thirdweb/react";
import { carbonTokenContract } from "../services/carbonTokenContract";

// Hook to fetch all sellers
export const useFetchAllSellers = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getAllSellers",
        params: [],
        watch: true, // Auto-refresh when the contract data changes
    });
};

export const useFetchAllSubmission = () => {
    const { data, error, isLoading } = useReadContract({
        contract: carbonTokenContract,
        method: "getAllSubmissions",
        params: [],
        watch: true,
    });

    return { data, error, isLoading };
};

// Hook to fetch submissions for a specific seller
export const useFetchSubmissionDetails = (sellerAddress, submissionId) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getSubmissionDetails",
        params: [sellerAddress, submissionId],
        watch: true,
    });
};


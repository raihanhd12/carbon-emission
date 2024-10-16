import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";

// Hook to verify a carbon submission by the admin
export const useVerifyCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const verifyCarbonSubmission = async (seller, submissionId, verifiedAmount, onError) => {
        try {
            // Prepare the contract call
            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "verifyCarbon",
                params: [seller, submissionId, verifiedAmount],
            });

            // Send the transaction using sendTransaction
            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            if (onError) onError("Transaction failed. Please try again.");
            return false;
        }
    };

    return { verifyCarbonSubmission };
};

// Hook to fetch all unverified submissions
export const useFetchUnverifiedSubmissions = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getAllUnverifiedSubmissions",
        params: [],
        watch: true, // Auto-refresh when the contract data changes
    });
};

export const useFetchAdmin = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "admin", // Assuming the contract has a public 'admin' variable
        params: [],
    });
};

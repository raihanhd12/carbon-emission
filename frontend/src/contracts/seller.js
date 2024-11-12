import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";

export const useSubmitCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const submitCarbon = async (amount, pricePerTon, onError) => {
        try {
            console.log("Submitting amount:", amount.toString(), "and price in Wei:", pricePerTon.toString());

            if (amount <= 0n || pricePerTon <= 0n) {
                throw new Error("Invalid amount or price provided");
            }

            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "submitCarbon",
                params: [amount, pricePerTon],
            });

            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            if (onError) onError("Transaction failed. Please try again.");
            return false;
        }
    };

    return { submitCarbon };
};

// Hook to fetch submissions for a seller
export const useFetchSubmissionsForSeller = (address) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getSubmissionsForSeller",
        params: address ? [address] : [],
        watch: true, // Auto-refresh when the contract data changes
    });
};

export const useFetchVerifiedSubmissionsForSeller = (address) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getVerifiedSubmissionsForSeller",
        params: address ? [address] : [],
        watch: true, // Auto-refresh when the contract data changes
    });
}

export const useFetchSubmissionDetails = (address, submissionId) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getSubmissionDetails",
        params: [address, submissionId],
        watch: true, // Auto-refresh when the contract data changes
    });
}

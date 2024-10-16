import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";

export const useSubmitCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const submitCarbon = async (amount, onError) => {
        try {
            console.log("Submitting amount:", amount); // Log to verify what's passed

            // Ensure that amount is a valid number before converting to BigInt
            if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
                throw new Error("Invalid amount provided");
            }

            const amountInBigInt = BigInt(amount); // Convert valid number to BigInt

            // Prepare the contract call
            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "submitCarbon",
                params: [amountInBigInt], // Pass BigInt value
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

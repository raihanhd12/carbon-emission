import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";

export const useSubmitCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const submitCarbon = async (amount, pricePerTon, onError) => {
        try {
            console.log("Submitting amount:", amount, "and price:", pricePerTon); // Log to verify

            // Ensure that amount and pricePerTon are valid numbers
            if (
                typeof amount !== "number" ||
                isNaN(amount) ||
                amount <= 0 ||
                typeof pricePerTon !== "number" ||
                isNaN(pricePerTon) ||
                pricePerTon <= 0
            ) {
                throw new Error("Invalid amount or price provided");
            }

            const amountInBigInt = BigInt(amount); // Convert valid number to BigInt
            const priceInBigInt = BigInt(pricePerTon); // Convert price to BigInt

            // Prepare the contract call
            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "submitCarbon",
                params: [amountInBigInt, priceInBigInt], // Pass both values as BigInt
            });

            // Send the transaction
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

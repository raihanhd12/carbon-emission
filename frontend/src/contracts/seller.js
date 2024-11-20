import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";
import { ethers } from "ethers";

// seller.js
export const useSubmitCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const submitCarbon = async (amount, priceInEth, onError) => {
        try {
            console.log("Input values:", {
                amount: amount.toString(),
                priceInEth,
                type: typeof priceInEth
            });

            if (amount <= 0n || Number(priceInEth) <= 0) {
                throw new Error("Invalid amount or price");
            }

            console.log("Preparing transaction with:", {
                amount: amount.toString(),
                priceInEth,
                finalPrice: Number(priceInEth)
            });

            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "submitCarbon",
                params: [amount, priceInEth],
            });

            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            if (onError) onError(error.message);
            return false;
        }
    };

    return { submitCarbon };
};
export const useCheckUnverifiedSubmission = (address) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "checkUnverifiedSubmission",
        params: [address],
        watch: true,
    });
};



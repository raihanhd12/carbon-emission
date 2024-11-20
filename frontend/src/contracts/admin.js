import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb"; // Import the correct utility for preparing contract calls
import { carbonTokenContract } from "../services/carbonTokenContract";
import { ethers } from "ethers";

// Hook to verify a carbon submission by the admin
export const useVerifyCarbon = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const verifyCarbonSubmission = async (seller, submissionId, verifiedAmount, priceInEth, onError) => {
        try {
            console.log("Verifying with:", {
                seller,
                submissionId,
                verifiedAmount: verifiedAmount.toString(),
                priceInEth,
                type: typeof priceInEth
            });

            const params = [
                seller,
                submissionId,
                verifiedAmount,
                BigInt(priceInEth) // Convert to BigInt
            ];

            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "verifySubmission",
                params
            });

            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            if (onError) onError(error.message);
            return false;
        }
    };

    return { verifyCarbonSubmission };
};

export const useFetchAdmin = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "admin", // Assuming the contract has a public 'admin' variable
        params: [],
    });
};

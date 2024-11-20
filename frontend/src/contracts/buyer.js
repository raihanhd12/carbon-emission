import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { carbonTokenContract } from "../services/carbonTokenContract";
import { ethers } from "ethers";

export const useBuyTokens = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const buyTokens = async (
        sellerAddress,
        submissionId,
        amount,
        priceInEth,
        onError
    ) => {
        try {
            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount)) {
                throw new Error("Invalid amount");
            }

            // Calculate exact total price
            const totalPriceInEth = (parsedAmount * priceInEth).toString();
            console.log("Price calculation:", {
                amount: parsedAmount,
                pricePerToken: priceInEth,
                totalPriceInEth
            });

            // Convert to Wei using exact string value
            const totalPriceWei = ethers.utils.parseEther(totalPriceInEth);

            const params = [
                sellerAddress,
                submissionId,
                parsedAmount
            ];

            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "buyTokens",
                params,
                value: totalPriceWei,
            });

            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Transaction failed:", error);
            if (onError) onError("Transaction failed. Please try again.");
            return false;
        }
    };

    return { buyTokens };
};
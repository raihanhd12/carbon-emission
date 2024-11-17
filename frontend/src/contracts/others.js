// contracts/userHooks.js
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { carbonTokenContract } from "../services/carbonTokenContract";

// Hook to fetch user data (role, name, company)
export const useFetchUserData = (walletAddress) => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "users",
        params: walletAddress ? [walletAddress] : [],
        watch: true,
    });
};

// Hook untuk registrasi user
export const useRegisterUser = () => {
    const { mutateAsync: sendTransaction } = useSendTransaction();

    const registerUser = async (role, name, company, onError) => {
        try {
            const transaction = prepareContractCall({
                contract: carbonTokenContract,
                method: "register",
                params: [role, name, company],
            });

            await sendTransaction(transaction);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            if (onError) onError("Registration failed. Please try again.");
            return false;
        }
    };

    return { registerUser };
};

export const useFetchSubmission = () => {
    return useReadContract({
        contract: carbonTokenContract,
        method: "getAllSubmissions",
        params: [],
        watch: true, // Auto-refresh when the contract data changes
    });
}
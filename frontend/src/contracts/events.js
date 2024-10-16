import { useContractEvents } from "thirdweb/react";
import { carbonTokenContract } from "../services/carbonTokenContract";

// Function to fetch CarbonSubmitted events
export const useFetchCarbonSubmittedEvents = () => {
  return useContractEvents({
    contract: carbonTokenContract,
    eventName: "CarbonSubmitted", // Correct event name from the ABI
    fromBlock: 0n, // Fetch from the genesis block
  });
};

// Function to fetch CarbonVerified events
export const useFetchCarbonVerifiedEvents = () => {
  return useContractEvents({
    contract: carbonTokenContract,
    eventName: "CarbonVerified", // Correct event name from the ABI
    fromBlock: 0n, // Fetch from the genesis block
  });
};

// Since the TokensMinted event is not present in the ABI, I’ve removed the related function.

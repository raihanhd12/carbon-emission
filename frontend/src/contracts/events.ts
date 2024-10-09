import { useReadContract, useContractEvents } from 'thirdweb/react';
import { carbonTokenContract } from '../contracts/carbonTokenContract';
import { prepareEvent } from 'thirdweb';

// Function to fetch carbon submissions
export const useFetchCarbonSubmissions = (address: string) => {
  return useReadContract({
    contract: carbonTokenContract,
    method: "getAllSubmissions",
    params: [address],
  });
};

// Function to fetch verified carbon amounts
export const useFetchVerifiedCarbon = (address: string) => {
  return useReadContract({
    contract: carbonTokenContract,
    method: "getVerifiedCarbon",
    params: [address],
  });
};

// Function to fetch CarbonSubmitted events
export const useFetchCarbonSubmittedEvents = () => {
  const carbonSubmittedEvent = prepareEvent({
    signature: "event CarbonSubmitted(address indexed seller, uint256 id, uint256 amount)",
  });

  return useContractEvents({
    contract: carbonTokenContract,
    events: [carbonSubmittedEvent],
  });
};

// Function to fetch CarbonVerified events
export const useFetchCarbonVerifiedEvents = () => {
  const carbonVerifiedEvent = prepareEvent({
    signature: "event CarbonVerified(address indexed verifier, address indexed seller, uint256 id, uint256 verifiedAmount)",
  });

  return useContractEvents({
    contract: carbonTokenContract,
    events: [carbonVerifiedEvent],
  });
};

// Function to fetch TokensMinted events
export const useFetchTokensMintedEvents = () => {
  const tokensMintedEvent = prepareEvent({
    signature: "event TokensMinted(address indexed seller, uint256 amount)",
  });

  return useContractEvents({
    contract: carbonTokenContract,
    events: [tokensMintedEvent],
  });
};

// Function to fetch a specific carbon submission by ID
export const useFetchCarbonSubmissionById = (seller: string, submissionId: bigint) => {
  return useReadContract({
    contract: carbonTokenContract,
    method: "getCarbonSubmissionById",
    params: [seller, submissionId],
  });
};

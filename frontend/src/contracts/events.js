import { ethers } from "ethers";
import { carbonTokenABI } from "../services/carbonTokenABI"; // Import ABI

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Get contract address from env
const PROVIDER_URL = "http://127.0.0.1:8545"; // Adjust this if you're on a different network
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);

// Function to get CarbonSubmitted events
export const getCarbonSubmittedEvents = async () => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, carbonTokenABI, provider);
    const filter = contract.filters.CarbonSubmitted();

    // Use provider.getLogs with a specific block range and topics to ensure correct retrieval
    const logs = await provider.getLogs({
      address: CONTRACT_ADDRESS,
      topics: filter.topics,
      fromBlock: 0,
      toBlock: "latest",
    });

    const parsedEvents = logs.map((log) => {
      const parsedLog = contract.interface.parseLog(log);
      return {
        transactionHash: log.transactionHash,
        seller: parsedLog.args.seller,
        id: parsedLog.args.id.toString(),
        amount: parsedLog.args.amount.toString(),
        pricePerTon: parsedLog.args.pricePerTon.toString(),
        timestamp: new Date(parsedLog.args.timestamp.toNumber() * 1000).toLocaleString(),
        blockNumber: log.blockNumber,
      };
    });

    return parsedEvents;
  } catch (error) {
    console.error("Error fetching CarbonSubmitted events:", error);
    throw error;
  }
};

// Function to get CarbonVerified events
export const getCarbonVerifiedEvents = async () => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, carbonTokenABI, provider);
    const filter = contract.filters.CarbonVerified();

    const logs = await provider.getLogs({
      address: CONTRACT_ADDRESS,
      topics: filter.topics,
      fromBlock: 0,
      toBlock: "latest",
    });

    const parsedEvents = logs.map((log) => {
      const parsedLog = contract.interface.parseLog(log);
      return {
        transactionHash: log.transactionHash,
        verifier: parsedLog.args.verifier,
        seller: parsedLog.args.seller,
        id: parsedLog.args.id.toString(),
        verifiedAmount: parsedLog.args.verifiedAmount.toString(),
        verifiedPrice: parsedLog.args.verifiedPrice.toString(),
        timestamp: new Date(parsedLog.args.timestamp.toNumber() * 1000).toLocaleString(),
        blockNumber: log.blockNumber,
      };
    });

    return parsedEvents;
  } catch (error) {
    console.error("Error fetching CarbonVerified events:", error);
    throw error;
  }
};

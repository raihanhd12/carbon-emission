import { ethers } from "ethers";
import { carbonTokenABI } from "../services/carbonTokenABI"; // Import ABI

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Get contract address from env

// Manually create an Ethers.js provider using the localhost RPC
const PROVIDER_URL = "http://127.0.0.1:8545"; // Adjust this if you're on a different network
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);

// Function to get CarbonSubmitted events using ethers.js
export const getCarbonSubmittedEvents = async () => {
  try {
    // Create an Ethers.js contract instance using ABI, contract address, and provider
    const contract = new ethers.Contract(CONTRACT_ADDRESS, carbonTokenABI, provider);

    // Fetch 'CarbonSubmitted' events
    const filter = contract.filters.CarbonSubmitted();

    // Get the logs from the blockchain
    const logs = await provider.getLogs({
      ...filter,
      fromBlock: 0, // Start from the genesis block
      toBlock: "latest", // Fetch up to the latest block
    });

    // Parse the logs to extract the event data
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

    return parsedEvents; // Return the parsed event data
  } catch (error) {
    console.error("Error fetching CarbonSubmitted events:", error);
    throw error;
  }
};

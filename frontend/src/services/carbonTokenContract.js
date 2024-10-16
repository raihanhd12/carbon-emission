import { getContract } from "thirdweb";
import { localhost } from "thirdweb/chains";
import { client } from './client';
import { carbonTokenABI } from './carbonTokenABI';

// Connect to your contract
export const carbonTokenContract = getContract({
  client,
  chain: localhost, // Localhost testnet
  address: import.meta.env.VITE_CONTRACT_ADDRESS, // Replace with your actual contract address
  abi: carbonTokenABI,
});


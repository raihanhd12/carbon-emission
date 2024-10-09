import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from '../client';
import { carbonTokenABI } from './carbonTokenABI';

// Connect to your contract
export const carbonTokenContract = getContract({
  client,
  chain: defineChain(11155111), // Sepolia testnet
  address: "0x1b72b7C2c67582ac0AA09291D5485bDA0EBC0f9A", // Replace with your actual contract address
  abi: carbonTokenABI,
});
// SubmitCarbon.tsx

import React, { useState } from 'react';
import { useSendTransaction } from 'thirdweb/react'; // Hook for sending transactions
import { prepareContractCall } from 'thirdweb'; // Prepare the contract call
import { carbonTokenContract } from '../../contracts/carbonTokenContract'; // Import the contract

const SubmitCarbon: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendTransaction, error } = useSendTransaction(); // Transaction hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      setLoading(true);

      // Prepare the contract call
      const transaction = prepareContractCall({
        contract: carbonTokenContract, // Use the imported contract
        method: "submitCarbon", // The method in your contract
        params: [BigInt(amount)], // Convert amount to BigInt for Solidity compatibility
      });

      // Send the transaction
      await sendTransaction(transaction);

      console.log(`Successfully submitted ${amount} tons of carbon`);
    } catch (err) {
      console.error("Transaction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-white">
          Carbon Amount (tons)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter carbon amount"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-violet-500 text-white p-2 rounded hover:bg-violet-600 disabled:bg-violet-300"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Carbon'}
      </button>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </form>
  );
};

export default SubmitCarbon;

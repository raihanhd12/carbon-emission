import React, { useState } from 'react';
import { useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { carbonTokenContract } from '../../contracts/carbonTokenContract';

interface VerifyCarbonProps {
  submission: {
    seller: string;
    submissionId: number; // Add submissionId to the props
    amount: number;
  };
}

const VerifyCarbon: React.FC<VerifyCarbonProps> = ({ submission }) => {
  const [verifiedAmount, setVerifiedAmount] = useState(submission.amount.toString());
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendTransaction, error } = useSendTransaction();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedAmount) return;

    try {
      setLoading(true);

      const transaction = prepareContractCall({
        contract: carbonTokenContract,
        method: "verifyCarbon",
        params: [submission.seller, submission.submissionId, BigInt(verifiedAmount)], // Include submissionId in params
      });

      await sendTransaction(transaction);

      console.log(`Successfully verified ${verifiedAmount} tons of carbon for ${submission.seller}`);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex items-center space-x-2">
      <input
        type="number"
        value={verifiedAmount}
        onChange={(e) => setVerifiedAmount(e.target.value)}
        className="w-24 p-1 text-black rounded"
        placeholder="Amount"
      />
      <button 
        type="submit" 
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p className="text-red-500 text-sm">Error: {error.message}</p>}
    </form>
  );
};

export default VerifyCarbon;

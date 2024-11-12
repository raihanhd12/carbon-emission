import React, { useState } from "react";
import { useVerifyCarbon } from "../../contracts/admin";

const VerifyCarbon = ({ submission, onVerify, onError }) => {
  const [verifiedAmount, setVerifiedAmount] = useState(submission.amount || "");
  const [verifiedPricePerTon, setVerifiedPricePerTon] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyCarbonSubmission } = useVerifyCarbon();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verifiedAmount) {
      onError("Verified amount is required.");
      return;
    }

    if (!verifiedPricePerTon) {
      onError("Verified price per ton (Rupiah) is required.");
      return;
    }

    const parsedAmount = Number(verifiedAmount);
    const submittedAmount = Number(submission.amount);

    if (parsedAmount > submittedAmount) {
      onError(
        `Verified amount cannot exceed submitted amount (${submittedAmount}).`
      );
      setVerifiedAmount(submission.amount);
      return;
    }

    try {
      setLoading(true);

      // Send verifiedAmount and verifiedPricePerTon to contract
      await verifyCarbonSubmission(
        submission.seller,
        submission.submissionId,
        BigInt(parsedAmount),
        BigInt(verifiedPricePerTon),
        onError
      );

      onVerify();
    } catch (error) {
      console.error("Transaction failed:", error);
      onError("Transaction failed. Please try again.");
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
        placeholder="Verified Amount"
        max={submission.amount}
        min="0"
        className="px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <input
        type="number"
        value={verifiedPricePerTon}
        onChange={(e) => setVerifiedPricePerTon(e.target.value)}
        placeholder="Verified Price per Ton (Rupiah)"
        min="0"
        className="px-3 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-violet-300 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
};

export default VerifyCarbon;

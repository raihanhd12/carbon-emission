import React, { useState } from "react";
import { useSubmitCarbon } from "../../contracts/seller";

const SubmitCarbon = ({
  address,
  hasUnverifiedSubmission,
  onSubmit,
  onError,
}) => {
  const [amount, setAmount] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [loading, setLoading] = useState(false);

  const { submitCarbon } = useSubmitCarbon();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !pricePerTon) {
      onError("Carbon amount and price per ton are required.");
      return;
    }

    const parsedAmount = BigInt(Number(amount));
    const parsedPrice = BigInt(Number(pricePerTon)); // Input langsung dalam bentuk Wei

    if (parsedAmount <= 0n || parsedPrice <= 0n) {
      onError("Carbon amount and price per ton must be greater than zero.");
      return;
    }

    if (hasUnverifiedSubmission) {
      onError(
        "You have an unverified submission. Please wait for verification."
      );
      return;
    }

    try {
      setLoading(true);
      const success = await onSubmit(parsedAmount, parsedPrice);
      if (success) {
        setAmount("");
        setPricePerTon("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-white"
        >
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
          disabled={hasUnverifiedSubmission}
        />
      </div>

      <div>
        <label
          htmlFor="pricePerTon"
          className="block text-sm font-medium text-white"
        >
          Price per Ton (in Wei)
        </label>
        <input
          type="number"
          id="pricePerTon"
          value={pricePerTon}
          onChange={(e) => setPricePerTon(e.target.value)}
          placeholder="Enter price per ton in Wei"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          required
          disabled={hasUnverifiedSubmission}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-violet-500 text-white p-2 rounded hover:bg-violet-600 disabled:bg-violet-300"
        disabled={loading || hasUnverifiedSubmission}
      >
        {loading
          ? "Submitting..."
          : hasUnverifiedSubmission
          ? "Waiting for Verification"
          : "Submit Carbon"}
      </button>
    </form>
  );
};

export default SubmitCarbon;

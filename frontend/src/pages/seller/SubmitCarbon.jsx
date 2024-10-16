import React, { useState } from "react";
import { useSubmitCarbon } from "../../contracts/seller";

const SubmitCarbon = ({
  address,
  hasUnverifiedSubmission,
  onSubmit,
  onError,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { submitCarbon } = useSubmitCarbon();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitted amount:", amount); // Debugging: Check what's being captured from input

    if (!amount) {
      onError("Carbon amount is required.");
      return;
    }

    const parsedAmount = Number(amount); // Parse to a number

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      onError("Carbon amount must be greater than zero.");
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

      // Pass parsed amount to onSubmit (parsedAmount instead of original amount)
      await onSubmit(parsedAmount);

      setAmount(""); // Clear the input field after submission
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

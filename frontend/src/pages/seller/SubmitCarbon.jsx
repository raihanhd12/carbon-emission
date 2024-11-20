import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSubmitCarbon } from "../../contracts/seller";

// Fungsi untuk mengonversi ETH ke Wei
const convertEthToWei = (eth) => {
  return BigInt(eth * 1e18);
};

const SubmitCarbon = ({ address, isDisabled }) => {
  const { submitCarbon } = useSubmitCarbon();
  const [amount, setAmount] = useState("");
  const [pricePerTonEth, setPricePerTonEth] = useState(""); // Harga dalam ETH
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedAmount = BigInt(amount);
      // Pass ETH value directly, without pre-converting to Wei
      const success = await submitCarbon(
        parsedAmount,
        pricePerTonEth,
        (error) => toast.error(error.message || "Error during submission")
      );

      if (success) {
        toast.success("Carbon submission successful!");
        setAmount("");
        setPricePerTonEth("");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 rounded-lg shadow-lg border border-zinc-800 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 block">
            Amount (tons)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                     placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter amount in tons"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 block">
            Price per Ton (in ETH)
          </label>
          <input
            type="number"
            min="0"
            step="0.0001"
            value={pricePerTonEth}
            onChange={(e) => setPricePerTonEth(e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                     placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter price in ETH"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled || isSubmitting}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-md
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Carbon Credits"}
        </button>
      </form>
    </div>
  );
};

export default SubmitCarbon;

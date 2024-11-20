import React, { useState } from "react";
import { useBuyTokens } from "../../contracts/buyer";
import { ArrowRight, CreditCard, Wallet, Scale } from "lucide-react";

const BuyToken = ({ sellerAddress, submission }) => {
  const [amount, setAmount] = useState(1);
  const { buyTokens } = useBuyTokens();

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setAmount(value > 0 ? value : 0);
  };

  const handleBuyTokens = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const success = await buyTokens(
        sellerAddress,
        submission.submissionId,
        amount,
        Number(submission.verifiedPriceInEth),
        (errMsg) => alert(errMsg)
      );
      if (success) {
        alert("Tokens purchased successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to purchase tokens.");
    }
  };

  const pricePerTokenEth = Number(submission.verifiedPriceInEth);
  const totalPriceEth = amount * pricePerTokenEth;

  return (
    <div className="col-span-2 bg-gradient-to-br from-violet-500/10 to-zinc-800 p-8 rounded-xl border border-violet-500/20 hover:border-violet-500/30 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-violet-500/20 rounded-lg">
          <CreditCard className="w-6 h-6 text-violet-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Purchase Tokens</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400">Amount to Purchase</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            max={submission.verifiedAmount.toString()}
            className="w-full p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white text-lg focus:outline-none focus:border-violet-500 transition-colors"
          />
          <p className="mt-2 text-sm text-zinc-500">
            Max available: {submission.verifiedAmount.toString()} tokens
          </p>
        </div>

        <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Wallet className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400">Price Details</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Price per Token:</span>
              <span className="text-violet-400 font-medium">
                {pricePerTokenEth} ETH
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-700 pt-2">
              <span className="text-zinc-400">Total Price:</span>
              <span className="text-violet-400 font-bold text-lg">
                {totalPriceEth} ETH
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleBuyTokens}
        disabled={amount <= 0}
        className="w-full bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center transition-colors duration-300"
      >
        Complete Purchase
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
};

export default BuyToken;

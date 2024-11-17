import React, { useState } from "react";
import { ClipboardCheck, X } from "lucide-react";
import { useVerifyCarbon } from "../../contracts/admin";

const VerifyCarbon = ({ submission, onVerify, onError }) => {
  const [showModal, setShowModal] = useState(false);
  const [verifiedAmount, setVerifiedAmount] = useState(submission.amount || "");
  const [verifiedPricePerTon, setVerifiedPricePerTon] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyCarbonSubmission } = useVerifyCarbon();

  const convertEthToWei = (eth) => BigInt(Number(eth) * 1e18);

  const convertWeiToEth = (wei) => (Number(wei) / 1e18).toString();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verifiedAmount) {
      onError("Verified amount is required.");
      return;
    }

    if (!verifiedPricePerTon) {
      onError("Verified price per ton (ETH) is required.");
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
      const priceInWei = convertEthToWei(verifiedPricePerTon);

      await verifyCarbonSubmission(
        submission.seller,
        submission.submissionId,
        BigInt(parsedAmount),
        priceInWei,
        onError
      );

      onVerify();
      setShowModal(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      onError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
      >
        <ClipboardCheck className="w-4 h-4 mr-2" />
        Verify
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-zinc-900/75 transition-opacity"
              onClick={() => setShowModal(false)}
            />

            <div className="inline-block align-bottom bg-zinc-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-700">
                <h3 className="text-lg font-medium text-violet-300">
                  Verify Carbon Submission
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleVerify} className="px-6 pt-6 pb-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Submission Details
                    </label>
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-zinc-700/50">
                      <div>
                        <span className="text-sm text-gray-400">
                          Submission ID
                        </span>
                        <p className="text-violet-300 font-medium">
                          {submission.submissionId}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">
                          Price Per Ton
                        </span>
                        <p className="text-violet-300 font-medium truncate">
                          {convertWeiToEth(submission.pricePerTon)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">
                          Submitted Amount
                        </span>
                        <p className="text-violet-300 font-medium">
                          {submission.amount} tons
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Timestamp</span>
                        <p className="text-violet-300 font-medium">
                          {submission.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Verified Amount (tons)
                    </label>
                    <input
                      type="number"
                      value={verifiedAmount}
                      onChange={(e) => setVerifiedAmount(e.target.value)}
                      max={submission.amount}
                      min="0"
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Verified Price per Ton (ETH)
                    </label>
                    <input
                      type="number"
                      value={verifiedPricePerTon}
                      onChange={(e) => setVerifiedPricePerTon(e.target.value)}
                      min="0"
                      step="any"
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-zinc-700 text-gray-300 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify Submission"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyCarbon;

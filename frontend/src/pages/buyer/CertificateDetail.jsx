import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { carbonTokenContract } from "../../services/carbonTokenContract";
import { ArrowLeft, ChevronRight, X } from "lucide-react";

const TokenModal = ({ tokenDetail, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-8 max-w-2xl w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-violet-300">Token Details</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-300">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="bg-zinc-700/30 p-4 rounded-lg">
          <span className="text-zinc-400 text-sm">Registration Number</span>
          <p className="text-white font-mono mt-1">
            {tokenDetail?.registrationNumber || "N/A"}
          </p>
        </div>
        <div className="bg-zinc-700/30 p-4 rounded-lg">
          <span className="text-zinc-400 text-sm">Price</span>
          <p className="text-violet-400 font-medium mt-1">
            {tokenDetail?.priceInEth?.toString() || "0"} ETH
          </p>
        </div>
        <div className="bg-zinc-700/30 p-4 rounded-lg">
          <span className="text-zinc-400 text-sm">Timestamp</span>
          <p className="text-white mt-1">
            {tokenDetail?.timestamp
              ? new Date(Number(tokenDetail.timestamp) * 1000).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CertificateDetail = () => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTokenNumber, setSelectedTokenNumber] = useState(null);

  // Mendapatkan daftar purchase certificates
  const { data: purchaseCerts } = useReadContract({
    contract: carbonTokenContract,
    method: "getPurchaseCertificates",
    params: [address],
    watch: true,
  });

  // Mendapatkan detail token untuk modal
  const { data: tokenDetail } = useReadContract({
    contract: carbonTokenContract,
    method: "getTokenCertificate",
    params: [selectedTokenNumber],
    watch: true,
  });

  console.log(tokenDetail);
  const handleTokenClick = (token) => {
    setSelectedTokenNumber(token);
    setIsModalOpen(true);
  };

  if (!purchaseCerts || purchaseCerts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-violet-400 hover:text-violet-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Certificates
          </button>
          <div className="text-center text-zinc-400">
            No purchase certificates found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-violet-400 hover:text-violet-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Certificates
        </button>

        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
          <h3 className="text-xl font-semibold text-violet-300 mb-4">
            Registration Numbers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {purchaseCerts.map((cert) =>
              cert.registrationNumbers.map((regNum) => (
                <button
                  key={regNum}
                  onClick={() => handleTokenClick(regNum)}
                  className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors"
                >
                  <span className="text-violet-400 font-mono">{regNum}</span>
                  <ChevronRight className="w-4 h-4 text-violet-400" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TokenModal
          tokenDetail={tokenDetail}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTokenNumber(null);
          }}
        />
      )}
    </div>
  );
};

export default CertificateDetail;

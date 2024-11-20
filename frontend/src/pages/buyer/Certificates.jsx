import React, { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useNavigate } from "react-router-dom";
import { carbonTokenContract } from "../../services/carbonTokenContract";
import {
  FileText,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  ArrowRight,
} from "lucide-react";

const Certificates = () => {
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();
  const address = activeAccount?.address;

  const { data: purchaseCerts } = useReadContract({
    contract: carbonTokenContract,
    method: "getPurchaseCertificates",
    params: [address],
    watch: true,
  });

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8">
          Carbon Certificates
        </h2>
        <div className="grid gap-8 grid-cols-1">
          <div className="bg-zinc-800 rounded-xl border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h3 className="text-xl font-semibold text-violet-300">
                Purchase History
              </h3>
            </div>
            <div className="divide-y divide-zinc-700">
              {purchaseCerts?.map((cert) => (
                <div key={cert.submissionId.toString()} className="p-6">
                  <div className="flex items-start justify-between group hover:bg-zinc-700/30 p-4 rounded-lg transition-all">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-violet-400" />
                        <h4 className="text-lg font-medium text-white">
                          Purchase #{cert.submissionId.toString()}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-zinc-400">
                          <span>Total Tokens: </span>
                          <span className="text-violet-400">
                            {cert.totalAmount.toString()}
                          </span>
                        </div>
                        <div className="text-zinc-400">
                          <span>Total Price: </span>
                          <span className="text-violet-400">
                            {cert.totalPriceInEth.toString()} ETH
                          </span>
                        </div>
                        <div className="text-zinc-400">
                          <span>Date: </span>
                          <span className="text-white">
                            {formatDate(cert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/buyer/certificates/${address}/${cert.submissionId}`
                        )
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors"
                    >
                      <span className="text-violet-400">View Tokens</span>
                      <ArrowRight className="w-4 h-4 text-violet-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;

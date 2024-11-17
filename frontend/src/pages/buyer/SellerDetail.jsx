import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchSubmission, useFetchUserData } from "../../contracts/others";
import Breadcrumb from "../../components/Breadcrumb";
import {
  User2,
  Building2,
  CalendarDays,
  Wallet,
  Scale,
  ArrowLeftCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  BadgeCheck,
  Info,
} from "lucide-react";

const DetailCard = ({ icon: Icon, title, value, className = "" }) => (
  <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 hover:border-violet-500/30 transition-all duration-300">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-zinc-700/30 rounded-lg">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <div>
        <p className="text-sm text-zinc-400 mb-1">{title}</p>
        <p className={`text-lg font-semibold ${className || "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

const SellerDetail = () => {
  const { id: sellerAddress, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: userData } = useFetchUserData(sellerAddress);
  const {
    data: fetchedData,
    error: submissionDetailsError,
    isLoading: submissionDetailsLoading,
  } = useFetchSubmission();

  const [addresses, submissions] = fetchedData || [[], []];

  useEffect(() => {
    if (addresses.length > 0 && submissions.length > 0) {
      const sellerSubmissions = submissions.map((submission, index) => ({
        ...submission,
        sellerAddress: addresses[index],
      }));

      const parsedSubmissionId = BigInt(submissionId);

      const foundSubmission = sellerSubmissions.find(
        (sub) =>
          sub.sellerAddress.toLowerCase() === sellerAddress.toLowerCase() &&
          sub.submissionId === parsedSubmissionId
      );

      if (foundSubmission) {
        setSubmission(foundSubmission);
        setLoading(false);
      } else {
        setError("Submission not found.");
        setLoading(false);
      }
    }
  }, [addresses, submissions, sellerAddress, submissionId]);

  if (submissionDetailsLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mb-4"></div>
          <p className="text-zinc-400">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="bg-red-500/10 rounded-xl p-8 border border-red-500/20 text-center">
          <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
          <p className="text-zinc-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="bg-zinc-800/50 rounded-xl p-8 text-center max-w-md">
          <Info className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Not Found</h3>
          <p className="text-zinc-400">
            Submission not found for ID: {submissionId}
          </p>
        </div>
      </div>
    );
  }

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  const convertWeiToEth = (wei) => (Number(wei) / 1e18).toFixed(4);

  const {
    submissionId: id,
    amount,
    verifiedAmount,
    verifiedPrice,
    timestamp,
    verified,
  } = submission;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Breadcrumb />
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-white">
              Submission Details
            </h2>
            <Link
              to="/dashboard/buyer/sellers"
              className="flex items-center px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeftCircle className="w-5 h-5 mr-2" />
              Back to Sellers
            </Link>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-8 rounded-xl p-6 ${
            verified
              ? "bg-green-400/10 border border-green-400/20"
              : "bg-yellow-400/10 border border-yellow-400/20"
          }`}
        >
          <div className="flex items-center">
            {verified ? (
              <BadgeCheck className="w-8 h-8 text-green-400 mr-3" />
            ) : (
              <Clock className="w-8 h-8 text-yellow-400 mr-3" />
            )}
            <div>
              <h3
                className={`text-lg font-semibold ${
                  verified ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {verified ? "Verified Submission" : "Pending Verification"}
              </h3>
              <p className="text-zinc-400">
                {verified
                  ? "This submission has been verified and is ready for trading"
                  : "This submission is awaiting verification from authorized verifiers"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seller Info */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center">
                  <User2 className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {userData?.[1] || "N/A"}
                  </h3>
                  <p className="text-zinc-400 flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {userData?.[2] || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-1">Seller Address</p>
                  <p className="text-zinc-300 font-mono">
                    {formatAddress(sellerAddress)}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-1">Submission ID</p>
                  <p className="text-zinc-300">#{id?.toString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailCard
                icon={Scale}
                title="Total Emission Amount"
                value={`${amount?.toString()} tons`}
                className="text-violet-400"
              />
              <DetailCard
                icon={CheckCircle2}
                title="Verified Amount"
                value={`${verifiedAmount?.toString()} tons`}
                className="text-green-400"
              />
              <DetailCard
                icon={DollarSign}
                title="Verified Price"
                value={`${convertWeiToEth(verifiedPrice)} ETH`}
                className="text-violet-400"
              />
              <DetailCard
                icon={CalendarDays}
                title="Submission Date"
                value={
                  timestamp
                    ? new Date(Number(timestamp) * 1000).toLocaleDateString()
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetail;

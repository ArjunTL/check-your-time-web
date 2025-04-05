"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, doc, getDoc } from "@/firebaseConfig";
import { motion } from "framer-motion";

interface PrizeWinner {
  ticket: string;
  location?: string;
}

interface Prize {
  amount: number;
  ticket?: string;
  location?: string;
  numbers?: string[];
  winners?: PrizeWinner[];
}

interface LotteryResult {
  id: string;
  lotteryId: string;
  lottery: string;
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  location: string;
  issuedBy: string;
  issuerTitle: string;
  nextDrawDate: string;
  nextDrawLocation: string;
  prizes: {
    firstPrize: Prize;
    consolationPrize: Prize;
    secondPrize: Prize;
    thirdPrize: Prize;
    fourthPrize: Prize;
    fifthPrize: Prize;
    sixthPrize: Prize;
    seventhPrize: Prize;
    eighthPrize: Prize;
  };
}

export default function ViewLotteryResultPage() {
  const [lotteryResult, setLotteryResult] = useState<LotteryResult | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("prizes");
  const { id } = useParams();
  const router = useRouter();

  const lotteryId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (lotteryId) {
      fetchLotteryResult(lotteryId);
    }
  }, [lotteryId]);

  const fetchLotteryResult = async (id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "lottery_results", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLotteryResult({ id, ...docSnap.data() } as LotteryResult);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };


  // Order of prizes to display
  const prizeOrder = [
    "firstPrize",
    "consolationPrize",
    "secondPrize",
    "thirdPrize",
    "fourthPrize",
    "fifthPrize",
    "sixthPrize",
    "seventhPrize",
    "eighthPrize",
  ];

  // Prize display name formatting
  const formatPrizeName = (name: string) => {
    if (name === "firstPrize") return "First Prize";
    if (name === "consolationPrize") return "Consolation Prize";
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-gray-50">
        <div className="flex flex-col items-center p-8 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-indigo-800 text-lg font-medium">
            Loading lottery results...
          </p>
          <p className="mt-2 text-gray-500">
            Please wait while we fetch the latest data
          </p>
        </div>
      </div>
    );
  }

  if (!lotteryResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            No Result Found
          </h2>
          <p className="text-gray-600 mb-8">
            The lottery result you are looking for could not be found or might
            have been removed.
          </p>
          <button
            onClick={() => router.push("/lottery")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 shadow-md"
          >
            Back to Results
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate prize statistics
  const totalPrizeAmount = Object.values(lotteryResult.prizes).reduce(
    (sum, prize) => sum + (prize ? prize.amount : 0),
    0
  );

  const totalWinners = Object.values(lotteryResult.prizes).reduce(
    (sum, prize) =>
      sum +
      (prize && prize.winners ? prize.winners.length : 0) +
      (prize && prize.ticket ? 1 : 0),
    0
  );

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient Background */}
      <motion.header
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        {/* <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
            <circle cx="80" cy="20" r="15" fill="white" />
            <circle cx="20" cy="80" r="10" fill="white" />
            <path
              d="M40,30 Q60,5 80,30"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M10,50 Q30,70 50,50"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </div> */}

        <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/lottery")}
              className="flex items-center text-white hover:text-indigo-100 transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
            <div className="flex items-center">
              <span className="bg-white bg-opacity-20 text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white border-opacity-30 shadow-sm">
                #{lotteryResult.drawNumber}
              </span>
            </div>
          </div>

          <motion.div
            className="text-center pb-6 md:pb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-shadow">
              {lotteryResult.lottery}
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto backdrop-blur-sm bg-indigo-900 bg-opacity-10 inline-block px-4 py-1 rounded-full">
              Official results from the {lotteryResult.drawDate} draw
            </p>
          </motion.div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto -mb-px scrollbar-hide">
              {[
                { key: "prizes", label: "Prize Results" },
                { key: "details", label: "Draw Details" },
                { key: "next", label: "Next Draw" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`px-6 py-4 text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() =>{console.log("test");
                     setActiveTab(tab.key)}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pb-12 -mt-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 mt-4">
          {[
            {
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
              bgColor: "bg-blue-100",
              textColor: "text-blue-600",
              label: "Draw Date",
              value: lotteryResult.drawDate,
            },
            {
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              bgColor: "bg-purple-100",
              textColor: "text-purple-600",
              label: "Total Prize Pool",
              value: `₹${totalPrizeAmount.toLocaleString()}`,
            },
            {
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              bgColor: "bg-green-100",
              textColor: "text-green-600",
              label: "Total Winners",
              value: totalWinners,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <div className={`rounded-full ${stat.bgColor} p-3 mr-4`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${stat.textColor}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="font-medium text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "prizes" && (
          <div className="space-y-6">
            {prizeOrder.map((prizeKey, index) => {
              const prize =
                lotteryResult.prizes[
                  prizeKey as keyof typeof lotteryResult.prizes
                ];
              if (!prize || prize.amount === 0) return null;

              // Determine style based on prize category
              const prizeStyles = {
                firstPrize: {
                  badgeColor: "bg-yellow-100 text-yellow-800",
                  borderColor: "border-l-yellow-500",
                  iconColor: "text-yellow-600",
                  bgAccent: "bg-yellow-50",
                },
                consolationPrize: {
                  badgeColor: "bg-purple-100 text-purple-800",
                  borderColor: "border-l-purple-500",
                  iconColor: "text-purple-600",
                  bgAccent: "bg-purple-50",
                },
                secondPrize: {
                  badgeColor: "bg-blue-100 text-blue-800",
                  borderColor: "border-l-blue-500",
                  iconColor: "text-blue-600",
                  bgAccent: "bg-blue-50",
                },
                thirdPrize: {
                  badgeColor: "bg-green-100 text-green-800",
                  borderColor: "border-l-green-500",
                  iconColor: "text-green-600",
                  bgAccent: "bg-green-50",
                },
                default: {
                  badgeColor: "bg-gray-100 text-gray-800",
                  borderColor: "border-l-gray-400",
                  iconColor: "text-gray-600",
                  bgAccent: "bg-gray-50",
                },
              };

              const style =
                prizeStyles[prizeKey as keyof typeof prizeStyles] ||
                prizeStyles.default;

              return (
                <motion.div
                  key={prizeKey}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${style.borderColor} hover:shadow-md transition-shadow`}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <span
                          className={`${style.badgeColor} text-xs font-semibold px-3 py-1 rounded-md mr-3`}
                        >
                          {formatPrizeName(prizeKey)}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          ₹{prize.amount.toLocaleString()}
                        </h3>
                      </div>

                      {prize.ticket && (
                        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg relative group">
                          <span className="text-gray-500 mr-2 text-sm">
                            Winning Ticket:
                          </span>
                          <span className="font-mono font-medium">
                            {prize.ticket}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {prize.location && (
                        <div className="flex flex-wrap items-center text-sm">
                          <span className="text-gray-500 w-24">Location:</span>
                          <span className="text-gray-900">
                            {prize.location}
                          </span>
                        </div>
                      )}

                      {prize.numbers && prize.numbers.length > 0 && (
                        <div>
                          <span className="text-gray-500 text-sm block mb-2">
                            Winning Numbers:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {prize.numbers.map((number, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm shadow-sm"
                              >
                                {number}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {prize.winners && prize.winners.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">
                              Winners:
                            </span>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                              {prize.winners.length} winner(s)
                            </span>
                          </div>

                          <div
                            className={`${style.bgAccent} rounded-lg overflow-hidden border border-gray-100`}
                          >
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ticket Number
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Location
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {prize.winners.map((winner, idx) => (
                                    <tr
                                      key={idx}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-gray-900">
                                        {winner.ticket}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {winner.location || "Unknown"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === "details" && (
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Draw Details</h2>
              <p className="text-gray-600 text-sm mt-1">
                Complete information about this lottery draw
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Draw Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {[
                        {
                          label: "Draw Number",
                          value: lotteryResult.drawNumber,
                        },
                        { label: "Draw Date", value: lotteryResult.drawDate },
                        { label: "Draw Time", value: lotteryResult.drawTime },
                        { label: "Location", value: lotteryResult.location },
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                        >
                          <span className="text-gray-500 w-32 text-sm">
                            {item.label}:
                          </span>
                          <span className="font-medium">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Issuer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      <li className="flex border-b border-gray-100 pb-3">
                        <span className="text-gray-500 w-32 text-sm">
                          Issued By:
                        </span>
                        <span className="font-medium">
                          {lotteryResult.issuedBy}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-500 w-32 text-sm">
                          Title:
                        </span>
                        <span className="font-medium">
                          {lotteryResult.issuerTitle}
                        </span>
                      </li>
                    </ul>
                  </div>

                  
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "next" && (
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Next Draw Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Details about the upcoming lottery draw
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Next Draw Date & Location
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="text-gray-500 w-32 text-sm">Date:</span>
                      <span className="font-medium">
                        {lotteryResult.nextDrawDate || "Not announced yet"}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-500 w-32 text-sm">
                        Location:
                      </span>
                      <span className="font-medium">
                        {lotteryResult.nextDrawLocation || "To be determined"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                  <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                    How to Participate
                  </h3>
                  <ul className="space-y-3 text-sm text-indigo-800">
                    <li className="flex items-start">
                      <span className="bg-white rounded-full p-1 mr-3 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span>
                        Purchase tickets from authorized lottery retailers
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white rounded-full p-1 mr-3 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span>
                        Check closing time for ticket sales before the draw
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white rounded-full p-1 mr-3 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span>
                        Keep your ticket safe until results are announced
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">
                      Want to participate in the next draw?
                    </h3>
                    <p className="text-indigo-100">
                      Check with authorized retailers for ticket availability.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/buy-tickets")}
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors shadow-md"
                  >
                    Find Retailers Near You
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

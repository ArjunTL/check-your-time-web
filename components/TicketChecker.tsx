"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useLotteryCache } from "@/hooks/useLotteryCache";
import { validateTicketFormat } from "@/lib/ticket-validator";
import { checkTicketPrize, type TicketCheckResult } from "@/lib/prize-checker";

interface LotteryOption {
  id: string;
  name: string;
  drawNumber: string;
}

export default function TicketChecker() {
  const [drawDate, setDrawDate] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [selectedLottery, setSelectedLottery] = useState("");

  const [dateError, setDateError] = useState("");
  const [ticketError, setTicketError] = useState("");
  const [lotteryError, setLotteryError] = useState("");

  const [lotteryOptions, setLotteryOptions] = useState<LotteryOption[]>([]);
  const [showLotteryInfo, setShowLotteryInfo] = useState(false);
  const [noDataForDate, setNoDataForDate] = useState(false);
  const [isFetchingDate, setIsFetchingDate] = useState(false);

  const [checkResult, setCheckResult] = useState<TicketCheckResult | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { loading, error, fetchByDate } = useLotteryCache();

  // Reset errors when inputs change
  useEffect(() => {
    if (drawDate) setDateError("");
  }, [drawDate]);

  useEffect(() => {
    if (ticketNumber) setTicketError("");
  }, [ticketNumber]);

  useEffect(() => {
    if (selectedLottery) setLotteryError("");
  }, [selectedLottery]);

  // Fetch lottery data when date changes
  useEffect(() => {
    if (!drawDate) {
      setShowLotteryInfo(false);
      setNoDataForDate(false);
      setLotteryOptions([]);
      setSelectedLottery("");
      return;
    }

    const fetchLotteryData = async () => {
      setIsFetchingDate(true);
      setShowLotteryInfo(false);
      setNoDataForDate(false);
      setShowResult(false);
      setCheckResult(null);

      try {
        const lotteries = await fetchByDate(drawDate);

        if (lotteries.length === 0) {
          setNoDataForDate(true);
          setLotteryOptions([]);
          setSelectedLottery("");
        } else {
          const options = lotteries.map((l) => ({
            id: l.id,
            name: l.lotteryName,
            drawNumber: l.drawNumber,
          }));

          setLotteryOptions(options);
          setShowLotteryInfo(true);

          // Auto-select if only one lottery
          if (options.length === 1) {
            setSelectedLottery(options[0].id);
          } else {
            setSelectedLottery("");
          }
        }
      } catch (err) {
        console.error("Error fetching lottery data:", err);
      } finally {
        setIsFetchingDate(false);
      }
    };

    fetchLotteryData();
  }, [drawDate, fetchByDate]);

  const handleCheckTicket = async () => {
    // Validate inputs
    let hasError = false;

    if (!drawDate) {
      setDateError("Please select a draw date");
      hasError = true;
    }

    const validation = validateTicketFormat(ticketNumber);
    if (!validation.valid) {
      setTicketError(validation.error || "Invalid ticket format");
      hasError = true;
    }

    if (lotteryOptions.length > 1 && !selectedLottery) {
      setLotteryError("Please select a lottery");
      hasError = true;
    }

    if (lotteryOptions.length === 0) {
      setDateError("No lottery data available for this date");
      hasError = true;
    }

    if (hasError) return;

    // Check ticket
    setIsChecking(true);
    setShowResult(false);

    // Simulate slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const lotteries = await fetchByDate(drawDate);
      const lottery = lotteries.find((l) => l.id === selectedLottery);

      if (!lottery) {
        setTicketError("Lottery not found. Please try again.");
        setIsChecking(false);
        return;
      }

      const result = checkTicketPrize(
        validation.normalized!,
        lottery as unknown as Parameters<typeof checkTicketPrize>[1],
      );
      setCheckResult(result);
      setShowResult(true);

      // Trigger animation
      if (result.won) {
        triggerSuccessAnimation();
      } else {
        triggerNeutralAnimation();
      }
    } catch (err) {
      console.error("Error checking ticket:", err);
      setTicketError("Failed to check ticket. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const triggerSuccessAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#6ee7b7"],
    });
  };

  const triggerNeutralAnimation = () => {
    // Subtle animation - just a gentle shake handled by CSS
  };

  const handleReset = () => {
    setDrawDate("");
    setTicketNumber("");
    setSelectedLottery("");
    setLotteryOptions([]);
    setShowLotteryInfo(false);
    setNoDataForDate(false);
    setShowResult(false);
    setCheckResult(null);
    setDateError("");
    setTicketError("");
    setLotteryError("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 mb-4">
          <span className="text-2xl">🎟️</span>
          <span className="text-sm font-semibold text-emerald-800">
            Kerala Lottery Checker
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Check Your Lottery Ticket
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Enter your draw date and ticket number to see if you won
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
        {/* Date Input */}
        <div className="mb-6">
          <label
            htmlFor="draw-date"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Draw Date <span className="text-red-500">*</span>
          </label>
          <input
            id="draw-date"
            type="date"
            value={drawDate}
            onChange={(e) => setDrawDate(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              dateError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
            } focus:outline-none focus:ring-4 transition-all text-gray-900`}
            aria-invalid={!!dateError}
            aria-describedby={dateError ? "date-error" : undefined}
          />
          {dateError && (
            <p
              id="date-error"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <span>⚠️</span>
              {dateError}
            </p>
          )}
        </div>

        {/* Loading State for Date */}
        {isFetchingDate && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
            <div className="h-5 w-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-800">
              Loading lottery data...
            </span>
          </div>
        )}

        {/* No Data Message */}
        {noDataForDate && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  No lottery results found for this date
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  Please choose another date or check back later.
                </p>
                <button
                  onClick={() => {
                    setNoDataForDate(false);
                    setDrawDate("");
                  }}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline"
                >
                  Choose another date
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lottery Info Display */}
        {showLotteryInfo && lotteryOptions.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900 mb-2">
                  {lotteryOptions.length === 1
                    ? "Lottery Found"
                    : `${lotteryOptions.length} Lotteries Found`}
                </p>
                {lotteryOptions.length === 1 ? (
                  <div className="text-sm text-emerald-800">
                    <p className="font-semibold">{lotteryOptions[0].name}</p>
                    <p className="text-xs text-emerald-700">
                      Draw: {lotteryOptions[0].drawNumber}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-emerald-700">
                    Multiple lotteries available. Please select one below.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lottery Selector (shown when multiple lotteries) */}
        {showLotteryInfo && lotteryOptions.length > 1 && (
          <div className="mb-6">
            <label
              htmlFor="lottery-select"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Lottery <span className="text-red-500">*</span>
            </label>
            <select
              id="lottery-select"
              value={selectedLottery}
              onChange={(e) => setSelectedLottery(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                lotteryError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              } focus:outline-none focus:ring-4 transition-all text-gray-900`}
              aria-invalid={!!lotteryError}
              aria-describedby={lotteryError ? "lottery-error" : undefined}
            >
              <option value="">Choose a lottery...</option>
              {lotteryOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} - {opt.drawNumber}
                </option>
              ))}
            </select>
            {lotteryError && (
              <p
                id="lottery-error"
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {lotteryError}
              </p>
            )}
          </div>
        )}

        {/* Ticket Number Input - Only show if lottery data is available */}
        {showLotteryInfo && (
          <div className="mb-6">
            <label
              htmlFor="ticket-number"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Ticket Number <span className="text-red-500">*</span>
            </label>
            <input
              id="ticket-number"
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
              placeholder="e.g., RT 207473 or 207473"
              className={`w-full px-4 py-3 rounded-xl border ${
                ticketError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              } focus:outline-none focus:ring-4 transition-all text-gray-900 font-mono`}
              aria-invalid={!!ticketError}
              aria-describedby={ticketError ? "ticket-error" : undefined}
            />
            {ticketError && (
              <p
                id="ticket-error"
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                {ticketError}
              </p>
            )}
          </div>
        )}

        {/* Check Button - Only show if lottery data is available */}
        {showLotteryInfo && (
          <button
            onClick={handleCheckTicket}
            disabled={isChecking || loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isChecking || loading ? (
              <>
                <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking your ticket...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Check Ticket</span>
              </>
            )}
          </button>
        )}

        {/* API Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Result Section */}
      {showResult && checkResult && (
        <div
          className={`mt-6 p-6 md:p-8 rounded-3xl shadow-xl border-2 ${
            checkResult.won
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-300 animate-scale-in"
              : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 animate-shake"
          }`}
        >
          {checkResult.won ? (
            <div className="text-center">
              <div className="mb-4 text-6xl animate-bounce-in">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-2">
                Congratulations!
              </h2>
              <p className="text-lg text-emerald-800 mb-4">
                Your ticket won a prize!
              </p>

              <div className="bg-white rounded-2xl p-6 mb-4 shadow-md">
                <div className="text-5xl md:text-6xl font-bold text-emerald-600 mb-2">
                  ₹{checkResult.prize!.amount.toLocaleString("en-IN")}
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-1">
                  {checkResult.prize!.level}
                </div>
                {checkResult.prize!.matchType === "last4" && (
                  <div className="text-sm text-gray-600 mt-2">
                    Matched last 4 digits:{" "}
                    <span className="font-mono font-bold">
                      {checkResult.prize!.ticket}
                    </span>
                  </div>
                )}
                {checkResult.prize!.location && (
                  <div className="text-sm text-gray-600 mt-1">
                    Location: {checkResult.prize!.location}
                  </div>
                )}
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                Check Another Ticket
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4 text-6xl">🎟️</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Better Luck Next Time
              </h2>
              <p className="text-gray-600 mb-6">
                Your ticket didn&apos;t win this time, but don&apos;t give up!
              </p>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
              >
                Check Another Ticket
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

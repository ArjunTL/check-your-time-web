"use client";

import type { FC } from "react";

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

export interface LotteryResultViewModel {
  id: string;
  lotteryName: string;
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
    ninthPrize?: Prize;
    tenthPrize?: Prize;
  };
}

interface ResultViewProps {
  result: LotteryResultViewModel;
  isAdmin?: boolean;
}

const ResultView: FC<ResultViewProps> = ({ result, isAdmin = false }) => {
  const { prizes } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              {isAdmin ? "Admin View" : "Official Result"}
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
              {result.lotteryName} – {result.drawNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {result.drawDate} • {result.drawTime} • {result.location}
            </p>
          </div>
          {isAdmin && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              Admin
            </span>
          )}
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-sm">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-yellow-400" />

          {/* Meta */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 md:px-6">
            <div className="text-sm text-gray-800">
              <span className="text-xs font-semibold text-gray-500">Draw:</span>{" "}
              <span className="font-semibold">{result.drawDate}</span>{" "}
              <span className="text-gray-400">•</span>{" "}
              <span className="font-semibold">{result.drawTime}</span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
              <p>
                <span className="font-semibold text-gray-700">Location:</span>{" "}
                {result.location}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Next Draw:</span>{" "}
                {result.nextDrawDate || "-"}{" "}
                {result.nextDrawLocation ? `• ${result.nextDrawLocation}` : ""}
              </p>
            </div>
          </div>

          {/* 1st Prize – full width hero */}
          <section className="border-b border-gray-100 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-200 px-5 py-5 md:px-6 md:py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                  1st Prize
                </p>
                <p className="mt-1 text-2xl font-extrabold text-amber-900">
                  ₹ {prizes.firstPrize.amount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1 text-sm text-amber-900 md:text-right">
                <p>
                  Ticket:{" "}
                  <span className="font-semibold">
                    {prizes.firstPrize.ticket || "-"}
                  </span>
                </p>
                <p className="text-xs">
                  Location: {prizes.firstPrize.location || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* 2nd Prize – full width */}
          <section className="border-b border-gray-100 bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                  2nd Prize
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹ {prizes.secondPrize.amount.toLocaleString()}
                </p>
              </div>

              {/* Single Winner Display */}
              {(!prizes.secondPrize.winners ||
                prizes.secondPrize.winners.length === 0) && (
                <div className="space-y-1 text-sm text-gray-900 md:text-right">
                  <p>
                    Ticket:{" "}
                    <span className="font-semibold">
                      {prizes.secondPrize.ticket || "-"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Location: {prizes.secondPrize.location || "-"}
                  </p>
                </div>
              )}
            </div>

            {/* List Winner Display */}
            {prizes.secondPrize.winners &&
              prizes.secondPrize.winners.length > 0 && (
                <div className="mt-4 w-full rounded-2xl bg-white/60 px-3 py-3 text-xs text-gray-900 shadow-sm border border-gray-200">
                  <div className="space-y-1.5">
                    {prizes.secondPrize.winners.map((w, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center justify-between border-b border-gray-200 last:border-0 pb-1.5"
                      >
                        <span className="font-semibold">{w.ticket}</span>
                        {w.location && (
                          <span className="mt-0.5 text-[11px] text-gray-600 md:mt-0">
                            {w.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </section>

          {/* 3rd Prize – full width, list of winners */}
          <section className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 px-5 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-800">
                  3rd Prize
                </p>
                <p className="mt-1 text-xl font-bold text-orange-900">
                  ₹ {prizes.thirdPrize.amount.toLocaleString()}
                </p>
              </div>

              <div className="w-full rounded-2xl bg-white/80 px-3 py-3 text-xs text-orange-900 shadow-sm">
                {prizes.thirdPrize.winners?.length ? (
                  <div className="space-y-1.5">
                    {prizes.thirdPrize.winners.map((w, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center justify-between border-b border-orange-100 last:border-0 pb-1.5"
                      >
                        <span className="font-semibold">{w.ticket}</span>
                        {w.location && (
                          <span className="mt-0.5 text-[11px] text-orange-700 md:mt-0">
                            {w.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-orange-400">No winners listed</p>
                )}
              </div>
            </div>
          </section>

          {/* Consolation */}
          <section className="border-b border-gray-100 bg-gray-50/80 px-5 py-4 md:px-6 md:py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Consolation Prize – ₹{" "}
              {prizes.consolationPrize.amount.toLocaleString()}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {prizes.consolationPrize.winners?.length ? (
                prizes.consolationPrize.winners.map((w, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800 shadow-sm"
                  >
                    <span className="font-semibold">{w.ticket}</span>
                    {w.location && (
                      <span className="ml-1 text-gray-500">({w.location})</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No consolation tickets</span>
              )}
            </div>
          </section>

          {/* 4th – 8th prizes */}
          <section className="px-5 py-4 md:px-6 md:py-5 space-y-3">
            {[
              { label: "4th Prize", key: "fourthPrize" as const },
              { label: "5th Prize", key: "fifthPrize" as const },
              { label: "6th Prize", key: "sixthPrize" as const },
              { label: "7th Prize", key: "seventhPrize" as const },
              { label: "8th Prize", key: "eighthPrize" as const },
              { label: "9th Prize", key: "ninthPrize" as const },
              { label: "10th Prize", key: "tenthPrize" as const },
            ].map(({ label, key }) => {
              // Cast to any to access potentially missing keys safely
              const prize = (prizes as any)[key];
              if (
                !prize ||
                (!prize.amount &&
                  !prize.numbers?.length &&
                  !prize.winners?.length)
              )
                return null;

              return (
                <div
                  key={key}
                  className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {label}
                    </p>
                    <p className="text-xs font-semibold text-green-700">
                      ₹ {prize.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Render Winners List (Ticket + Location) if present */}
                  {prize.winners && prize.winners.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {prize.winners.map((w: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-gray-50 rounded px-2 py-1 border border-gray-100"
                        >
                          <span className="font-semibold text-xs text-gray-800">
                            {w.ticket}
                          </span>
                          {w.location && (
                            <span className="text-[10px] text-gray-500">
                              {w.location}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Render Numbers List (Chips) */
                    <div className="flex flex-wrap gap-2 text-xs">
                      {prize.numbers?.length ? (
                        prize.numbers.map((n: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center rounded-full border border-green-100 bg-green-50 px-3 py-1 font-mono text-sm text-green-800"
                          >
                            {n}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/80 px-5 py-4 text-xs text-gray-600 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="font-semibold text-gray-800">
                {result.issuedBy || "—"}
              </p>
              <p>{result.issuerTitle || ""}</p>
            </div>
            <p className="text-[10px] text-gray-400">Result ID: {result.id}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-4 text-xs">
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-yellow-800 ring-1 ring-yellow-200">
              Admin hint: Edit this result from the lottery dashboard.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;

"use client";

import { useEffect, useMemo, useState } from "react";
import { db, collection, getDocs, doc, deleteDoc } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

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
  };
}

export default function LotteryViewPage() {
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [lotteryFilter, setLotteryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  useEffect(() => {
    fetchLotteryResults();
  }, []);

  const fetchLotteryResults = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lottery_results"));
      const resultsList = querySnapshot.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          lotteryId: data.lotteryId || "",
          lotteryName: data.lotteryName || data.lottery || "",
          drawNumber: data.drawNumber || "",
          drawDate: data.drawDate || "",
          drawTime: data.drawTime || "",
          location: data.location || "",
          issuedBy: data.issuedBy || "",
          issuerTitle: data.issuerTitle || "",
          nextDrawDate: data.nextDrawDate || "",
          nextDrawLocation: data.nextDrawLocation || "",
          prizes: data.prizes || {},
        } as LotteryResult;
      });

      resultsList.sort((a, b) => (a.lotteryId < b.lotteryId ? 1 : -1));
      setLotteryResults(resultsList);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "lottery_results", id));
      setLotteryResults((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete record");
    }
  };

  // Derived data: filter + search
  const filteredResults = useMemo(() => {
    return lotteryResults.filter((r) => {
      const matchesLottery =
        !lotteryFilter ||
        r.lotteryName.toLowerCase().includes(lotteryFilter.toLowerCase()) ||
        r.lotteryId.toLowerCase().includes(lotteryFilter.toLowerCase());

      const matchesDate = !dateFilter || r.drawDate.startsWith(dateFilter); // YYYY-MM-DD

      const global = (r.lotteryName + r.lotteryId + r.drawNumber + r.location)
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesLottery && matchesDate && global;
    });
  }, [lotteryResults, lotteryFilter, dateFilter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedResults = useMemo(() => {
    const start = (currentPageSafe - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, currentPageSafe]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch("");
    setLotteryFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 mb-2">
              <span className="text-lg">📊</span>
              <span>Lottery Results Table</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Lottery Results
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Search, filter, and manage Kerala lottery draw results.
            </p>
          </div>

          <button
            onClick={() => router.push("/add-result")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition"
          >
            <span className="text-lg">➕</span>
            <span>Add Lottery Result</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Search (lottery, draw no, location)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="e.g. KARUNYA, KN-608, Kochi"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Lottery filter
            </label>
            <input
              type="text"
              value={lotteryFilter}
              onChange={(e) => {
                setLotteryFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="KARUNYA, SUM, etc."
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Draw date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/40"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
          <span>
            Showing{" "}
            <span className="font-semibold">
              {filteredResults.length === 0
                ? 0
                : (currentPageSafe - 1) * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold">
              {Math.min(currentPageSafe * pageSize, filteredResults.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredResults.length}</span>{" "}
            results
          </span>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-green-700 hover:text-green-800"
          >
            Clear filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Lottery
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Draw Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Issued By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Next Draw
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No results match your filters.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((result) => (
                  <tr
                    key={result.id}
                    className="hover:bg-green-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-gray-900">
                        {result.lotteryName || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID:{" "}
                        <span className="font-mono">
                          {result.lotteryId || result.id.slice(0, 8)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Draw No:{" "}
                        <span className="font-medium">
                          {result.drawNumber || "-"}
                        </span>
                      </p>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <p className="text-xs text-gray-500">
                        Date:{" "}
                        <span className="font-medium">
                          {result.drawDate || "-"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Time:{" "}
                        <span className="font-medium">
                          {result.drawTime || "-"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Location:{" "}
                        <span className="font-medium">
                          {result.location || "-"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        1st Prize:{" "}
                        <span className="font-semibold text-green-700">
                          ₹
                          {result.prizes?.firstPrize?.amount
                            ? result.prizes.firstPrize.amount.toLocaleString()
                            : "0"}
                        </span>
                      </p>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <p className="text-sm text-gray-900">
                        {result.issuedBy || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.issuerTitle || ""}
                      </p>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <p className="text-sm text-gray-900">
                        {result.nextDrawDate || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.nextDrawLocation || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/lottery/${result.id}`)}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/lottery/${result.id}/edit`)
                          }
                          className="rounded-lg bg-yellow-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>
            Page <span className="font-semibold">{currentPageSafe}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPageSafe === 1}
              className="px-2 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              « First
            </button>
            <button
              onClick={() => handlePageChange(currentPageSafe - 1)}
              disabled={currentPageSafe === 1}
              className="px-2 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPageSafe + 1)}
              disabled={currentPageSafe === totalPages}
              className="px-2 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              Next ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPageSafe === totalPages}
              className="px-2 py-1 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

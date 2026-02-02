"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, getDocs } from "@/firebaseConfig";

interface LotteryResultLite {
  id: string;
  lotteryName: string;
  drawNumber: string;
  drawDate: string; // ISO string or YYYY-MM-DD
}

export default function PublicResultsListPage() {
  const [results, setResults] = useState<LotteryResultLite[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const snap = await getDocs(collection(db, "lottery_results"));
        const list: LotteryResultLite[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            lotteryName: String(data.lotteryName || data.lottery || ""),
            drawNumber: String(data.drawNumber || ""),
            drawDate: String(data.drawDate || ""),
          };
        });

        // sort by date desc (latest first)
        list.sort((a, b) => {
          const da = new Date(a.drawDate || 0).getTime();
          const dbt = new Date(b.drawDate || 0).getTime();
          return dbt - da;
        });

        setResults(list);
      } catch (e) {
        console.error("Error loading results:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const text = (r.lotteryName + r.drawNumber).toLowerCase();
      const matchesSearch = !search || text.includes(search.toLowerCase());
      const matchesDate = !dateFilter || r.drawDate.startsWith(dateFilter);
      return matchesSearch && matchesDate;
    });
  }, [results, search, dateFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-800">
            <span className="text-lg">🎟️</span>
            <span>Kerala Lottery Results</span>
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">
            Latest Lottery Results
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Search by lottery name, code, or filter by draw date.
          </p>
        </div>

        {/* Search & filters */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                {/* search icon */}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 11.5L14 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or code (e.g. KARUNYA, KN-608)"
                className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Draw date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
            />
          </div>
        </div>

        {/* Info row */}
        <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
          <span>
            Showing <span className="font-semibold">{filtered.length}</span>{" "}
            result
            {filtered.length === 1 ? "" : "s"}
          </span>
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-xs font-semibold text-green-700 hover:text-green-800"
            >
              Clear date
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 py-10 text-center text-sm text-gray-600">
              No results match your search.
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => router.push(`/result/${r.id}`)}
                className="flex w-full flex-col items-start rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {r.lotteryName || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Code:{" "}
                      <span className="font-mono font-medium">
                        {r.drawNumber || "—"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>{r.drawDate || "—"}</p>
                    <p className="mt-0.5 text-[11px] text-green-700">
                      Tap to view details
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

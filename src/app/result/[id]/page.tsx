"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, doc, getDoc } from "@/firebaseConfig";
import Link from "next/link";
import ResultView, {
  LotteryResultViewModel,
} from "../../../../components/ResultView";

export default function PublicResultPage() {
  const params = useParams();
  const id = params?.id as string;

  const [result, setResult] = useState<LotteryResultViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const ref = doc(db, "lottery_results", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setResult(null);
        } else {
          const data = snap.data() as Record<string, unknown>;
          const mapped: LotteryResultViewModel = {
            id: snap.id,
            lotteryName:
              (data.lotteryName as string) || (data.lottery as string) || "",
            drawNumber: (data.drawNumber as string) || "",
            drawDate: (data.drawDate as string) || "",
            drawTime: (data.drawTime as string) || "",
            location: (data.location as string) || "",
            issuedBy: (data.issuedBy as string) || "",
            issuerTitle: (data.issuerTitle as string) || "",
            nextDrawDate: (data.nextDrawDate as string) || "",
            nextDrawLocation: (data.nextDrawLocation as string) || "",
            prizes: data.prizes as LotteryResultViewModel["prizes"],
          };
          setResult(mapped);
        }
      } catch (e) {
        console.error("Error loading result:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-800">
            Result not found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Please check the link or try again from the results page.
          </p>
          <Link
            href="/result"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  // Public view (no isAdmin flag)
  return <ResultView result={result} />;
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, doc, getDoc } from "@/firebaseConfig";
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
          const data = snap.data() as any;
          const mapped: LotteryResultViewModel = {
            id: snap.id,
            lotteryName: data.lotteryName || data.lottery || "",
            drawNumber: data.drawNumber || "",
            drawDate: data.drawDate || "",
            drawTime: data.drawTime || "",
            location: data.location || "",
            issuedBy: data.issuedBy || "",
            issuerTitle: data.issuerTitle || "",
            nextDrawDate: data.nextDrawDate || "",
            nextDrawLocation: data.nextDrawLocation || "",
            prizes: data.prizes,
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
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Result not found
      </div>
    );
  }

  // isAdmin = false here
  return <ResultView result={result} />;
}

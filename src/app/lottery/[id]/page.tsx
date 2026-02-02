"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, doc, getDoc } from "@/firebaseConfig";
import ResultView, {
  LotteryResultViewModel,
} from "../../../../components/ResultView";

export default function LotteryAdminViewPage() {
  const params = useParams();
  const router = useRouter();
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
          router.push("/lottery");
          return;
        }
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
      } catch (e) {
        console.error("Error loading result:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

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

  // isAdmin = true here
  return <ResultView result={result} isAdmin />;
}

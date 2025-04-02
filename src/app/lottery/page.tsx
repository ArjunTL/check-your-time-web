"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs, doc, deleteDoc } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

export default function LotteryViewPage() {
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

  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchLotteryResults();
  }, []);

  const fetchLotteryResults = async () => {
    const querySnapshot = await getDocs(collection(db, "lottery_results"));
    const resultsList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        lotteryId: data.lotteryId || "",
        lotteryName: data.lotteryName || "",
        drawNumber: data.drawNumber || "",
        drawDate: data.drawDate || "",
        drawTime: data.drawTime || "",
        location: data.location || "",
        issuedBy: data.issuedBy || "",
        issuerTitle: data.issuerTitle || "",
        nextDrawDate: data.nextDrawDate || "",
        nextDrawLocation: data.nextDrawLocation || "",
        prizes: data.prizes || {},
      };
    });

    // Optional: sort by latest
    resultsList.sort((a, b) => (a.lotteryId < b.lotteryId ? 1 : -1));

    setLotteryResults(resultsList);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "lottery_results", id));
      fetchLotteryResults();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Lottery Results</h2>

      <button
        onClick={() => router.push("/add-result")}
        className="bg-green-500 text-white p-3 rounded mb-4"
      >
        Add Lottery Result
      </button>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border text-black p-2">Lottery</th>
            <th className="border text-black p-2">Draw Info</th>
            <th className="border text-black p-2">Issued By</th>
            <th className="border text-black p-2">Next Draw</th>
            <th className="border text-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lotteryResults.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">No results found</td>
            </tr>
          ) : (
            lotteryResults.map((result) => (
              <tr key={result.id} className="border-t">
                <td className="border text-black p-2">
                  <p><strong>{result.lotteryName}</strong></p>
                  <p className="text-sm text-gray-600">{result.drawNumber}</p>
                </td>
                <td className="border text-black p-2">
                  <p><strong>Date:</strong> {result.drawDate}</p>
                  <p><strong>Time:</strong> {result.drawTime}</p>
                  <p><strong>Location:</strong> {result.location}</p>
                </td>
                <td className="border text-black p-2">
                  <p>{result.issuedBy}</p>
                  <p className="text-sm text-gray-600">{result.issuerTitle}</p>
                </td>
                <td className="border text-black p-2">
                  <p><strong>{result.nextDrawDate}</strong></p>
                  <p className="text-sm">{result.nextDrawLocation}</p>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

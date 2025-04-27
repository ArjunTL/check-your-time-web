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

  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchLotteryResults();
  }, []);

  const fetchLotteryResults = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "lottery_results"));
      const resultsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          lotteryId: data.lotteryId || "",
          lottery: data.lottery || "",
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

      resultsList.sort((a, b) => (a.lotteryId < b.lotteryId ? 1 : -1));
      setLotteryResults(resultsList);
    } catch (error) {
      console.error("Error fetching lottery results:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = lotteryResults.filter(result =>
    result?.lottery.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result?.drawNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleView = (id: string) => {
    router.push(`/result/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/add-result?id=${id}`);  // Pass the id as a query parameter
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lottery Results</h1>
          <p className="text-gray-600">View and manage all lottery draw results</p>
        </div>
        <button
          onClick={() => router.push("/add-result")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Result
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by lottery or draw number..."
              className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎟️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try a different search term" : "Add a new lottery result to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push("/add-result")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Result
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lottery
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Draw Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Issued By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Next Draw
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span>🎫</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{result.lottery}</div>
                          <div className="text-sm text-gray-500">#{result.drawNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(result.drawDate)} at {result.drawTime}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {result.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {result.issuedBy}
                      </div>
                      <div className="text-sm text-gray-500">{result.issuerTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {result.nextDrawDate ? formatDate(result.nextDrawDate) : "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">{result.nextDrawLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(result.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(result.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-50 transition-colors"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
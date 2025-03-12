"use client";

import { useEffect, useState } from "react";
import { db, collection, addDoc, getDocs, doc, deleteDoc } from "@/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function LotteryViewPage() {
    interface PrizeData {
        firstPrize: { amount: string; winner: string };
        secondPrize: { amount: string; winner: string };
        thirdPrize: { amount: string; winners: string[] };
      }
      interface LotteryResult {
        id: string; // Firestore document ID
        lotteryId: string; // ✅ Include lotteryId from Firestore
        prizes: PrizeData;
      }
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [jsonData, setJsonData] = useState("");

  useEffect(() => {
    fetchLotteryResults();
  }, []);

  // Fetch Lottery Results
  const fetchLotteryResults = async () => {
    const querySnapshot = await getDocs(collection(db, "lottery_results"));
    const resultsList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Firestore document ID
        lotteryId: data.lotteryId || "Unknown", // ✅ Ensure lotteryId exists
        prizes: data.prizes || {} // ✅ Ensure prizes is not undefined
      };
    });
    setLotteryResults(resultsList);
  };
  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const formattedDate = selectedDate.toLocaleDateString("en-GB").replace(/\//g, "-"); // DD-MM-YYYY format
      const formattedData = {
        lotteryId: formattedDate, // Store as Lottery ID
        lotteryName: "Win-Win Lottery W-812",
        drawDate: formattedDate,
        location: "Thiruvananthapuram",
        prizes: JSON.parse(jsonData), // Store entered JSON
      };

      await addDoc(collection(db, "lottery_results"), formattedData);
      setShowModal(false);
      fetchLotteryResults(); // Refresh list
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Delete Lottery Result
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "lottery_results", id)); // Delete from Firestore
      fetchLotteryResults(); // Refresh UI
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl  font-bold mb-4">Lottery Results</h2>

      {/* ✅ Add Lottery Result Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white p-3 rounded mb-4"
      >
        Add Lottery Result
      </button>

      {/* ✅ Modal for Adding Lottery Result */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg text-black font-bold mb-4">Add Lottery Result</h3>
            <form onSubmit={handleSubmit}>
              
              {/* ✅ Date Picker for Lottery ID */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                className="w-full p-2 border rounded mb-4"
                placeholderText="Select Lottery Date"
                required
              />

              {/* ✅ JSON Input */}
              <textarea
                name="jsonData"
                placeholder="Enter JSON Result"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                required
                className="w-full p-2 border rounded mb-4 h-32"
              />

              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Save
                </button>
                <button onClick={() => setShowModal(false)} className="bg-red-500 text-white p-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Lottery Results Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border text-black p-2">Lottery Date</th>
            <th className="border text-black p-2">Lottery Details</th>
            <th className="border text-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lotteryResults.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">No results found</td>
            </tr>
          ) : (
            lotteryResults.map((result) => (
              <tr key={result.id} className="border-t">
                <td className="border text-black p-2">{result.lotteryId}</td>
                <td className="border text-black p-2">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(result.prizes, null, 2)}</pre>
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

"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PdfUploader from "../../../components/PdfUploader";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check admin role via custom claims
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          setIsAdmin(idTokenResult.claims.admin === true);
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    signOut(auth).then(() => router.push("/login"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <span className="text-3xl">🎟️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent mb-2">
            Kerala Lottery Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back,{" "}
            <span className="font-semibold text-green-700">{user?.email}</span>
            {isAdmin && (
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ADMIN
              </span>
            )}
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Admin Panel */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Admin Panel
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Approve & edit lottery results
              </p>
              <Link
                href="/admin"
                className="w-full block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Admin →
              </Link>
            </motion.div>
          )}

          {/* Add Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
              <span className="text-2xl">➕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Add New Result
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              Upload PDF or enter manually
            </p>
            <Link
              href="/add-result"
              className="w-full block bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl text-center hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Result →
            </Link>
          </motion.div>

          {/* View Results */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              View Results
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              Check all published lottery results
            </p>
            <Link
              href="/lottery"
              className="w-full block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl text-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Results →
            </Link>
          </motion.div>
        </div>

        {/* Quick PDF Upload */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick PDF Upload
          </h3>
          <div className="max-w-2xl mx-auto">
            <PdfUploader />
          </div>
        </motion.section> */}

        {/* Logout */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg"
          >
            🚪 Logout
          </motion.button>
        </div>
      </div>
    </div>
  );
}

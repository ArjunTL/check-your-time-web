"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
      <button
        onClick={() => signOut(auth).then(() => router.push("/login"))}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}

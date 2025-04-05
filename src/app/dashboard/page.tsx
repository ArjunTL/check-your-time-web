"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case "results":
        router.push("/lottery");
        return null;
      case "add":
        router.push("/add-result");
        return null;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <DashboardCard 
              title="View Results" 
              description="Browse all lottery results and winners"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              onClick={() => setActiveTab("results")}
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
            <DashboardCard 
              title="Add New Result" 
              description="Create a new lottery result entry"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              onClick={() => setActiveTab("add")}
              color="bg-green-50"
              iconColor="text-green-600"
            />
            <DashboardCard 
              title="Statistics" 
              description="View lottery analytics and trends"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              onClick={() => setActiveTab("stats")}
              color="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="flex">
        <main className="flex-1 p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeTab === "dashboard" ? "Dashboard Overview" : 
                   activeTab === "results" ? "Lottery Results" : 
                   activeTab === "add" ? "Add New Result" : "Statistics"}
                </h2>
                {user && (
                  <p className="opacity-90">
                    Welcome back, <span className="font-semibold">{user.email}</span>
                  </p>
                )}
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Dashboard Card Component
const DashboardCard = ({ title, description, icon, onClick, color, iconColor }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  iconColor?: string;
}) => (
  <div 
    onClick={onClick}
    className={`${color} p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1`}
  >
    <div className="flex items-center gap-4">
      <div className={`${iconColor || "text-gray-600"} p-3 rounded-full bg-white shadow`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

// Navigation Item Component

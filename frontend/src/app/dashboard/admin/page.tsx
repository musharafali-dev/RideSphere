"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Users, Car, Shield, Landmark, CheckCircle, 
  AlertTriangle, Eye, ShieldAlert, Key 
} from "lucide-react";

interface VerificationRequest {
  id: string;
  name: string;
  type: "Driver License" | "Vehicle Registration";
  details: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [sysHealth, setSysHealth] = useState("Optimal");
  const [stats, setStats] = useState({
    users: 1482,
    vehicles: 82,
    bookings: 35,
    revenue: 12900
  });

  useEffect(() => {
    setVerifications([
      {
        id: "VER-001",
        name: "Fleet Owner John",
        type: "Vehicle Registration",
        details: "Toyota Corolla 2022 (LEC-5566)",
        status: "pending"
      },
      {
        id: "VER-002",
        name: "Driver David",
        type: "Driver License",
        details: "License ID: DL-88992211PK",
        status: "pending"
      }
    ]);
  }, []);

  const handleVerify = (id: string, action: "approve" | "reject") => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? { ...v, status: action === "approve" ? "approved" : "rejected" } : v)
    );
    if (action === "approve") {
      setStats(prev => ({ ...prev, vehicles: prev.vehicles + 1 }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 mb-10">
          <h1 className="font-display font-bold text-3xl text-white">Central Operations Center</h1>
          <p className="text-slate-400 mt-1">Audit verification documents, configure system state, and oversee transaction audits.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Active Customers & Drivers</span>
            <span className="text-3xl font-extrabold text-white">{stats.users}</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Registered Fleet</span>
            <span className="text-3xl font-extrabold text-indigo-400">{stats.vehicles}</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Ongoing Transactions</span>
            <span className="text-3xl font-extrabold text-white">{stats.bookings}</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Platform Audited Revenue</span>
            <span className="text-3xl font-extrabold text-emerald-400">${stats.revenue}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Approvals */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-400" /> Pending Approvals
            </h2>

            <div className="space-y-4">
              {verifications.filter(v => v.status === "pending").length === 0 ? (
                <div className="border border-slate-850 p-8 rounded-2xl text-center text-slate-500 text-sm">
                  All documents audited. Outstanding requests: 0.
                </div>
              ) : (
                verifications.filter(v => v.status === "pending").map(v => (
                  <div key={v.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">{v.type}</span>
                        <h3 className="font-display font-bold text-lg text-white mt-2">{v.name}</h3>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{v.id}</span>
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                      {v.details}
                    </p>

                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleVerify(v.id, "reject")}
                        className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-rose-400 rounded-lg transition-colors"
                      >
                        Reject Verification
                      </button>
                      <button 
                        onClick={() => handleVerify(v.id, "approve")}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                      >
                        Approve Document
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Platform Settings */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-400" /> Platform Security
            </h2>
            
            <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <span className="text-xs text-slate-400">System Gateway</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> ONLINE
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <span className="text-xs text-slate-400">System Status</span>
                <span className="text-xs text-emerald-400 font-semibold capitalize">{sysHealth}</span>
              </div>
              <button 
                onClick={() => setSysHealth(prev => prev === "Optimal" ? "Maintenance" : "Optimal")}
                className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-300 transition-colors"
              >
                Toggle Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

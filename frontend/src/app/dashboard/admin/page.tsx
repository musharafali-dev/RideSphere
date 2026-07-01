"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Users as UsersIcon, Car, Shield, Landmark, CheckCircle, 
  AlertTriangle, FileText, Settings, ShieldAlert, Key, 
  BarChart3, RefreshCw, Layers, ShieldCheck, Mail, ArrowUpRight 
} from "lucide-react";

interface VerificationRequest {
  id: string;
  name: string;
  type: "Driver License" | "Vehicle Registration";
  details: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [sysHealth, setSysHealth] = useState("Optimal");
  const [stats, setStats] = useState({
    users: 1482,
    vehicles: 20,
    bookings: 35,
    revenue: 12900
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    setVerifications([
      { id: "VER-001", name: "Fleet Owner John", type: "Vehicle Registration", details: "Toyota Corolla (LEC-5566)", status: "pending" },
      { id: "VER-002", name: "Driver David", type: "Driver License", details: "License ID: DL-PK-9988221", status: "pending" }
    ]);

    setUsersList([
      { name: "Jane Doe", email: "customer1@ridesphere.com", role: "customer", status: "Active" },
      { name: "Fleet Owner 1", email: "owner1@ridesphere.com", role: "owner", status: "Active" },
      { name: "Chauffeur Driver 1", email: "driver1@ridesphere.com", role: "driver", status: "Active" },
      { name: "Tour Operator 1", email: "operator1@ridesphere.com", role: "operator", status: "Active" }
    ]);

    setAuditLogs([
      { timestamp: "2026-07-02 01:10", action: "Verify user document VER-002 Approved", user: "Admin User", status: "Success" },
      { timestamp: "2026-07-01 23:45", action: "System configuration variables updated", user: "Admin User", status: "Success" }
    ]);

    const storedBookings = localStorage.getItem("pending_bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const handleVerify = (id: string, action: "approve" | "reject") => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? { ...v, status: action === "approve" ? "approved" : "rejected" } : v)
    );
    if (action === "approve") {
      setStats(prev => ({ ...prev, vehicles: prev.vehicles + 1 }));
    }
    setAuditLogs(prev => [
      {
        timestamp: "Just now",
        action: `Verify document ${id} ${action === "approve" ? "Approved" : "Rejected"}`,
        user: "Admin User",
        status: "Success"
      },
      ...prev
    ]);
  };

  const handleBookingApproval = (id: string, action: "approve" | "reject") => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: action === "approve" ? "approved" : "rejected" } : b);
      localStorage.setItem("pending_bookings", JSON.stringify(updated));
      return updated;
    });

    if (action === "approve") {
      setStats(prev => ({ ...prev, bookings: prev.bookings + 1 }));
    }

    setAuditLogs(prev => [
      {
        timestamp: "Just now",
        action: `Booking ${id} ${action === "approve" ? "Approved" : "Rejected"}`,
        user: "Admin User",
        status: "Success"
      },
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs & Header */}
        <div className="border-b border-slate-100 pb-6 mb-10">
          <div className="flex gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>Admin</span> &bull; <span>Dashboard</span> &bull; <span className="text-blue-600">{activeTab}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-900">Central Operations Center</h1>
          <p className="text-xs text-slate-500 mt-1">Audit verification documents, configure system gateway health, and view transaction logs.</p>
        </div>

        {/* Dynamic Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total System Users</span>
            <span className="text-3xl font-extrabold text-slate-900">{stats.users} Users</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Fleet</span>
            <span className="text-3xl font-extrabold text-blue-600">{stats.vehicles} Vehicles</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Revenue</span>
            <span className="text-3xl font-extrabold text-slate-900">${stats.revenue}</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Health</span>
            <span className="text-3xl font-extrabold text-emerald-500 flex items-center gap-1.5">
              <ShieldCheck className="h-6 w-6" /> {sysHealth}
            </span>
          </div>
        </div>

        {/* Main Grid: Sidebar + Workspace + Right activity panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "users", label: "Users Directory", icon: UsersIcon },
              { id: "approvals", label: "Pending Approvals", icon: ShieldAlert },
              { id: "audits", label: "System Audits", icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-650 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Center Workspace & Right Panel */}
          <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Center Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* OVERVIEW PANEL */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  
                  {/* SVG growth charts */}
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Platform Bookings Volume</span>
                      <span className="text-xl font-bold text-slate-800">Monthly Performance</span>
                    </div>

                    <div className="h-44 w-full flex items-end justify-between border-b border-l border-slate-150 pl-4 pb-2">
                      {[30, 45, 60, 40, 80, 95, 110].map((val, idx) => (
                        <div key={idx} className="w-8 bg-blue-600 rounded-t-lg" style={{ height: `${val}%` }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold px-4 pt-1">
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                    </div>
                  </div>

                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-lg text-slate-800">User Directory</h2>

                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-450 font-bold bg-slate-50">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650">
                        {usersList.map((u, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-850">{u.name}</td>
                            <td className="p-4 font-semibold">{u.email}</td>
                            <td className="p-4 capitalize">{u.role}</td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* APPROVALS TAB */}
              {activeTab === "approvals" && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-lg text-slate-800">Verification Center</h2>

                    <div className="space-y-4">
                      {verifications.filter(v => v.status === "pending").length === 0 ? (
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center text-slate-450 text-xs shadow-sm">
                          All compliance requests audited. Pending: 0.
                        </div>
                      ) : (
                        verifications.filter(v => v.status === "pending").map(v => (
                          <div key={v.id} className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">{v.type}</span>
                                <h3 className="font-display font-bold text-md text-slate-850 mt-2">{v.name}</h3>
                              </div>
                              <span className="text-xs text-slate-400 font-mono font-semibold">{v.id}</span>
                            </div>

                            <p className="text-xs text-slate-550 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-semibold">
                              {v.details}
                            </p>

                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleVerify(v.id, "reject")}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-red-650 rounded-xl cursor-pointer"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleVerify(v.id, "approve")}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pending Vehicle Bookings */}
                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <h2 className="font-display font-bold text-lg text-slate-800">Pending Vehicle Bookings</h2>

                    <div className="space-y-4">
                      {bookings.filter(b => b.status === "pending").length === 0 ? (
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center text-slate-455 text-xs shadow-sm">
                          No pending vehicle bookings approvals. Pending: 0.
                        </div>
                      ) : (
                        bookings.filter(b => b.status === "pending").map(b => (
                          <div key={b.id} className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-bold">Booking Request &bull; {b.paymentMethod.toUpperCase()}</span>
                                <h3 className="font-display font-bold text-md text-slate-850 mt-2">{b.vehicle}</h3>
                              </div>
                              <span className="text-xs text-slate-400 font-mono font-semibold">{b.id}</span>
                            </div>

                            <div className="text-xs text-slate-550 space-y-1 font-semibold">
                              <p>Client: <strong className="text-slate-800">{b.client}</strong></p>
                              <p>Duration: <strong className="text-slate-800">{b.days} days</strong></p>
                              <p>Cost: <strong className="text-emerald-600">${b.price}</strong></p>
                              <p>Date: <strong className="text-slate-500">{b.timestamp}</strong></p>
                            </div>

                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleBookingApproval(b.id, "reject")}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-red-650 rounded-xl cursor-pointer"
                              >
                                Reject Booking
                              </button>
                              <button 
                                onClick={() => handleBookingApproval(b.id, "approve")}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                              >
                                Approve Booking
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AUDITS TAB */}
              {activeTab === "audits" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-lg text-slate-800">Security Audit Trail</h2>

                  <div className="space-y-4">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl flex justify-between items-center text-xs shadow-sm">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold">{log.timestamp} &bull; Action by: {log.user}</span>
                          <p className="text-slate-700 font-semibold mt-1">{log.action}</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Activity Panel */}
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5 text-blue-600" /> Gateway Status
                </h3>
                
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Security Shield</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Node Cluster</span>
                    <span className="text-slate-800 font-semibold">{sysHealth}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSysHealth(prev => prev === "Optimal" ? "Maintenance" : "Optimal")}
                    className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-[11px] font-bold rounded-xl text-slate-650 transition-colors cursor-pointer"
                  >
                    Toggle System Mode
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-800">Recent Activity</h3>
                <div className="space-y-3.5 pt-2 text-xs">
                  <p className="text-slate-500 leading-relaxed"><strong className="text-slate-800">Jane Doe</strong> rented a Porsche 911 <span className="text-[10px] text-slate-400 block mt-0.5">Today 12:45 PM</span></p>
                  <p className="text-slate-500 leading-relaxed"><strong className="text-slate-800">Fleet Owner 1</strong> registered Toyota Fortuner <span className="text-[10px] text-slate-400 block mt-0.5">Yesterday</span></p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

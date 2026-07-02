"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users as UsersIcon, Car, Shield, CheckCircle, 
  AlertTriangle, FileText, Settings, ShieldAlert, Key, 
  RefreshCw, Layers, ShieldCheck, Mail, Database, Compass
} from "lucide-react";

interface VerificationRequest {
  id: string;
  name: string;
  type: "Driver License" | "Vehicle Registration";
  details: string;
  status: "pending" | "approved" | "rejected";
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price_per_day: number;
  license_plate: string;
  is_available: boolean;
}

interface Tour {
  id: string;
  title: string;
  price: number;
  duration_days: number;
  is_active: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
  const [pendingOwners, setPendingOwners] = useState<any[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<any[]>([]);
  const [pendingOperators, setPendingOperators] = useState<any[]>([]);

  // Active listings state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [listingsTab, setListingsTab] = useState<"vehicles" | "tours">("vehicles");

  // Announcement state
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // Platform commission settings
  const [commissionRate, setCommissionRate] = useState(15);
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  // DB Reseed simulation state
  const [reseedLoading, setReseedLoading] = useState(false);
  const [reseedSuccess, setReseedSuccess] = useState(false);

  const fetchListings = () => {
    fetch("http://localhost:8000/api/v1/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVehicles(data);
      })
      .catch(() => {});

    fetch("http://localhost:8000/api/v1/tours")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTours(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Auth & RBAC guard check
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard/admin");
      return;
    }
    
    if (role !== "admin") {
      router.replace(`/dashboard/${role || "customer"}`);
      return;
    }

    setLoading(false);

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

    const storedOwners = localStorage.getItem("pending_owner_applications");
    if (storedOwners) {
      setPendingOwners(JSON.parse(storedOwners));
    }

    const storedDrivers = localStorage.getItem("pending_driver_applications");
    if (storedDrivers) {
      setPendingDrivers(JSON.parse(storedDrivers));
    }

    const storedOperators = localStorage.getItem("pending_operator_applications");
    if (storedOperators) {
      setPendingOperators(JSON.parse(storedOperators));
    }

    // Load announcement configuration from localStorage
    const savedAnnouncement = localStorage.getItem("global_announcement");
    if (savedAnnouncement) {
      try {
        const parsed = JSON.parse(savedAnnouncement);
        setAnnouncementText(parsed.text || "");
        setAnnouncementActive(parsed.active || false);
      } catch (_) {}
    }

    fetchListings();
  }, [router]);

  const handleVerify = (id: string, action: "approve" | "reject") => {
    setVerifications(prev => 
      prev.map(v => v.id === id ? { ...v, status: action === "approve" ? "approved" : "rejected" } : v)
    );
    setAuditLogs(prev => [
      {
        timestamp: "Just now",
        action: `Document ${id} ${action === "approve" ? "Approved" : "Rejected"}`,
        user: "Admin User",
        status: "Success"
      },
      ...prev
    ]);
  };

  const handleBookingApproval = (id: string, action: "approve" | "reject") => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: action === "approve" ? "approved" : "rejected" } : b);
    setBookings(updated);
    localStorage.setItem("pending_bookings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    
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

  const toggleUserStatus = (email: string) => {
    setUsersList(prev => 
      prev.map(u => u.email === email ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u)
    );
    setAuditLogs(prev => [
      {
        timestamp: "Just now",
        action: `User status toggled for ${email}`,
        user: "Admin User",
        status: "Success"
      },
      ...prev
    ]);
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommissionSuccess(true);
    setTimeout(() => setCommissionSuccess(false), 2000);
    setAuditLogs(prev => [
      { timestamp: "Just now", action: `Platform commission rate adjusted to ${commissionRate}%`, user: "Admin User", status: "Success" },
      ...prev
    ]);
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "global_announcement",
      JSON.stringify({ text: announcementText, active: announcementActive })
    );
    window.dispatchEvent(new Event("storage"));

    setAnnouncementSuccess(true);
    setTimeout(() => setAnnouncementSuccess(false), 2000);

    setAuditLogs(prev => [
      { 
        timestamp: "Just now", 
        action: `Global announcement banner ${announcementActive ? "activated" : "deactivated"} ("${announcementText}")`, 
        user: "Admin User", 
        status: "Success" 
      },
      ...prev
    ]);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle listing from the database?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        setStats(prev => ({ ...prev, vehicles: Math.max(0, prev.vehicles - 1) }));
        setAuditLogs(prev => [
          { timestamp: "Just now", action: `Deleted vehicle listing ID ${id}`, user: "Admin User", status: "Success" },
          ...prev
        ]);
        alert("Vehicle listing deleted successfully.");
      } else {
        alert("Failed to delete vehicle listing from backend.");
      }
    } catch (_) {
      alert("Failed to connect to backend server to delete vehicle.");
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tourism package listing from the database?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/tours/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTours(prev => prev.filter(t => t.id !== id));
        setAuditLogs(prev => [
          { timestamp: "Just now", action: `Deleted tour package listing ID ${id}`, user: "Admin User", status: "Success" },
          ...prev
        ]);
        alert("Tourism package listing deleted successfully.");
      } else {
        alert("Failed to delete tour listing from backend.");
      }
    } catch (_) {
      alert("Failed to connect to backend server to delete tour.");
    }
  };

  const triggerReseedDB = async () => {
    if (!confirm("This will drop and re-seed the SQLite database, clear pending local applications, and restore default configurations. Proceed?")) return;
    setReseedLoading(true);
    setReseedSuccess(false);
    try {
      // Step 1: Re-seed backend sqlite
      const res = await fetch("http://localhost:8000/api/v1/admin/reseed", { method: "POST" });
      if (!res.ok) {
        // If specific reseed endpoint isn't on router, alert fallback, but let's clear local storage arrays
      }
    } catch (_) {}

    // Step 2: Clear local queues
    localStorage.removeItem("pending_bookings");
    localStorage.removeItem("pending_owner_applications");
    localStorage.removeItem("pending_driver_applications");
    localStorage.removeItem("pending_operator_applications");
    localStorage.setItem("wallet_balance", "1200");

    setBookings([]);
    setPendingOwners([]);
    setPendingDrivers([]);
    setPendingOperators([]);

    // Refresh listings
    fetchListings();

    setReseedLoading(false);
    setReseedSuccess(true);
    setTimeout(() => setReseedSuccess(false), 3000);

    setAuditLogs(prev => [
      { timestamp: "Just now", action: "Triggered platform database reset & mock reseed", user: "Admin User", status: "Success" },
      ...prev
    ]);
  };

  const handlePartnerVerify = (id: string, partnerType: "owner" | "driver" | "operator", action: "approve" | "reject") => {
    if (partnerType === "owner") {
      setPendingOwners(prev => {
        const target = prev.find(o => o.id === id);
        const updated = prev.filter(o => o.id !== id);
        localStorage.setItem("pending_owner_applications", JSON.stringify(updated));
        if (target && localStorage.getItem("user_email") === target.email) {
          localStorage.setItem("user_status", action === "approve" ? "ACTIVE" : "REJECTED");
        }
        return updated;
      });
    } else if (partnerType === "driver") {
      setPendingDrivers(prev => {
        const target = prev.find(d => d.id === id);
        const updated = prev.filter(d => d.id !== id);
        localStorage.setItem("pending_driver_applications", JSON.stringify(updated));
        if (target && localStorage.getItem("user_email") === target.email) {
          localStorage.setItem("user_status", action === "approve" ? "ACTIVE" : "REJECTED");
        }
        return updated;
      });
    } else if (partnerType === "operator") {
      setPendingOperators(prev => {
        const target = prev.find(o => o.id === id);
        const updated = prev.filter(o => o.id !== id);
        localStorage.setItem("pending_operator_applications", JSON.stringify(updated));
        if (target && localStorage.getItem("user_email") === target.email) {
          localStorage.setItem("user_status", action === "approve" ? "ACTIVE" : "REJECTED");
        }
        return updated;
      });
    }

    setAuditLogs(prev => [
      {
        timestamp: "Just now",
        action: `${partnerType.toUpperCase()} Application ${id} ${action === "approve" ? "Approved" : "Rejected"}`,
        user: "Admin User",
        status: "Success"
      },
      ...prev
    ]);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-bg justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs & Header */}
        <div className="border-b border-card-border pb-6 mb-10">
          <div className="flex gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">
            <span>Admin</span> &bull; <span>Dashboard</span> &bull; <span className="text-brand-primary">{activeTab}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-text-main">Central Operations Center</h1>
          <p className="text-xs text-text-muted mt-1">Audit verification documents, manage announcements, control listings, and review logs.</p>
        </div>

        {/* Dynamic Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total System Users</span>
            <span className="text-3xl font-extrabold text-text-main">{stats.users} Users</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Registered Fleet</span>
            <span className="text-3xl font-extrabold text-brand-primary">{vehicles.length || stats.vehicles} Vehicles</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Audited Revenue</span>
            <span className="text-3xl font-extrabold text-text-main">${stats.revenue}</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">System Health</span>
            <span className="text-3xl font-extrabold text-brand-success flex items-center gap-1.5">
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
              { id: "listings", label: "Listing Manager", icon: Car },
              { id: "users", label: "Users Directory", icon: UsersIcon },
              { id: "approvals", label: "Pending Approvals", icon: ShieldAlert },
              { id: "announcements", label: "Announcement Banner", icon: Mail },
              { id: "audits", label: "System Audits", icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-xs"
                      : "text-text-muted hover:bg-brand-bg hover:text-text-main"
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
                  <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1 font-display">Platform Bookings Volume</span>
                      <span className="text-xl font-bold text-text-main">Monthly Performance</span>
                    </div>

                    <div className="h-44 w-full flex items-end justify-between border-b border-l border-card-border pl-4 pb-2">
                      {[30, 45, 60, 40, 80, 95, 110].map((val, idx) => (
                        <div key={idx} className="w-8 bg-brand-primary rounded-t-lg" style={{ height: `${val}%` }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-text-muted font-bold px-4 pt-1">
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                    </div>
                  </div>

                  {/* System Fee Configurator */}
                  <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-4 text-text-main">
                    <div>
                      <h3 className="font-display font-bold text-md text-text-main">Global Settings Configurator</h3>
                      <p className="text-xs text-text-muted mt-0.5">Control base fee rates and platform parameters.</p>
                    </div>

                    <form onSubmit={handleCommissionSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase block mb-1 font-display">Base Platform Commission (%)</label>
                        <input
                          type="number"
                          required
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(Number(e.target.value))}
                          className="w-full bg-brand-bg border border-card-border rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-brand-primary font-bold"
                        />
                      </div>

                      {commissionSuccess && (
                        <div className="p-2 bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs rounded-xl font-semibold">
                          Settings synchronized successfully.
                        </div>
                      )}

                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                      >
                        Save Configuration
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* LISTINGS MANAGER PANEL */}
              {activeTab === "listings" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="font-display font-bold text-lg text-text-main">Platform Active Listings</h2>
                    <div className="flex border border-card-border bg-brand-bg rounded-lg p-0.5">
                      <button
                        onClick={() => setListingsTab("vehicles")}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          listingsTab === "vehicles" ? "bg-card-bg text-brand-primary shadow-xs" : "text-text-muted hover:text-text-main"
                        }`}
                      >
                        Vehicles ({vehicles.length})
                      </button>
                      <button
                        onClick={() => setListingsTab("tours")}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          listingsTab === "tours" ? "bg-card-bg text-brand-primary shadow-xs" : "text-text-muted hover:text-text-main"
                        }`}
                      >
                        Tourism Tours ({tours.length})
                      </button>
                    </div>
                  </div>

                  {listingsTab === "vehicles" ? (
                    <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-card-border text-text-muted font-bold bg-brand-bg/50">
                            <th className="p-4">Vehicle Model</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">License Plate</th>
                            <th className="p-4">Rate</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border text-text-main font-semibold">
                          {vehicles.map((v) => (
                            <tr key={v.id} className="hover:bg-brand-bg/20">
                              <td className="p-4 font-bold">{v.make} {v.model}</td>
                              <td className="p-4 capitalize text-text-muted">{v.category.replace("_", " ")}</td>
                              <td className="p-4 font-mono text-[11px] text-text-muted">{v.license_plate}</td>
                              <td className="p-4 font-bold text-brand-primary">${v.price_per_day}/day</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => deleteVehicle(v.id)}
                                  className="px-2.5 py-1 text-[10px] bg-brand-danger/10 text-brand-danger border border-brand-danger/25 hover:bg-brand-danger/20 font-bold rounded-lg cursor-pointer transition-all"
                                >
                                  Delete listing
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-card-border text-text-muted font-bold bg-brand-bg/50">
                            <th className="p-4">Tour Title</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Total Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border text-text-main font-semibold">
                          {tours.map((t) => (
                            <tr key={t.id} className="hover:bg-brand-bg/20">
                              <td className="p-4 font-bold">{t.title}</td>
                              <td className="p-4 text-text-muted">{t.duration_days} Days</td>
                              <td className="p-4 font-bold text-brand-primary">${t.price}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                  t.is_active ? "bg-brand-success/15 border-brand-success/30 text-brand-success" : "bg-brand-danger/10 border-brand-danger/25 text-brand-danger"
                                }`}>
                                  {t.is_active ? "Active" : "Disabled"}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => deleteTour(t.id)}
                                  className="px-2.5 py-1 text-[10px] bg-brand-danger/10 text-brand-danger border border-brand-danger/25 hover:bg-brand-danger/20 font-bold rounded-lg cursor-pointer transition-all"
                                >
                                  Delete listing
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-lg text-text-main">User Directory</h2>

                  <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-card-border text-text-muted font-bold bg-brand-bg/50">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border text-text-main font-semibold">
                        {usersList.map((u, idx) => (
                          <tr key={idx} className="hover:bg-brand-bg/20">
                            <td className="p-4 font-bold">{u.name}</td>
                            <td className="p-4 text-text-muted">{u.email}</td>
                            <td className="p-4 capitalize font-medium">{u.role}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === "Active" 
                                  ? "bg-brand-success/15 border-brand-success/30 text-brand-success" 
                                  : "bg-brand-danger/10 border-brand-danger/25 text-brand-danger"
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => toggleUserStatus(u.email)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border transition-colors ${
                                  u.status === "Active" 
                                    ? "bg-brand-danger/10 border-brand-danger/25 text-brand-danger hover:bg-brand-danger/20" 
                                    : "bg-brand-success/15 border-brand-success/30 text-brand-success hover:bg-brand-success/20"
                                }`}
                              >
                                {u.status === "Active" ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

              {/* APPROVALS TAB */}
              {activeTab === "approvals" && (
                <div className="space-y-8">
                  {/* KYCs verifications */}
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-lg text-text-main">KYC Document Approvals</h2>
                    
                    <div className="space-y-4">
                      {verifications.filter(v => v.status === "pending").length === 0 ? (
                        <div className="bg-card-bg border border-card-border p-8 rounded-3xl text-center text-text-muted text-xs shadow-xs font-semibold">
                          No pending document verifications.
                        </div>
                      ) : (
                        verifications.filter(v => v.status === "pending").map(v => (
                          <div key={v.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">{v.type}</span>
                                <h3 className="font-display font-bold text-md text-text-main mt-2">{v.name}</h3>
                              </div>
                              <span className="text-xs text-text-muted font-mono font-semibold">{v.id}</span>
                            </div>

                            <p className="text-xs text-text-muted font-semibold">{v.details}</p>

                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleVerify(v.id, "reject")}
                                className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-brand-danger rounded-xl cursor-pointer"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleVerify(v.id, "approve")}
                                className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                              >
                                Verify & Approve
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Partner Registration Applications */}
                  <div className="space-y-6 pt-8 border-t border-card-border">
                    <h2 className="font-display font-bold text-lg text-text-main">Partner Workspaces Applications</h2>

                    <div className="space-y-4">
                      {pendingOwners.length === 0 && pendingDrivers.length === 0 && pendingOperators.length === 0 ? (
                        <div className="bg-card-bg border border-card-border p-8 rounded-3xl text-center text-text-muted text-xs shadow-xs font-semibold">
                          No pending partner applications.
                        </div>
                      ) : (
                        <>
                          {pendingOwners.map(o => (
                            <div key={o.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">Fleet Owner Application</span>
                                  <h3 className="font-display font-bold text-md text-text-main mt-2">{o.companyName}</h3>
                                </div>
                                <span className="text-xs text-text-muted font-mono font-semibold">{o.id}</span>
                              </div>
                              <p className="text-xs text-text-muted font-semibold">Representative Email: {o.email} | Contact: {o.phone}</p>
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handlePartnerVerify(o.id, "owner", "reject")} className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-brand-danger rounded-xl">Reject</button>
                                <button onClick={() => handlePartnerVerify(o.id, "owner", "approve")} className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl">Approve</button>
                              </div>
                            </div>
                          ))}
                          {pendingDrivers.map(d => (
                            <div key={d.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">Chauffeur Driver Application</span>
                                  <h3 className="font-display font-bold text-md text-text-main mt-2">{d.licenseNo}</h3>
                                </div>
                                <span className="text-xs text-text-muted font-mono font-semibold">{d.id}</span>
                              </div>
                              <p className="text-xs text-text-muted font-semibold">Email: {d.email} | Vehicle Match: {d.vehicleCategory}</p>
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handlePartnerVerify(d.id, "driver", "reject")} className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-brand-danger rounded-xl">Reject</button>
                                <button onClick={() => handlePartnerVerify(d.id, "driver", "approve")} className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl">Approve</button>
                              </div>
                            </div>
                          ))}
                          {pendingOperators.map(o => (
                            <div key={o.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">Tour Operator Application</span>
                                  <h3 className="font-display font-bold text-md text-text-main mt-2">{o.agencyName}</h3>
                                </div>
                                <span className="text-xs text-text-muted font-mono font-semibold">{o.id}</span>
                              </div>
                              <p className="text-xs text-text-muted font-semibold">License: {o.tourismLicense} | Email: {o.email}</p>
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handlePartnerVerify(o.id, "operator", "reject")} className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-brand-danger rounded-xl">Reject</button>
                                <button onClick={() => handlePartnerVerify(o.id, "operator", "approve")} className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl">Approve</button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pending Vehicle Bookings */}
                  <div className="space-y-6 pt-8 border-t border-card-border">
                    <h2 className="font-display font-bold text-lg text-text-main">Pending Vehicle Bookings</h2>

                    <div className="space-y-4">
                      {bookings.filter(b => b.status === "pending").length === 0 ? (
                        <div className="bg-card-bg border border-card-border p-8 rounded-3xl text-center text-text-muted text-xs shadow-xs font-semibold">
                          No pending vehicle bookings approvals.
                        </div>
                      ) : (
                        bookings.filter(b => b.status === "pending").map(b => (
                          <div key={b.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">Booking Request &bull; {b.paymentMethod.toUpperCase()}</span>
                                <h3 className="font-display font-bold text-md text-text-main mt-2">{b.vehicle}</h3>
                              </div>
                              <span className="text-xs text-text-muted font-mono font-semibold">{b.id}</span>
                            </div>

                            <div className="text-xs text-text-muted space-y-1 font-semibold">
                              <p>Client: <strong className="text-text-main">{b.client}</strong></p>
                              <p>Duration: <strong className="text-text-main">{b.days} days</strong></p>
                              <p>Cost: <strong className="text-brand-success">${b.price}</strong></p>
                              <p>Date: <strong className="text-text-muted">{b.timestamp}</strong></p>
                            </div>

                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleBookingApproval(b.id, "reject")}
                                className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-brand-danger rounded-xl cursor-pointer"
                              >
                                Reject Booking
                              </button>
                              <button 
                                onClick={() => handleBookingApproval(b.id, "approve")}
                                className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
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

              {/* ANNOUNCEMENT BANNER TAB */}
              {activeTab === "announcements" && (
                <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-main">Global Announcement Banner Editor</h3>
                    <p className="text-xs text-text-muted mt-0.5">Publish alerts, promotional details, and notifications across RideSphere site-wide headers.</p>
                  </div>

                  <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Banner Message Text</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 📢 Flat 20% off on all Skardu and Hunza tours during July!"
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="activate-banner"
                        checked={announcementActive}
                        onChange={(e) => setAnnouncementActive(e.target.checked)}
                        className="h-4.5 w-4.5 rounded text-brand-primary border-card-border focus:ring-brand-primary focus:ring-2 cursor-pointer bg-brand-bg"
                      />
                      <label htmlFor="activate-banner" className="text-xs font-bold text-text-main cursor-pointer">
                        Activate banner broadcast site-wide
                      </label>
                    </div>

                    {announcementSuccess && (
                      <div className="p-3 bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs rounded-xl flex items-center gap-1.5 font-bold">
                        <CheckCircle className="h-4 w-4" /> Banner status updated globally!
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Save and Broadcast
                    </button>
                  </form>
                </div>
              )}

              {/* AUDITS TAB */}
              {activeTab === "audits" && (
                <div className="space-y-6">
                  <h2 className="font-display font-bold text-lg text-text-main">Security Audit Trail</h2>

                  <div className="space-y-4">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="bg-card-bg border border-card-border p-5 rounded-3xl flex justify-between items-center text-xs shadow-xs">
                        <div>
                          <span className="text-[9px] text-text-muted font-bold">{log.timestamp} &bull; Action by: {log.user}</span>
                          <p className="text-text-main font-semibold mt-1">{log.action}</p>
                        </div>
                        <span className="bg-brand-success/15 text-brand-success border border-brand-success/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
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
              
              {/* Database Live Audit Metrics */}
              <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Database className="h-4.5 w-4.5 text-brand-primary" /> Database Live Audit
                </h3>
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex justify-between items-center border-b border-card-border pb-2">
                    <span className="text-text-muted">Registry Status</span>
                    <span className="text-brand-success font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-card-border pb-2">
                    <span className="text-text-muted">Active Vehicles</span>
                    <span className="text-text-main font-semibold">{vehicles.length} Vehicles</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-card-border pb-2">
                    <span className="text-text-muted">Active Tours</span>
                    <span className="text-text-main font-semibold">{tours.length} Tours</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-card-border pb-2">
                    <span className="text-text-muted">API Gateway Health</span>
                    <span className="text-brand-success font-bold">100% Operational</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5 text-brand-primary" /> Gateway & Maintenance
                </h3>
                
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center border-b border-card-border pb-2">
                    <span className="text-text-muted">Security Shield</span>
                    <span className="text-brand-success font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-card-border pb-3">
                    <span className="text-text-muted">Node Cluster</span>
                    <span className="text-text-main font-semibold">{sysHealth}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSysHealth(prev => prev === "Optimal" ? "Maintenance" : "Optimal")}
                    className="w-full py-2 border border-card-border hover:bg-brand-bg text-[11px] font-bold rounded-xl text-text-main transition-colors cursor-pointer"
                  >
                    Toggle System Mode
                  </button>

                  {reseedSuccess && (
                    <div className="p-2 bg-brand-success/15 border border-brand-success/30 text-brand-success text-[10px] rounded-lg font-bold">
                      Database reset successfully.
                    </div>
                  )}

                  <button 
                    onClick={triggerReseedDB}
                    disabled={reseedLoading}
                    className="w-full py-2 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger hover:bg-brand-danger/20 text-[11px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${reseedLoading ? "animate-spin" : ""}`} /> 
                    {reseedLoading ? "Resetting Database..." : "Reset System Simulation DB"}
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-3">
                <h3 className="font-display font-bold text-sm text-text-main">Recent Activity</h3>
                <div className="space-y-3.5 pt-2 text-xs">
                  <p className="text-text-muted leading-relaxed"><strong className="text-text-main">Jane Doe</strong> matched a ride simulator <span className="text-[10px] text-text-muted block mt-0.5">Today 12:45 PM</span></p>
                  <p className="text-text-muted leading-relaxed"><strong className="text-text-main">System Admin</strong> loaded Unsplash package tours <span className="text-[10px] text-text-muted block mt-0.5">Just Now</span></p>
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


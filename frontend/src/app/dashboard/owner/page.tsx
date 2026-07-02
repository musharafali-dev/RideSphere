"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, Shield, Users, Landmark, DollarSign, Calendar, 
  Trash, CheckCircle, X, ChevronRight, BarChart3, AlertCircle, ArrowUpRight, TrendingUp
} from "lucide-react";

interface Listing {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  status: "available" | "rented" | "maintenance";
}

interface Request {
  id: string;
  client: string;
  vehicle: string;
  dates: string;
  earning: number;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  
  // Create state inputs
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("car_rental");
  const [price, setPrice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    // Auth & RBAC guard check
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard/owner");
      return;
    }
    
    if (role !== "owner") {
      router.replace(`/dashboard/${role || "customer"}`);
      return;
    }

    setLoading(false);

    setListings([
      { id: "v1", make: "Toyota", model: "Corolla", category: "car_rental", price: 40, status: "available" },
      { id: "v2", make: "Honda", model: "Civic", category: "car_rental", price: 45, status: "available" },
      { id: "v3", make: "BMW", model: "X5", category: "luxury", price: 220, status: "rented" }
    ]);

    setRequests([
      { id: "req-1", client: "David Navigator", vehicle: "Toyota Corolla", dates: "July 05 - July 07", earning: 80 },
      { id: "req-2", client: "Sarah Shah", vehicle: "BMW X5", dates: "July 10 - July 12", earning: 440 }
    ]);
  }, [router]);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !price) return;
    const newV: Listing = {
      id: `v${Date.now()}`,
      make,
      model,
      category,
      price: Number(price),
      status: "available"
    };
    setListings(prev => [...prev, newV]);
    setShowAddModal(false);
    setMake("");
    setModel("");
    setPrice("");
  };

  const handleDeleteVehicle = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: "available" | "rented" | "maintenance") => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleAction = (id: string, accept: boolean) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    alert(`Rental request ${accept ? "accepted" : "rejected"} successfully.`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    setWithdrawSuccess(true);
    setWithdrawAmount("");
    setTimeout(() => setWithdrawSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-bg justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-card-border pb-6 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-main">Fleet & Earnings Control</h1>
            <p className="text-xs text-text-muted mt-1">Manage listings, accept customer rentals, and review earnings statistics.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm self-start md:self-auto"
          >
            Add New Vehicle
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Active Fleet Size</span>
            <span className="text-3xl font-extrabold text-text-main block mt-2">{listings.length} Vehicles</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Earnings</span>
            <span className="text-3xl font-extrabold text-brand-primary block mt-2">$8,450.00</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pending Requests</span>
            <span className="text-3xl font-extrabold text-amber-500 block mt-2">{requests.length} Requests</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Withdrawal Balance</span>
            <span className="text-3xl font-extrabold text-brand-success block mt-2">$2,190.00</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "vehicles", label: "My Vehicles", icon: Car },
              { id: "requests", label: "Rent Requests", icon: Users },
              { id: "withdrawals", label: "Withdraw Funds", icon: Landmark },
              { id: "analytics", label: "Analytics Desk", icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-text-muted hover:bg-brand-bg/50 hover:text-text-main"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Workspace */}
          <div className="lg:col-span-3">
            
            {/* VEHICLES PANEL */}
            {activeTab === "vehicles" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Vehicle Listings</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listings.map(l => (
                    <div key={l.id} className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs flex flex-col justify-between hover:border-card-border transition-colors group">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-md text-text-main group-hover:text-brand-primary transition-colors">
                              {l.make} {l.model}
                            </h3>
                            <span className="text-[10px] text-text-muted capitalize block mt-0.5 font-bold tracking-wider">{l.category.replace("_", " ")}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            l.status === "available" ? "bg-brand-success/10 text-brand-success" : 
                            l.status === "rented" ? "bg-brand-primary/10 text-brand-primary" : "bg-amber-50 text-amber-600"
                          }`}>
                            {l.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-6 border-t border-slate-55 pt-4">
                          <span className="text-sm font-extrabold text-text-main">${l.price} <span className="text-xs text-text-muted font-normal">/day</span></span>
                          <div className="flex gap-2">
                            <select
                              value={l.status}
                              onChange={(e) => handleStatusChange(l.id, e.target.value as any)}
                              className="text-[10px] bg-brand-bg border border-card-border text-text-main rounded-lg p-1.5 font-semibold focus:outline-none focus:border-blue-600 cursor-pointer"
                            >
                              <option value="available">Available</option>
                              <option value="rented">Rented</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                            <button
                              onClick={() => handleDeleteVehicle(l.id)}
                              className="p-1.5 rounded bg-brand-danger/10 text-brand-danger border border-brand-danger/20 hover:bg-red-100 cursor-pointer"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REQUESTS PANEL */}
            {activeTab === "requests" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Pending Checkout Requests</h2>

                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-12 bg-card-bg border border-card-border rounded-3xl text-text-muted text-xs">
                      No pending requests.
                    </div>
                  ) : (
                    requests.map(r => (
                      <div key={r.id} className="bg-card-bg border border-card-border p-6 rounded-3xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-xs">
                        <div>
                          <span className="text-[9px] font-bold text-text-muted uppercase block">From: {r.client}</span>
                          <h3 className="font-display font-bold text-md text-text-main mt-1">{r.vehicle}</h3>
                          <span className="text-[11px] text-text-muted mt-1 block">Requested: {r.dates}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-text-main mr-2">${r.earning}</span>
                          <button
                            onClick={() => handleAction(r.id, false)}
                            className="px-4 py-2 border border-card-border text-text-muted text-xs font-bold rounded-xl hover:bg-brand-bg cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(r.id, true)}
                            className="px-4 py-2 bg-brand-primary hover:bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* WITHDRAWALS PANEL */}
            {activeTab === "withdrawals" && (
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-text-main">Withdraw Earnings</h2>
                  <p className="text-xs text-text-muted mt-1">Payout directly to your registered bank account or digital wallet.</p>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4 max-w-sm">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Available Balance: $2,190.00</label>
                    <input
                      type="number"
                      required
                      placeholder="Enter amount to withdraw..."
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>

                  {withdrawSuccess && (
                    <div className="p-3 bg-brand-success/10 border border-brand-success/20 text-brand-success text-xs rounded-xl flex items-center gap-1.5 font-bold">
                      <CheckCircle className="h-4 w-4" /> Withdrawal request submitted!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    Process Payout
                  </button>
                </form>
              </div>
            )}

            {/* ANALYTICS PANEL */}
            {activeTab === "analytics" && (
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-8">
                <div>
                  <h2 className="font-display font-bold text-lg text-text-main">Earnings & Bookings Charts Desk</h2>
                  <p className="text-xs text-text-muted mt-1">Audit weekly usage rates and monthly revenue logs.</p>
                </div>

                {/* SVG utilisation graph */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase block mb-4">Weekly Fleet Utilization Rate</span>
                  <div className="h-48 w-full flex items-end justify-between pt-6 border-b border-l border-card-border pl-4 pb-2">
                    {[65, 80, 72, 85, 90, 82, 88].map((val, idx) => (
                      <div key={idx} className="w-8 bg-brand-primary rounded-t-lg transition-all hover:bg-brand-primary flex flex-col items-center justify-end" style={{ height: `${val}%` }}>
                        <span className="text-[9px] text-white font-bold mb-1">{val}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted font-bold px-4 pt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* SVG Revenue Line Graph */}
                <div className="space-y-4 pt-6 border-t border-card-border">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase block">Dynamic Revenue Flow ($)</span>
                    <span className="text-[10px] bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> +24% vs Last Week
                    </span>
                  </div>
                  
                  <div className="relative h-32 border-b border-l border-card-border pl-4 pb-2 w-full pt-4">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path
                        d="M0 80 Q 50 20, 100 60 T 200 10 T 300 50 T 400 5 T 500 30"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        className="drop-shadow-md"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted font-bold px-4 pt-1">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal: Create Vehicle */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border border-card-border rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-text-main">Add New Vehicle</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-main">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4 text-text-main">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Make</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Model</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corolla"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="car_rental">Economy / SUV Car</option>
                    <option value="luxury">Luxury Vehicle</option>
                    <option value="bike_rental">Bike Rental</option>
                    <option value="bus_coaster">Tour Bus / Coaster</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Daily Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Create Listing
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

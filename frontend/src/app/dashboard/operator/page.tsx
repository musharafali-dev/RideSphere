"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Compass, Users, Map, Landmark, Plus, 
  Calendar, CheckCircle, Award, Settings, Trash, X 
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  duration: number;
  price: number;
  occupancy: number;
  maxSeats: number;
  guide: string;
  status: "active" | "draft";
}

export default function OperatorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("packages");
  const [tours, setTours] = useState<Tour[]>([]);
  const [guides, setGuides] = useState<string[]>([]);
  const [newGuide, setNewGuide] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Inputs
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [selectedGuide, setSelectedGuide] = useState("");

  useEffect(() => {
    // Auth & RBAC guard check
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard/operator");
      return;
    }
    
    if (role !== "operator") {
      router.replace(`/dashboard/${role || "customer"}`);
      return;
    }

    setLoading(false);

    setTours([
      { id: "t1", title: "Hunza Valley Adventure", duration: 7, price: 399, occupancy: 24, maxSeats: 29, guide: "Ali Khan", status: "active" },
      { id: "t2", title: "Skardu Expedition", duration: 5, price: 450, occupancy: 12, maxSeats: 15, guide: "Noman Ahmed", status: "active" }
    ]);
    setGuides(["Ali Khan", "Noman Ahmed", "Sarah Shah"]);
  }, [router]);

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !duration || !price) return;
    const newT: Tour = {
      id: `t${Date.now()}`,
      title,
      duration: Number(duration),
      price: Number(price),
      occupancy: 0,
      maxSeats: 20,
      guide: selectedGuide || "Unassigned",
      status: "active"
    };
    setTours(prev => [...prev, newT]);
    setShowAddModal(false);
    setTitle("");
    setDuration("");
    setPrice("");
  };

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuide) return;
    setGuides(prev => [...prev, newGuide]);
    setNewGuide("");
  };

  const assignGuide = (tourId: string, guideName: string) => {
    setTours(prev => prev.map(t => t.id === tourId ? { ...t, guide: guideName } : t));
  };

  const incrementOccupancy = (tourId: string) => {
    setTours(prev => prev.map(t => {
      if (t.id === tourId && t.occupancy < t.maxSeats) {
        return { ...t, occupancy: t.occupancy + 1 };
      }
      return t;
    }));
  };

  const decrementOccupancy = (tourId: string) => {
    setTours(prev => prev.map(t => {
      if (t.id === tourId && t.occupancy > 0) {
        return { ...t, occupancy: t.occupancy - 1 };
      }
      return t;
    }));
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
            <h1 className="font-display font-bold text-3xl text-text-main">Tour Operations Desk</h1>
            <p className="text-xs text-text-muted mt-1">Configure itinerary packages, assign local guides, and track group departures.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3 bg-brand-primary hover:bg-brand-primary rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
          >
            + Create Tour Package
          </button>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Hosted Packages</span>
            <span className="text-3xl font-extrabold text-text-main">{tours.length} Tours</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Average Seating Occupancy</span>
            <span className="text-3xl font-extrabold text-brand-primary">81%</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Operator Revenue</span>
            <span className="text-3xl font-extrabold text-text-main">
              ${tours.reduce((acc, t) => acc + (t.price * t.occupancy), 0)}
            </span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Upcoming Departures</span>
            <span className="text-3xl font-extrabold text-amber-500">2 Departures</span>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "packages", label: "Tours & Packages", icon: Compass },
              { id: "guides", label: "Guides Registry", icon: Users },
              { id: "logistics", label: "Vehicles & Coasters", icon: Map }
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

          {/* Main workspace */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* PACKAGES TAB */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Active Tourism Packages</h2>

                <div className="space-y-4">
                  {tours.map(t => {
                    const percentage = Math.round((t.occupancy / t.maxSeats) * 100);
                    return (
                      <div key={t.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs hover:border-card-border transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-lg text-text-main">{t.title}</h3>
                            <p className="text-xs text-text-muted mt-0.5">
                              {t.duration} Days &bull; Guide: <strong className="text-brand-primary">{t.guide}</strong>
                            </p>
                          </div>
                          <span className="text-lg font-extrabold text-slate-955">${t.price}</span>
                        </div>

                        {/* Progress Bar for Occupancy */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-text-muted">Coaster Seating Occupancy</span>
                            <span className="text-brand-primary">{t.occupancy} / {t.maxSeats} Booked ({percentage}%)</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-primary transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Assignment select & Occupancy buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Assign Guide:</span>
                            <select 
                              value={t.guide}
                              onChange={(e) => assignGuide(t.id, e.target.value)}
                              className="bg-brand-bg border border-card-border text-text-main text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="Unassigned">Unassigned</option>
                              {guides.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Simulate Booking:</span>
                            <button
                              onClick={() => decrementOccupancy(t.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-text-main rounded-lg text-xs font-extrabold cursor-pointer"
                            >
                              - Remove Seat
                            </button>
                            <button
                              onClick={() => incrementOccupancy(t.id)}
                              className="px-2 py-1 bg-brand-primary/10 hover:bg-blue-100 text-brand-primary rounded-lg text-xs font-extrabold cursor-pointer"
                            >
                              + Add Seat
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GUIDES TAB */}
            {activeTab === "guides" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Tour Guides Directory</h2>

                <form onSubmit={handleAddGuide} className="bg-card-bg border border-card-border p-6 rounded-3xl flex gap-3 shadow-xs">
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of guide"
                    value={newGuide}
                    onChange={(e) => setNewGuide(e.target.value)}
                    className="grow bg-brand-bg border border-card-border text-text-main rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-600 font-semibold"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Add Guide
                  </button>
                </form>

                <div className="bg-card-bg border border-card-border rounded-3xl p-6 divide-y divide-card-border shadow-xs">
                  {guides.map(g => (
                    <div key={g} className="py-3 flex justify-between items-center text-xs font-semibold text-text-main">
                      <span>{g}</span>
                      <span className="text-[10px] bg-brand-success/10 text-brand-success border border-brand-success/20 px-2.5 py-0.5 rounded-full font-bold">Active Status</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOGISTICS TAB */}
            {activeTab === "logistics" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Coaster Seating & Transport</h2>
                <div className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-center text-xs font-semibold border-b border-card-border pb-3">
                    <span className="text-text-main">Toyota Coaster (BUS-5566)</span>
                    <span className="text-brand-primary">24 / 29 Seating Booked</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-text-main">Hyundai Universe Bus (BUS-9900)</span>
                    <span className="text-brand-primary">12 / 45 Seating Booked</span>
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
                <h3 className="font-display font-bold text-xl text-text-main">Add New Tour Package</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-main">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTour} className="space-y-4 text-text-main">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Tour Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaghan Valley Expedition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Price per Seat ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 299"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase block mb-1">Assign Primary Guide</label>
                  <select
                    value={selectedGuide}
                    onChange={(e) => setSelectedGuide(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {guides.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Create Package
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

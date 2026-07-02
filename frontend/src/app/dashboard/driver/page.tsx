"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Navigation, Star, Award, Compass, Landmark, 
  MapPin, CheckCircle, Clock, ToggleLeft, ToggleRight, Loader2, ArrowRight
} from "lucide-react";

interface Dispatch {
  id: string;
  client: string;
  pickup: string;
  destination: string;
  earning: number;
  status: "pending" | "accepted" | "rejected";
}

export default function DriverDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trips");
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [online, setOnline] = useState(true);
  const [rating, setRating] = useState(4.9);
  const [revenue, setRevenue] = useState(380);

  // Active simulated trip tracker
  const [activeTrip, setActiveTrip] = useState<Dispatch | null>(null);
  const [tripProgress, setTripProgress] = useState(0);
  const [tripStepText, setTripStepText] = useState("");

  useEffect(() => {
    // Auth & RBAC guard check
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard/driver");
      return;
    }
    
    if (role !== "driver") {
      router.replace(`/dashboard/${role || "customer"}`);
      return;
    }

    setLoading(false);

    setDispatches([
      { id: "DISP-001", client: "Jane Doe", pickup: "Gulberg III, Lahore", destination: "Allama Iqbal International Airport", earning: 25, status: "pending" },
      { id: "DISP-002", client: "Ali Khan", pickup: "DHA Phase 5, Lahore", destination: "Emporium Mall", earning: 18, status: "pending" }
    ]);
  }, [router]);

  const handleDispatchAction = (id: string, action: "accept" | "reject") => {
    if (action === "reject") {
      setDispatches(prev => prev.filter(d => d.id !== id));
      return;
    }

    // Accept & start simulation
    const match = dispatches.find(d => d.id === id);
    if (!match) return;

    setDispatches(prev => 
      prev.map(d => d.id === id ? { ...d, status: "accepted" as const } : d)
    );
    setActiveTrip(match);
    setTripProgress(0);
    setTripStepText("Heading to Pickup location...");

    // Simulate route steps
    setTimeout(() => {
      setTripProgress(35);
      setTripStepText("Passenger Picked up. Navigating towards destination...");
    }, 2500);

    setTimeout(() => {
      setTripProgress(70);
      setTripStepText("Approaching destination. Expect arrival in 2 minutes...");
    }, 5500);

    setTimeout(() => {
      setTripProgress(100);
      setTripStepText("Arrived! Click Complete to process fare settlement.");
    }, 8500);
  };

  const handleCompleteTrip = () => {
    if (!activeTrip) return;
    setRevenue(prev => prev + activeTrip.earning);
    setDispatches(prev => prev.filter(d => d.id !== activeTrip.id));
    setActiveTrip(null);
    setTripProgress(0);
    alert("Trip complete! Earning credited to payout balance.");
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
            <h1 className="font-display font-bold text-3xl text-text-main">Driver Workspace</h1>
            <p className="text-xs text-text-muted mt-1">Accept city ride dispatches, update duties status, and review ratings metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-muted">Duty Status:</span>
            <button onClick={() => setOnline(!online)} className="cursor-pointer">
              {online ? (
                <ToggleRight className="h-10 w-10 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-slate-300" />
              )}
            </button>
            <span className={`text-xs font-bold ${online ? "text-brand-success" : "text-text-muted"}`}>
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Today's Earnings</span>
            <span className="text-3xl font-extrabold text-text-main">${revenue}</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Performance Rating</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-brand-primary">{rating}</span>
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Completed Trips</span>
            <span className="text-3xl font-extrabold text-text-main">42 Trips</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Dispatches Available</span>
            <span className="text-3xl font-extrabold text-amber-500">
              {dispatches.filter(d => d.status === "pending").length} Available
            </span>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "trips", label: "Ride Dispatches", icon: Navigation },
              { id: "earnings", label: "My Earnings", icon: Landmark },
              { id: "documents", label: "Verify Documents", icon: Award }
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
            
            {/* RIDE DISPATCHES TAB */}
            {activeTab === "trips" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display font-bold text-lg text-text-main">Dispatch Queue</h2>
                  {activeTrip && (
                    <span className="flex items-center gap-1.5 text-xs text-brand-primary font-bold bg-brand-primary/10 px-3 py-1 rounded-full">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Simulated Duty In-Progress
                    </span>
                  )}
                </div>

                {activeTrip ? (
                  /* Simulated Active Trip Tracker Panel */
                  <div className="bg-card-bg border border-card-border p-8 rounded-3xl space-y-6 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Active Job &bull; {activeTrip.id}</span>
                      <h3 className="font-display font-bold text-lg text-text-main mt-1">{activeTrip.client}</h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                      <span>{activeTrip.pickup}</span>
                      <ArrowRight className="h-4 w-4 text-text-muted" />
                      <span>{activeTrip.destination}</span>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-text-muted">
                        <span>Route Progress</span>
                        <span>{tripProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary transition-all duration-500"
                          style={{ width: `${tripProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-primary/10/40 border border-blue-100 rounded-2xl text-xs text-blue-700 leading-relaxed font-semibold">
                      {tripStepText}
                    </div>

                    {tripProgress === 100 && (
                      <button
                        onClick={handleCompleteTrip}
                        className="w-full py-3 bg-emerald-600 hover:bg-brand-success/100 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                      >
                        Complete Job & Collect ${activeTrip.earning}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Standard dispatch lists queue */
                  <div className="space-y-4">
                    {!online ? (
                      <div className="text-center py-12 bg-card-bg border border-card-border rounded-3xl text-text-muted text-xs font-semibold">
                        You are currently OFFLINE. Toggle status to Online to accept jobs.
                      </div>
                    ) : dispatches.filter(d => d.status === "pending").length === 0 ? (
                      <div className="text-center py-12 bg-card-bg border border-card-border rounded-3xl text-text-muted text-xs font-semibold">
                        All dispatches accepted. Queue: 0.
                      </div>
                    ) : (
                      dispatches.filter(d => d.status === "pending").map(d => (
                        <div key={d.id} className="bg-card-bg border border-card-border p-6 rounded-3xl space-y-4 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-bold text-text-muted uppercase block">Instant Booking &bull; {d.id}</span>
                              <h3 className="font-display font-bold text-md text-text-main mt-1">{d.client}</h3>
                            </div>
                            <span className="text-lg font-extrabold text-brand-success">${d.earning}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted border-y border-slate-50 py-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-text-main block text-[9px] uppercase font-bold">Pick-up</strong>
                                {d.pickup}
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-text-main block text-[9px] uppercase font-bold">Destination</strong>
                                {d.destination}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleDispatchAction(d.id, "reject")}
                              className="px-4 py-2 border border-card-border hover:bg-brand-bg text-xs font-semibold text-text-muted rounded-xl cursor-pointer"
                            >
                              Reject Job
                            </button>
                            <button 
                              onClick={() => handleDispatchAction(d.id, "accept")}
                              className="px-5 py-2 bg-brand-primary hover:bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                            >
                              Accept Ride & Start Route
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MY EARNINGS TAB */}
            {activeTab === "earnings" && (
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
                <h2 className="font-display font-bold text-lg text-text-main">Earnings Log</h2>
                
                {/* SVG Earnings chart */}
                <div className="space-y-2">
                  <div className="h-40 w-full flex items-end justify-between border-b border-l border-card-border pl-4 pb-2">
                    {[50, 75, 45, 90, 110, 60, 80].map((val, idx) => (
                      <div key={idx} className="w-8 bg-brand-primary rounded-t-lg flex flex-col justify-end" style={{ height: `${val}%` }}>
                        <span className="text-[9px] text-white font-bold mb-1 text-center">${val}</span>
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
              </div>
            )}

            {/* VERIFY DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-text-main">Verification Credentials</h2>
                  <p className="text-xs text-text-muted mt-1">Upload and configure your Commercial Chauffeur Driver License credentials.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="border border-card-border rounded-2xl p-4 flex justify-between items-center bg-brand-bg">
                    <div>
                      <span className="text-xs font-bold text-text-main block">Driver License (DL-PK-998822)</span>
                      <span className="text-[10px] text-brand-success font-semibold mt-0.5 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

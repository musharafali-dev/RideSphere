"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Car, Plus, DollarSign, Calendar, TrendingUp, CheckCircle, 
  AlertTriangle, Hammer, X, MessageCircle 
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  status: "available" | "rented" | "maintenance";
  nextCheck: string;
}

export default function OwnerDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [earnings, setEarnings] = useState(1480);
  const [requests, setRequests] = useState<any[]>([]);

  // Add Vehicle Inputs
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("car_rental");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setVehicles([
      { id: "ov1", make: "Toyota", model: "Corolla", category: "car_rental", price: 50, status: "available", nextCheck: "July 24, 2026" },
      { id: "ov2", make: "Mercedes-Benz", model: "S-Class", category: "luxury", price: 250, status: "rented", nextCheck: "Aug 15, 2026" },
      { id: "ov3", make: "Honda", model: "CB500X", category: "bike_rental", price: 35, status: "maintenance", nextCheck: "In Progress" }
    ]);

    setRequests([
      {
        id: "REQ-01",
        customer: "Jane Doe",
        vehicle: "Toyota Corolla",
        dates: "July 8 - July 10",
        amount: 100
      },
      {
        id: "REQ-02",
        customer: "Arthur Pendragon",
        vehicle: "Mercedes S-Class",
        dates: "July 15 - July 18",
        amount: 750
      }
    ]);
  }, []);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !price) return;
    const newV: Vehicle = {
      id: `ov${Date.now()}`,
      make,
      model,
      category,
      price: Number(price),
      status: "available",
      nextCheck: "Aug 1, 2026"
    };
    setVehicles(prev => [newV, ...prev]);
    setShowAddModal(false);
    setMake("");
    setModel("");
    setPrice("");
  };

  const handleRequestAction = (id: string, action: "accept" | "reject") => {
    if (action === "accept") {
      const req = requests.find(r => r.id === id);
      if (req) {
        setEarnings(prev => prev + req.amount);
      }
    }
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Fleet & Earnings Control</h1>
            <p className="text-slate-400 mt-1">Manage listings, accept customer rentals, and review earnings statistics.</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4.5 w-4.5" /> List a Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Total Fleet</span>
            <span className="text-3xl font-extrabold text-white">{vehicles.length} Vehicles</span>
          </div>
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Rented Vehicles</span>
            <span className="text-3xl font-extrabold text-indigo-400">
              {vehicles.filter(v => v.status === "rented").length} Rented
            </span>
          </div>
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Maintenance Status</span>
            <span className="text-3xl font-extrabold text-amber-400 flex items-center gap-2">
              {vehicles.filter(v => v.status === "maintenance").length} Check
            </span>
          </div>
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Owner Earnings</span>
              <span className="text-3xl font-extrabold text-emerald-400">${earnings}</span>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Fleet Listings */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-indigo-400" /> Managed Fleet
            </h2>

            <div className="space-y-4">
              {vehicles.map(v => (
                <div key={v.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-colors">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{v.make} {v.model}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                      <span className="capitalize">{v.category.replace("_", " ")}</span>
                      <span>&bull;</span>
                      <span>Next Checkup: {v.nextCheck}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div className="text-right">
                      <span className="text-base font-bold text-white">${v.price}/day</span>
                      <span className="text-[10px] text-slate-500 block">Payout value</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border ${
                      v.status === "available" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : v.status === "rented"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Requests */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" /> Pending Offers
            </h2>

            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="border border-slate-850 p-6 rounded-2xl text-center text-slate-500 text-sm">
                  No pending booking requests.
                </div>
              ) : (
                requests.map(r => (
                  <div key={r.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-500 block">Customer</span>
                        <span className="font-semibold text-white text-sm">{r.customer}</span>
                      </div>
                      <span className="text-sm font-bold text-white">${r.amount}</span>
                    </div>
                    
                    <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                      <div><strong className="text-slate-300">Vehicle:</strong> {r.vehicle}</div>
                      <div className="mt-1"><strong className="text-slate-300">Dates:</strong> {r.dates}</div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRequestAction(r.id, "reject")}
                        className="flex-1 py-2 border border-slate-800 hover:bg-slate-800 text-xs font-semibold rounded-lg text-rose-400 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleRequestAction(r.id, "accept")}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal: List Vehicle */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">List a Vehicle</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Make</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota, Honda, etc."
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="Civic, Corolla, etc."
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Price per Day ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="car_rental">Car Rental</option>
                    <option value="luxury">Luxury Car</option>
                    <option value="bike_rental">Bike Rental</option>
                    <option value="bus_coaster">Buses / Coasters</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors mt-2"
                >
                  Confirm Registration
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

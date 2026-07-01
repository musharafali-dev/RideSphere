"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Compass, Plus, DollarSign, Users, Award, 
  Map, Calendar, Trash, CheckSquare 
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  duration: number;
  price: number;
  occupancy: number;
  maxSeats: number;
  itinerary: string;
}

export default function OperatorDashboard() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Inputs
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [itinerary, setItinerary] = useState("");

  useEffect(() => {
    setTours([
      {
        id: "t1",
        title: "Hunza Valley & Attabad Lake Adventure",
        duration: 7,
        price: 399,
        occupancy: 24,
        maxSeats: 30,
        itinerary: "Day 1: Travel to Chilas, Day 2: Karimabad, Day 3: Attabad Lake, Day 4: Khunjerab Pass..."
      },
      {
        id: "t2",
        title: "Lahore Historical & Cultural Day Tour",
        duration: 1,
        price: 45,
        occupancy: 8,
        maxSeats: 15,
        itinerary: "Morning: Badshahi Mosque, Afternoon: Fort, Evening: Shalimar Gardens dinner..."
      }
    ]);
  }, []);

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
      itinerary
    };
    setTours(prev => [...prev, newT]);
    setShowAddModal(false);
    setTitle("");
    setDuration("");
    setPrice("");
    setItinerary("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Tour Management Desk</h1>
            <p className="text-slate-400 mt-1">Configure itinerary packages, monitor occupancy rates, and view operator revenues.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4.5 w-4.5" /> Create Tour Package
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Total Packages Hosted</span>
            <span className="text-3xl font-extrabold text-white">{tours.length} Packages</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Total Booked Travelers</span>
            <span className="text-3xl font-extrabold text-indigo-400">
              {tours.reduce((acc, t) => acc + t.occupancy, 0)} Booked
            </span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Operator Net Revenue</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              ${tours.reduce((acc, t) => acc + (t.occupancy * t.price), 0)}
            </span>
          </div>
        </div>

        {/* Tours Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-400" /> Active Tour Packages
            </h2>

            <div className="space-y-4">
              {tours.map(t => {
                const percentage = Math.round((t.occupancy / t.maxSeats) * 100);
                return (
                  <div key={t.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display font-bold text-xl text-white">{t.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{t.duration} Days &bull; Itinerary Provided</p>
                      </div>
                      <span className="text-lg font-bold text-white">${t.price}</span>
                    </div>

                    {/* Progress Bar for Occupancy */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Occupancy Seating</span>
                        <span className="text-indigo-400">{t.occupancy} / {t.maxSeats} Booked ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-indigo-400" /> Operator Standards
            </h2>
            <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl space-y-4 text-xs text-slate-400 leading-relaxed">
              <p>✓ All long-distance coaches must be equipped with working Air Conditioning.</p>
              <p>✓ Tour operators must assign a verified secondary local driver for multi-day trips exceeding 400km.</p>
              <p>✓ Maintain hotel reservation verification logs at least 48 hours prior to departures.</p>
            </div>
          </div>

        </div>

        {/* Modal: Create Tour */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
              <h3 className="font-display font-bold text-xl text-white mb-6">Create Tour Package</h3>
              <form onSubmit={handleAddTour} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Hunza Discovery Tour"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="7"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="399"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Itinerary Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Describe main daily sights..."
                    value={itinerary}
                    onChange={(e) => setItinerary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Fuel, Settings as Gear, Users, CheckCircle, ArrowRight, GitCompare, Car } from "lucide-react";
import ComparisonModal from "@/components/ComparisonModal";

interface Vehicle {
  id: string;
  category: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  price_per_day: number;
  price_per_hour: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  image_url: string;
  is_available: boolean;
}

// Default seed vehicles for offline fallback
const fallbackVehicles: Vehicle[] = [
  {
    id: "v1",
    category: "car_rental",
    make: "Toyota",
    model: "Corolla Hybrid",
    year: 2022,
    color: "Silver",
    license_plate: "LEC-5566",
    price_per_day: 50,
    price_per_hour: 8,
    seats: 5,
    transmission: "automatic",
    fuel_type: "hybrid",
    image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    is_available: true
  },
  {
    id: "v2",
    category: "luxury",
    make: "Mercedes-Benz",
    model: "S-Class Prestige",
    year: 2023,
    color: "Black",
    license_plate: "VIP-777",
    price_per_day: 250,
    price_per_hour: 35,
    seats: 5,
    transmission: "automatic",
    fuel_type: "petrol",
    image_url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    is_available: true
  },
  {
    id: "v3",
    category: "bike_rental",
    make: "Honda",
    model: "CB500X Tourer",
    year: 2021,
    color: "Red",
    license_plate: "BIKE-9922",
    price_per_day: 35,
    price_per_hour: 5,
    seats: 2,
    transmission: "manual",
    fuel_type: "petrol",
    image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    is_available: true
  },
  {
    id: "v4",
    category: "bus_coaster",
    make: "Toyota",
    model: "Coaster Deluxe",
    year: 2020,
    color: "White",
    license_plate: "BUS-8800",
    price_per_day: 150,
    price_per_hour: 25,
    seats: 29,
    transmission: "manual",
    fuel_type: "diesel",
    image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    is_available: true
  }
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    // Try to fetch from FastAPI backend, fallback to offline seed data if server is down
    fetch("http://localhost:8000/api/v1/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(data);
        } else {
          setVehicles(fallbackVehicles);
        }
      })
      .catch(() => {
        setVehicles(fallbackVehicles);
      });
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? v.category === category : true;
    const matchesTransmission = transmission ? v.transmission === transmission : true;
    return matchesSearch && matchesCategory && matchesTransmission;
  });

  const toggleCompare = (v: Vehicle) => {
    if (compareList.some(item => item.id === v.id)) {
      setCompareList(prev => prev.filter(item => item.id !== v.id));
    } else {
      if (compareList.length >= 2) {
        alert("You can compare up to 2 vehicles at a time.");
        return;
      }
      setCompareList(prev => [...prev, v]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 bg-card-bg border border-card-border rounded-2xl p-6 self-start shadow-xs">
            <h2 className="font-display font-bold text-lg text-text-main mb-6">Filters</h2>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2 font-display">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-card-border text-text-main text-sm rounded-lg px-3 py-2 focus:border-brand-primary focus:outline-none font-medium cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="city_ride">City Ride</option>
                  <option value="car_rental">Car Rental</option>
                  <option value="luxury">Luxury Car</option>
                  <option value="bike_rental">Bike Rental</option>
                  <option value="bus_coaster">Buses / Coasters</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2 font-display">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-brand-bg border border-card-border text-text-main text-sm rounded-lg px-3 py-2 focus:border-brand-primary focus:outline-none font-medium cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="grow">
            {/* Search Bar & Compare Actions */}
            <div className="flex gap-4 mb-8">
              <div className="relative grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by brand, model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-card-bg border border-card-border rounded-xl py-3.5 pl-12 pr-4 text-text-main placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors text-sm font-semibold shadow-xs"
                />
              </div>
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-5 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <GitCompare className="h-4.5 w-4.5" /> Compare ({compareList.length})
                </button>
              )}
            </div>

            {/* List */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-20 bg-card-bg border border-card-border rounded-2xl shadow-xs">
                <p className="text-text-muted font-semibold text-sm">No vehicles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="group border border-card-border bg-card-bg rounded-2xl overflow-hidden hover:border-brand-primary/45 transition-all duration-300 flex flex-col shadow-xs hover:shadow-md"
                  >
                    <div className="h-48 overflow-hidden relative bg-linear-to-b from-slate-100 to-slate-200">
                      {v.image_url ? (
                        <img 
                          src={v.image_url} 
                          alt={`${v.make} ${v.model}`} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <Car className="h-10 w-10" />
                        </div>
                      )}
                      {v.is_available && (
                        <span className="absolute top-4 left-4 bg-brand-success/15 border border-brand-success/30 text-brand-success px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                          <CheckCircle className="h-3.5 w-3.5" /> Available
                        </span>
                      )}
                    </div>
                    <div className="p-6 grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-bold text-xl text-text-main group-hover:text-brand-primary transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-text-muted capitalize mt-1 mb-4 font-semibold">{v.category.replace("_", " ")}</p>

                        <div className="grid grid-cols-3 gap-2 text-xs text-text-muted border-b border-card-border pb-4 mb-4 font-semibold">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-brand-primary" /> {v.seats} Seats
                          </div>
                          <div className="flex items-center gap-1 capitalize">
                            <Gear className="h-3.5 w-3.5 text-brand-primary" /> {v.transmission}
                          </div>
                          <div className="flex items-center gap-1 capitalize">
                            <Fuel className="h-3.5 w-3.5 text-brand-primary" /> {v.fuel_type}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xl font-bold text-text-main">${v.price_per_day}</span>
                          <span className="text-xs text-text-muted">/day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCompare(v)}
                            className={`p-2 border rounded-lg transition-colors cursor-pointer ${
                              compareList.some(item => item.id === v.id)
                                ? "bg-brand-primary/20 border-brand-primary text-brand-primary"
                                : "border-card-border hover:bg-brand-bg text-text-muted hover:text-text-main"
                            }`}
                            title="Compare specs"
                          >
                            <GitCompare className="h-4.5 w-4.5" />
                          </button>
                          <Link
                            href={`/vehicles/${v.id}`}
                            className="inline-flex items-center gap-1 px-3.5 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            Book <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
      {showCompareModal && (
        <ComparisonModal
          vehicles={compareList}
          onClose={() => setShowCompareModal(false)}
          onSelect={(id) => {
            setShowCompareModal(false);
            window.location.href = `/vehicles/${id}`;
          }}
        />
      )}
    </div>
  );
}

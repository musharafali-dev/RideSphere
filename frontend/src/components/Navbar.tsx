"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Car, User, Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [role, setRole] = useState("customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role") || "customer";
    setRole(savedRole);
  }, []);

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem("user_role", newRole);
    setRole(newRole);
    setDropdownOpen(false);
    if (window.location.pathname.startsWith("/dashboard")) {
      window.location.href = `/dashboard/${newRole}`;
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07090e]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Car className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-2xl bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            RideSphere
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/vehicles" className="hover:text-white transition-colors">Vehicles</Link>
          <Link href="/tours" className="hover:text-white transition-colors">Tours</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Active Role Indicator / Simulator */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-all"
            >
              <span>Demo Role: <span className="text-indigo-400 capitalize">{role}</span></span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-800 bg-[#0c0f17] shadow-xl py-1 text-sm text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
                {["customer", "owner", "driver", "operator", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white capitalize transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/dashboard"
            className="flex items-center space-x-1 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Car, User, Bell, ChevronDown, Search, Menu, X, LogIn, UserPlus, LogOut, Shield } from "lucide-react";
import MegaMenu from "./MegaMenu";
import CommandPalette from "./CommandPalette";

export default function Navbar() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role") || "customer";
    const savedEmail = localStorage.getItem("user_email");
    setRole(savedRole);
    setEmail(savedEmail);

    // Sync state when role or email updates
    const syncAuth = () => {
      setRole(localStorage.getItem("user_role") || "customer");
      setEmail(localStorage.getItem("user_email"));
    };
    window.addEventListener("storage", syncAuth);

    // Listen for Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem("user_role", newRole);
    setRole(newRole);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (window.location.pathname.startsWith("/dashboard")) {
      window.location.href = `/dashboard/${newRole}`;
    } else {
      window.location.reload();
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_status");
    localStorage.removeItem("user_name");
    setEmail(null);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/auth/login";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg sm:text-2xl bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            RideSphere
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <button className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              Vehicles <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href="/tours" className="hover:text-white transition-colors">Tours</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Quick Search */}
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-xs text-slate-500 hover:text-slate-300 transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search (Ctrl+K)</span>
          </button>

          {/* Active Role Indicator / Simulator */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
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
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-white capitalize transition-colors cursor-pointer"
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

          {email ? (
            <>
              <button 
                onClick={handleLogOut}
                className="px-3.5 py-1.5 border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-[11px] font-bold text-slate-300 rounded-lg cursor-pointer transition-all"
              >
                Sign Out
              </button>
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-[11px] font-bold text-slate-300 rounded-lg cursor-pointer transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white rounded-lg cursor-pointer transition-all shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mega Menu Portal */}
        {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#020617] px-4 py-6 space-y-6 text-sm font-semibold text-slate-300 animate-in slide-in-from-top duration-200">
          
          {/* Main Links */}
          <div className="flex flex-col space-y-4">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="hover:text-white transition-colors">Home</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/vehicles" className="hover:text-white transition-colors">Browse Vehicles</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/tours" className="hover:text-white transition-colors">Browse Tours</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/dashboard" className="hover:text-white transition-colors">Partner Dashboard</Link>
          </div>

          <div className="border-t border-slate-800/60 pt-4 space-y-4">
            
            {/* Demo Role Switcher Simulator */}
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Simulate Partner Role</span>
              <div className="grid grid-cols-3 gap-2">
                {["customer", "owner", "driver", "operator", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] border capitalize font-bold transition-all text-center ${
                      role === r 
                        ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                        : "border-slate-800 bg-slate-900/40 text-slate-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          <div className="border-t border-slate-800/60 pt-4 flex flex-col gap-2.5">
            {email ? (
              <>
                <div className="flex items-center justify-between bg-slate-900/30 border border-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <User className="h-4.5 w-4.5 text-blue-500" />
                    <span className="text-xs text-slate-200 font-mono truncate max-w-[150px]">{email}</span>
                  </div>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-extrabold capitalize">{role}</span>
                </div>
                <button
                  onClick={handleLogOut}
                  className="w-full py-2.5 bg-red-650/10 border border-red-500/20 hover:bg-red-650/20 text-red-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/auth/login"
                  className="w-full py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/auth/register"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-sm"
                >
                  <UserPlus className="h-4 w-4" /> Create Partner Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Command Palette Overlay */}
      {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
    </header>
  );
}

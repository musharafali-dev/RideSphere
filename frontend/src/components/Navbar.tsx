"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Car, User, Bell, ChevronDown, Search, Menu, X, LogIn, UserPlus, LogOut, Shield, Sun, Moon } from "lucide-react";
import MegaMenu from "./MegaMenu";
import CommandPalette from "./CommandPalette";

export default function Navbar() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync credentials
    const savedRole = localStorage.getItem("user_role") || "customer";
    const savedEmail = localStorage.getItem("user_email");
    setTimeout(() => {
      setRole(savedRole);
      setEmail(savedEmail);
    }, 0);

    // Sync theme
    const savedTheme = localStorage.getItem("theme") || "light";
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }

    // Sync state when role, email, or theme updates in other tabs/components
    const syncState = () => {
      setRole(localStorage.getItem("user_role") || "customer");
      setEmail(localStorage.getItem("user_email"));
      
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme === "dark") {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };
    window.addEventListener("storage", syncState);

    // Listen for Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
    window.dispatchEvent(new Event("storage"));
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-card-bg/90 border-b border-card-border text-text-main transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-brand-primary p-2 rounded-xl text-white">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg sm:text-2xl text-text-main">
            RideSphere
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-text-muted">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <button className="hover:text-brand-primary transition-colors flex items-center gap-1 cursor-pointer font-semibold">
              Vehicles <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href="/tours" className="hover:text-brand-primary transition-colors">Tours</Link>
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">Dashboard</Link>
        </nav>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center space-x-3.5">
          {/* Quick Search */}
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-border bg-card-bg/50 hover:bg-brand-bg text-xs text-text-muted hover:text-text-main transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search (Ctrl+K)</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-brand-bg transition-colors cursor-pointer"
            title={isDark ? "Activate Light Mode" : "Activate Dark Mode"}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-brand-bg transition-colors cursor-pointer">
            <Bell className="h-5 w-5" />
          </button>

          {email ? (
            <>
              <button 
                onClick={handleLogOut}
                className="px-3.5 py-1.5 border border-card-border bg-card-bg hover:bg-brand-bg text-[11px] font-bold text-text-main rounded-lg cursor-pointer transition-all"
              >
                Sign Out
              </button>
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-brand-bg transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 border border-card-border bg-card-bg hover:bg-brand-bg text-[11px] font-bold text-text-main rounded-lg cursor-pointer transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary/90 text-[11px] font-bold text-white rounded-lg cursor-pointer transition-all shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Trigger */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-text-muted hover:text-text-main hover:bg-brand-bg rounded-xl cursor-pointer"
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </button>

          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2 text-text-muted hover:text-text-main hover:bg-brand-bg rounded-xl cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-muted hover:text-text-main hover:bg-brand-bg rounded-xl focus:outline-none transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mega Menu Portal */}
        {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-card-border bg-card-bg px-4 py-6 space-y-6 text-sm font-semibold text-text-muted animate-in slide-in-from-top duration-200">
          
          {/* Main Links */}
          <div className="flex flex-col space-y-4">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/vehicles" className="hover:text-brand-primary transition-colors">Browse Vehicles</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/tours" className="hover:text-brand-primary transition-colors">Browse Tours</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/dashboard" className="hover:text-brand-primary transition-colors">Partner Dashboard</Link>
          </div>

          <div className="border-t border-card-border pt-4 flex flex-col gap-2.5">
            {email ? (
              <>
                <div className="flex items-center justify-between bg-brand-bg border border-card-border p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <User className="h-4.5 w-4.5 text-brand-primary" />
                    <span className="text-xs text-text-main font-mono truncate max-w-[150px]">{email}</span>
                  </div>
                  <span className="text-[9px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded font-extrabold capitalize">{role}</span>
                </div>
                <button
                  onClick={handleLogOut}
                  className="w-full py-2.5 bg-brand-danger/10 border border-brand-danger/20 hover:bg-brand-danger/20 text-brand-danger font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/auth/login"
                  className="w-full py-2.5 border border-card-border hover:bg-brand-bg text-text-main font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/auth/register"
                  className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-sm"
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

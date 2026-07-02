"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Car, Shield, Navigation, Compass, ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function DashboardHub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard");
      return;
    }
    const role = localStorage.getItem("user_role") || "customer";
    router.replace(`/dashboard/${role}`);
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-bg justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  const portals = [
    {
      role: "customer",
      title: "Customer Portal",
      desc: "Manage rides, self-drive vehicles, and tourism checkouts.",
      icon: User,
      color: "from-blue-600 to-indigo-600",
      link: "/dashboard/customer"
    },
    {
      role: "owner",
      title: "Fleet Owner Portal",
      desc: "Register vehicles, accept client rentals, and audit earnings.",
      icon: Car,
      color: "from-purple-600 to-indigo-600",
      link: "/dashboard/owner"
    },
    {
      role: "driver",
      title: "Driver Workspace",
      desc: "Navigate ride dispatches and verify completed route logs.",
      icon: Navigation,
      color: "from-blue-600 to-emerald-600",
      link: "/dashboard/driver"
    },
    {
      role: "operator",
      title: "Tour Operator Desk",
      desc: "Publish tour itineraries and track seating occupancy.",
      icon: Compass,
      color: "from-emerald-600 to-teal-600",
      link: "/dashboard/operator"
    },
    {
      role: "admin",
      title: "Operations Admin",
      desc: "Audit registrations, dispute listings, and check platform gateway health.",
      icon: Shield,
      color: "from-rose-600 to-red-650",
      link: "/dashboard/admin"
    }
  ];

  const selectPortal = (role: string, link: string) => {
    localStorage.setItem("user_role", role);
    // Dispatches storage event for navbar simulator sync
    window.dispatchEvent(new Event("storage"));
    router.push(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display font-extrabold text-4xl text-text-main tracking-tight sm:text-5xl">
            Select Your Workspace
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Pick a stakeholder role to enter your customized management panel. You can switch roles at any time using the Navbar simulator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.role}
                onClick={() => selectPortal(p.role, p.link)}
                className="group relative p-8 rounded-3xl border border-card-border bg-card-bg text-left hover:border-brand-primary/50 transition-all hover:shadow-md duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${p.color} flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-display font-bold text-xl text-text-main mb-2 group-hover:text-brand-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6 font-semibold">
                  {p.desc}
                </p>
                
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-primary group-hover:text-brand-primary/80 transition-colors">
                  Enter Portal <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

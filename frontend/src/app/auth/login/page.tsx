"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Identify role based on email pattern
    let resolvedRole = "customer";
    if (email.startsWith("admin")) {
      resolvedRole = "admin";
    } else if (email.startsWith("owner")) {
      resolvedRole = "owner";
    } else if (email.startsWith("driver")) {
      resolvedRole = "driver";
    } else if (email.startsWith("operator")) {
      resolvedRole = "operator";
    }

    // Determine status: Seeded credentials are ACTIVE, new custom registered partner applications are PENDING by default
    let resolvedStatus = "ACTIVE";
    
    // Check if there is an existing registered user session matching this email in localStorage
    const savedEmail = localStorage.getItem("user_email");
    const savedStatus = localStorage.getItem("user_status");
    
    if (savedEmail === email && savedStatus) {
      resolvedStatus = savedStatus;
    } else if (resolvedRole !== "customer" && resolvedRole !== "admin") {
      // Non-seeded new partner logins default to PENDING
      if (email !== "owner1@ridesphere.com" && email !== "driver1@ridesphere.com" && email !== "operator1@ridesphere.com") {
        resolvedStatus = "PENDING";
      }
    }

    // Save session variables
    localStorage.setItem("user_role", resolvedRole);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_status", resolvedStatus);
    if (!localStorage.getItem("user_name")) {
      localStorage.setItem("user_name", email.split("@")[0]);
    }

    setTimeout(() => {
      setIsSubmitting(false);

      if (resolvedStatus === "PENDING" || resolvedStatus === "REJECTED") {
        router.push("/auth/review");
      } else {
        router.push(`/dashboard/${resolvedRole}`);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-xs mt-1">Login to access your bookings, vehicles & packages</p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.513 0-6.386-2.873-6.386-6.386s2.873-6.386 6.386-6.386c1.688 0 3.12.59 4.256 1.68l3.245-3.245C19.167 2.185 15.993 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.84 0 10.966-4.184 10.966-11.24 0-.648-.057-1.306-.17-1.955H12.24z"/></svg> Google
            </button>
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GitHub
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="grow border-t border-slate-100"></div>
            <span className="shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Or login with</span>
            <div className="grow border-t border-slate-100"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                <input
                  type="email"
                  required
                  placeholder="customer1@ridesphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                <Link href="/auth/forgot-password" className="text-[10px] font-semibold text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                <input
                  type="password"
                  required
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Remember Me
              </label>
            </div>

            {errorMsg && (
              <div className="text-red-650 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <span>{isSubmitting ? "Authenticating..." : "Login to Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Seed Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-slate-850">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block text-center mb-3">
              Quick Autofill Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto sm:grid-cols-3">
              {[
                { label: "Customer", email: "customer1@ridesphere.com", pass: "password123" },
                { label: "Fleet Owner", email: "owner1@ridesphere.com", pass: "password123" },
                { label: "Driver", email: "driver1@ridesphere.com", pass: "password123" },
                { label: "Tour Operator", email: "operator1@ridesphere.com", pass: "password123" },
                { label: "System Admin", email: "admin1@ridesphere.com", pass: "password123" }
              ].map((cred, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.pass);
                  }}
                  className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all text-center cursor-pointer"
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-6 text-center text-xs font-semibold">
            <p className="text-slate-500">
              Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Register Now</Link>
            </p>
            <div className="flex justify-center gap-3 text-[10px] font-bold text-slate-400">
              <Link href="/admin/login" className="hover:text-blue-600 hover:underline">Admin Gateway</Link>
              <span>&bull;</span>
              <Link href="/super-admin/login" className="hover:text-blue-600 hover:underline">Super Admin Portal</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

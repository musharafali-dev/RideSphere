"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, User, MapPin, Globe, Check, Star } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("Lahore");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setErrorMsg("You must accept the Terms of Service.");
      return;
    }

    setIsSubmitting(true);

    // Save details to localStorage
    const fullName = `${firstName} ${lastName}`;
    localStorage.setItem("user_role", "customer");
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_name", fullName);
    localStorage.setItem("user_status", "ACTIVE");

    setTimeout(() => {
      setIsSubmitting(false);
      // Route to SMS verify OTP simulator
      router.push("/auth/verify");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Brand & Visual Highlights */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80" 
              alt="Travel Highway scenic view" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/60 to-slate-950/90 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1">
              Ride<span className="text-blue-500">Sphere</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6 my-auto">
            <h2 className="font-display font-extrabold text-3xl leading-tight">
              Unlock Premium Vehicles & Custom Tours in One Ecosystem.
            </h2>
            
            <div className="space-y-4">
              {[
                "Access 20+ luxury sports cars & local city rides",
                "Rent touring and offroad sports bikes instantly",
                "Book group tour packages with local guides",
                "Full driver and background verification checks"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Testimonial */}
          <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-slate-300 italic leading-relaxed">
              "RideSphere simplified our corporate tours. The vehicle catalog is pristine and verification credentials were fully approved in hours."
            </p>
            <span className="block text-[10px] font-bold text-white mt-2">— Sarah Shah, Operations Lead</span>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-7 bg-white flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            
            <div>
              <h1 className="font-display font-extrabold text-2xl text-slate-900">Create RideSphere Account</h1>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Already registered? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Sign in here</Link>
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      placeholder="Pakistan"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      placeholder="Lahore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1.5">
                <input 
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="terms" className="text-[10px] font-semibold text-slate-500 leading-tight">
                  I accept the <strong className="text-slate-800">Terms of Service</strong> and <strong className="text-slate-800">Privacy Shield Guarantees</strong>.
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-650 text-[10px] font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                {isSubmitting ? "Registering..." : "Register Account"}
              </button>

            </form>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-slate-100"></div>
              <span className="shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Or register with</span>
              <div className="grow border-t border-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {}} className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.513 0-6.386-2.873-6.386-6.386s2.873-6.386 6.386-6.386c1.688 0 3.12.59 4.256 1.68l3.245-3.245C19.167 2.185 15.993 1 12.24 1 5.922 1 12.24 5.922 1 12.24s4.922 11.24 11.24 11.24c5.84 0 10.966-4.184 10.966-11.24 0-.648-.057-1.306-.17-1.955H12.24z"/></svg> Google
              </button>
              <button onClick={() => {}} className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GitHub
              </button>
            </div>

            <div className="pt-4 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block">Register stakeholder profiles:</span>
              <div className="flex justify-center gap-3 mt-2 text-[10px] font-bold text-blue-600">
                <Link href="/auth/owner/register" className="hover:underline">Fleet Owner</Link>
                <span>&bull;</span>
                <Link href="/auth/driver/register" className="hover:underline">Chauffeur Driver</Link>
                <span>&bull;</span>
                <Link href="/auth/operator/register" className="hover:underline">Tour Operator</Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

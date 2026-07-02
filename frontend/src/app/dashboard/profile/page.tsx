"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Save, Check } from "lucide-react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Jane Doe");
  const [email, setEmail] = useState("customer1@ridesphere.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [address, setAddress] = useState("12 Main Boulevard, Gulberg III, Lahore");
  const [emergencyName, setEmergencyName] = useState("John Doe");
  const [emergencyPhone, setEmergencyPhone] = useState("+92 300 7654321");
  const [savedCards, setSavedCards] = useState([
    { brand: "Visa", last4: "4242", exp: "12/28" },
    { brand: "Mastercard", last4: "8899", exp: "05/27" }
  ]);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("user_name") || "Jane Doe";
    const savedEmail = localStorage.getItem("user_email") || "customer1@ridesphere.com";
    const savedPhone = localStorage.getItem("user_phone") || "+92 300 1234567";
    setFullName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_name", fullName);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-card-border pb-6 mb-10">
          <h1 className="font-display font-bold text-3xl text-text-main">My Profile</h1>
          <p className="text-xs text-text-muted mt-1 font-semibold">Configure your personal credentials, addresses, and emergency security contacts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main profile form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
              <h2 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
                <User className="h-5 w-5 text-brand-primary" /> Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Permanent Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4.5 w-4.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 pl-10 pr-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="border-t border-card-border pt-6">
                <h3 className="font-display font-bold text-md text-text-main flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-brand-primary" /> Emergency Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Contact Phone</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-2.5 px-4 focus:border-brand-primary focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-card-border pt-6">
                {saveSuccess ? (
                  <span className="text-brand-success text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="h-4 w-4" /> Credentials Saved Successfully!
                  </span>
                ) : (
                  <span className="text-text-muted text-xs font-semibold">Verify all inputs prior to saving.</span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Save className="h-4 w-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Cards sidebar */}
          <div className="space-y-6">
            <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-4">
              <h3 className="font-display font-bold text-md text-text-main flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-primary" /> Saved Payment Cards
              </h3>

              <div className="space-y-3 pt-2">
                {savedCards.map((card, idx) => (
                  <div key={idx} className="border border-card-border rounded-2xl p-4 flex justify-between items-center bg-brand-bg/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-brand-primary text-white rounded flex items-center justify-center font-bold text-[8px] tracking-wider">
                        {card.brand.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-main">•••• •••• •••• {card.last4}</span>
                        <span className="text-[9px] text-text-muted block font-semibold">Expires {card.exp}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSavedCards(prev => prev.filter((_, i) => i !== idx))}
                      className="text-[10px] text-brand-danger hover:underline cursor-pointer bg-transparent border-none font-extrabold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => alert("Add Card flow initiated")}
                className="w-full py-2.5 border border-dashed border-card-border hover:bg-brand-bg text-[11px] font-bold rounded-xl text-text-muted transition-all cursor-pointer"
              >
                + Add New Card
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Calendar, CreditCard, Star, Plus, CheckCircle2,
  Settings, HelpCircle, ArrowUpRight, Navigation
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  type: string;
  vehicle: string;
  date: string;
  price: number;
  status: "active" | "completed" | "upcoming";
}

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "deposit" | "payment" | "refund";
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [balance, setBalance] = useState(1200.0);
  const [spending] = useState(450.0);
  const [rewards] = useState(250);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Deposit modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Active ride simulator state
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "searching" | "matched" | "enroute" | "completed">("idle");
  const [simulationStep, setSimulationStep] = useState(0);
  const [simText, setSimText] = useState("");

  // Support inputs
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  useEffect(() => {
    // Auth & RBAC guard check
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    if (!email) {
      router.replace("/auth/login?redirect=/dashboard/customer");
      return;
    }
    
    if (role !== "customer") {
      router.replace(`/dashboard/${role || "customer"}`);
      return;
    }
    
    // Load and sync wallet balance
    const savedBalance = localStorage.getItem("wallet_balance");
    if (savedBalance) {
      setBalance(Number(savedBalance));
    } else {
      localStorage.setItem("wallet_balance", "1200");
      setBalance(1200.0);
    }

    const syncWallet = () => {
      const b = localStorage.getItem("wallet_balance");
      if (b) setBalance(Number(b));
    };
    window.addEventListener("storage", syncWallet);
    
    setLoading(false);

    setBookings([
      { id: "BK-9901", type: "Car Rental", vehicle: "Porsche 911 Carrera", date: "July 12 - July 15", price: 1350, status: "upcoming" },
      { id: "BK-8802", type: "Chauffeur Ride", vehicle: "Tesla Model 3", date: "June 28, 2026", price: 120, status: "completed" },
      { id: "BK-7703", type: "Tour Package", vehicle: "Hunza Valley Adventure", date: "May 20 - May 27", price: 399, status: "completed" }
    ]);

    setTransactions([
      { id: "TX-109", title: "Booked Porsche 911 (Card)", date: "Today 12:45 PM", amount: -1350.00, type: "payment" },
      { id: "TX-108", title: "Wallet Refund (Saiful Muluk)", date: "June 20, 2026", amount: 200.00, type: "refund" },
      { id: "TX-107", title: "Standard Deposit via Visa", date: "June 15, 2026", amount: 500.00, type: "deposit" }
    ]);

    return () => {
      window.removeEventListener("storage", syncWallet);
    };
  }, [router]);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketSubject("");
    setTicketDesc("");
    setTimeout(() => setTicketSent(false), 3000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    const nextBalance = balance + amt;
    setBalance(nextBalance);
    localStorage.setItem("wallet_balance", String(nextBalance));
    
    // Dispatch event to sync other pages
    window.dispatchEvent(new Event("storage"));

    setTransactions(prev => [
      {
        id: `TX-${Math.floor(Math.random() * 900) + 100}`,
        title: "Wallet Deposit (Visa/Mastercard)",
        date: "Just now",
        amount: amt,
        type: "deposit"
      },
      ...prev
    ]);

    setDepositSuccess(true);
    setDepositAmount("");
    setCardNumber("");
    setExpiry("");
    setCvv("");

    setTimeout(() => {
      setDepositSuccess(false);
      setShowDepositModal(false);
    }, 1500);
  };

  // Ride dispatcher simulator trigger
  const runRideSimulation = () => {
    setDispatchStatus("searching");
    setSimulationStep(0);
    setSimText("Broadcasting coordinates to nearby drivers...");
    
    // Step 1: Matched
    setTimeout(() => {
      setDispatchStatus("matched");
      setSimulationStep(33);
      setSimText("Matched! Driver Ahmed (Tesla Model Y) is heading your way.");
    }, 2500);

    // Step 2: En Route
    setTimeout(() => {
      setDispatchStatus("enroute");
      setSimulationStep(66);
      setSimText("Passenger picked up. En route to destination...");
    }, 5500);

    // Step 3: Completed
    setTimeout(() => {
      setDispatchStatus("completed");
      setSimulationStep(100);
      setSimText("Arrived safely at destination! Fare of $25 deducted.");
      setBalance(prev => {
        const next = prev - 25;
        localStorage.setItem("wallet_balance", String(next));
        return next;
      });
      window.dispatchEvent(new Event("storage"));
    }, 8500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-bg justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Profile Card Header */}
        <div className="bg-card-bg border border-card-border rounded-3xl p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-bold text-2xl font-display shadow-sm">
              JD
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-text-main">Jane Doe</h1>
              <p className="text-text-muted text-xs mt-0.5 font-semibold">Verified Customer &bull; {rewards} Loyalty Points</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Money
            </button>
            <Link
              href="/vehicles"
              className="px-5 py-3 border border-card-border bg-card-bg hover:bg-brand-bg text-text-main text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              Book A Ride
            </Link>
          </div>
        </div>

        {/* Dynamic Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-3xl font-extrabold text-brand-primary">${balance.toFixed(2)}</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Month Spending</span>
            <span className="text-3xl font-extrabold text-text-main">${spending.toFixed(2)}</span>
          </div>

          <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Simulated Rewards</span>
            <span className="text-3xl font-extrabold text-brand-accent flex items-center gap-1">
              <Star className="h-6 w-6 fill-brand-accent" /> {rewards} pts
            </span>
          </div>
        </div>

        {/* Workspace: Sidebar + Center Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 flex flex-col space-y-1">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "bookings", label: "My Bookings", icon: Calendar },
              { id: "payments", label: "Payments Logs", icon: CreditCard },
              { id: "support", label: "Help & Support", icon: HelpCircle }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-xs"
                      : "text-text-muted hover:bg-brand-bg hover:text-text-main"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Center Workspace */}
          <div className="lg:col-span-3">
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* On-Demand Matchmaker Simulator */}
                <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-main">Simulated On-Demand Matchmaker</h3>
                    <p className="text-xs text-text-muted mt-0.5">Test real-time coordinates dispatching and driver matching.</p>
                  </div>

                  {dispatchStatus === "idle" ? (
                    <button
                      onClick={runRideSimulation}
                      className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <Navigation className="h-4 w-4" /> Request Ride Matches
                    </button>
                  ) : (
                    <div className="space-y-4 bg-brand-bg/50 border border-card-border p-5 rounded-2xl animate-in fade-in duration-200">
                      <div className="flex justify-between text-xs font-bold text-text-main">
                        <span className="capitalize">Status: {dispatchStatus}</span>
                        <span>{simulationStep}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-card-border h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${simulationStep}%` }}
                        ></div>
                      </div>

                      <p className="text-xs text-text-muted font-semibold flex items-center gap-1.5 animate-pulse">
                        &bull; {simText}
                      </p>

                      {dispatchStatus === "completed" && (
                        <button
                          onClick={() => setDispatchStatus("idle")}
                          className="mt-2 px-3 py-1.5 bg-card-bg border border-card-border text-text-main hover:bg-brand-bg text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Reset Simulator
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Information */}
                <div className="bg-card-bg border border-card-border p-6 rounded-3xl shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-lg text-text-main">Security & KYC Profiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-text-main">
                    <div className="bg-brand-bg/40 border border-card-border p-4 rounded-2xl">
                      <span className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Email Address</span>
                      <span>customer1@ridesphere.com</span>
                    </div>
                    <div className="bg-brand-bg/40 border border-card-border p-4 rounded-2xl">
                      <span className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Hardware Auth Check</span>
                      <span className="text-brand-success flex items-center gap-1">✓ FIDO2 biometric key verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MY BOOKINGS PANEL */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-text-main">Active & Past Bookings</h3>
                
                <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-text-muted font-bold bg-brand-bg/50">
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Item</th>
                        <th className="p-4">Schedule</th>
                        <th className="p-4">Cost</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border text-text-main font-semibold">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-brand-bg/20">
                          <td className="p-4 font-mono font-bold">{b.id}</td>
                          <td className="p-4 text-text-muted">{b.type}</td>
                          <td className="p-4 font-bold">{b.vehicle}</td>
                          <td className="p-4 font-medium text-text-muted">{b.date}</td>
                          <td className="p-4 font-bold text-brand-primary">${b.price}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              b.status === "active"
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                : b.status === "completed"
                                ? "bg-brand-success/15 border-brand-success/30 text-brand-success"
                                : "bg-brand-accent/15 border-brand-accent/30 text-brand-accent"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAYMENTS LOGS PANEL */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-text-main">Wallet Transactions History</h3>
                
                <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-text-muted font-bold bg-brand-bg/50">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Type</th>
                        <th className="p-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border text-text-main font-semibold">
                      {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-brand-bg/20">
                          <td className="p-4 font-mono font-bold">{t.id}</td>
                          <td className="p-4 font-bold">{t.title}</td>
                          <td className="p-4 text-text-muted">{t.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize border ${
                              t.type === "deposit"
                                ? "bg-brand-success/15 border-brand-success/30 text-brand-success"
                                : t.type === "refund"
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                : "bg-brand-danger/10 border-brand-danger/20 text-brand-danger"
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-extrabold ${t.amount > 0 ? "text-brand-success" : "text-brand-danger"}`}>
                            {t.amount > 0 ? "+" : ""}${t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT PANEL */}
            {activeTab === "support" && (
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-text-main">Submit Support Dispute Ticket</h3>
                  <p className="text-xs text-text-muted mt-0.5">Need help with a booking dispute or payment mismatch? Contact Admin center.</p>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Dispute Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Double charging for Booking BK-9901"
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Dispute Explanation</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="Explain your case clearly..."
                      className="w-full bg-brand-bg border border-card-border text-text-main rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    ></textarea>
                  </div>

                  {ticketSent && (
                    <div className="p-3.5 bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs rounded-xl flex items-center gap-2 font-bold animate-in fade-in duration-200">
                      <CheckCircle2 className="h-4.5 w-4.5" /> Ticket filed! Compliance Admin will contact you soon.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-[#020617]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card-bg border border-card-border rounded-3xl max-w-md w-full p-8 shadow-md relative space-y-6 text-text-main animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display font-bold text-xl text-text-main">Top Up Wallet</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">Deposit simulated funds via sandbox payment gateway. Added funds are instantly synced.</p>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">Deposit Amount ($)</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="10000"
                  placeholder="e.g. 500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-brand-bg border border-card-border rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-display">Mock Card Credentials</span>
                
                <input
                  type="text"
                  required
                  placeholder="Cardholder Full Name"
                  className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-primary font-semibold"
                />

                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="Card Number (16 Digits)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-primary font-semibold"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-primary font-semibold"
                  />
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-brand-bg border border-card-border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-primary font-semibold font-mono"
                  />
                </div>
              </div>

              {depositSuccess && (
                <div className="p-3 bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs rounded-xl flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Deposit complete!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
              >
                Pay & Add to Wallet
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// X icon for modal close
function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

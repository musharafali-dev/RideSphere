"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Shield, CreditCard, Wallet, Landmark, CheckCircle, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

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

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [days, setDays] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Payment Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [walletBalance, setWalletBalance] = useState(500);

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

  useEffect(() => {
    // Load wallet balance
    const savedBalance = localStorage.getItem("wallet_balance");
    if (savedBalance) {
      setWalletBalance(Number(savedBalance));
    } else {
      localStorage.setItem("wallet_balance", "500");
    }

    fetch(`http://localhost:8000/api/v1/vehicles/${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setVehicle(data);
        } else {
          const found = fallbackVehicles.find(v => v.id === vehicleId);
          setVehicle(found || fallbackVehicles[0]);
        }
      })
      .catch(() => {
        const found = fallbackVehicles.find(v => v.id === vehicleId);
        setVehicle(found || fallbackVehicles[0]);
      });
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-slate-500 text-xs font-semibold">Loading details...</div>
      </div>
    );
  }

  const totalCost = vehicle.price_per_day * days;

  const handleBooking = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Validate inputs based on payment method
    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        setErrorMsg("Please enter a valid 16-digit card number.");
        setIsSubmitting(false);
        return;
      }
      if (!cardExpiry || !cardExpiry.includes("/")) {
        setErrorMsg("Please enter expiry in MM/YY format.");
        setIsSubmitting(false);
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setErrorMsg("Please enter a valid 3-digit CVV.");
        setIsSubmitting(false);
        return;
      }
      if (!cardName) {
        setErrorMsg("Cardholder Name is required.");
        setIsSubmitting(false);
        return;
      }
    } else {
      // Wallet validation
      if (walletBalance < totalCost) {
        setErrorMsg("Insufficient wallet balance. Please use a credit card or add funds.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Deduct wallet balance if chosen
      if (paymentMethod === "wallet") {
        const nextBalance = walletBalance - totalCost;
        setWalletBalance(nextBalance);
        localStorage.setItem("wallet_balance", String(nextBalance));
      }

      // Store in pending_bookings array for admin approval
      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        client: localStorage.getItem("user_email") || "customer1@ridesphere.com",
        vehicle: `${vehicle.make} ${vehicle.model}`,
        price: totalCost,
        days: days,
        paymentMethod: paymentMethod,
        status: "pending",
        timestamp: new Date().toLocaleDateString()
      };

      const existingRaw = localStorage.getItem("pending_bookings");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(newBooking);
      localStorage.setItem("pending_bookings", JSON.stringify(existing));

      // Successfully processed
      setSuccess(true);
    } catch (err) {
      setErrorMsg("An error occurred during booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link 
          href="/vehicles" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {success ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 text-xs mb-8">
              Your rental of the <strong>{vehicle.make} {vehicle.model}</strong> has been secured for {days} days. 
              Please proceed to the admin panel or your dashboard to review approvals.
            </p>
            <button
              onClick={() => router.push("/dashboard/customer")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Details Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-white">
                <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-96 object-cover" />
              </div>

              <div>
                <h1 className="font-display font-bold text-3xl text-slate-900">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-xs text-slate-450 capitalize mt-2 font-semibold">
                  {vehicle.category.replace("_", " ")} &bull; {vehicle.year}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-slate-100 py-6">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Seats</span>
                  <span className="font-bold text-slate-800 text-xs">{vehicle.seats} Seats</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Transmission</span>
                  <span className="font-bold text-slate-800 text-xs capitalize">{vehicle.transmission}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fuel Type</span>
                  <span className="font-bold text-slate-800 text-xs capitalize">{vehicle.fuel_type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Daily Price</span>
                  <span className="font-bold text-slate-800 text-xs">${vehicle.price_per_day}/day</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                <h3 className="font-display font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                  <Shield className="h-4.5 w-4.5 text-blue-600" /> Rental Conditions & Guarantees
                </h3>
                <ul className="space-y-2 text-xs text-slate-500 font-medium">
                  <li className="flex items-center gap-2">✓ Valid Driving License required upon pickup</li>
                  <li className="flex items-center gap-2">✓ Refundable security deposit of $150</li>
                  <li className="flex items-center gap-2">✓ 250 free kilometers per day</li>
                </ul>
              </div>
            </div>

            {/* Cost Calculator / Checkout Card */}
            <div>
              <div className="bg-white border border-slate-100 rounded-3xl p-8 sticky top-24 shadow-md space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-800">Booking Summary</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setPaymentMethod("wallet"); setErrorMsg(""); }}
                        className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "wallet"
                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <Wallet className="h-4 w-4" /> Wallet
                      </button>
                      <button
                        onClick={() => { setPaymentMethod("card"); setErrorMsg(""); }}
                        className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "card"
                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" /> Card
                      </button>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC DETAILS DEPENDING ON METHOD */}
                {paymentMethod === "card" ? (
                  <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl animate-in fade-in duration-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Credit/Debit Card Details</span>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-semibold text-slate-700 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="text-blue-600">${walletBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Deduction</span>
                      <span className="text-red-500">-${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Remaining</span>
                      <span className="text-slate-800">${(walletBalance - totalCost).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Daily Rate</span>
                    <span>${vehicle.price_per_day}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Days</span>
                    <span>{days}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span>${totalCost}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-xs text-red-650 bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-1.5">
                    <Info className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-colors"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Pay"}
                </button>

                <p className="text-[10px] text-center text-slate-400 leading-relaxed font-semibold">
                  By clicking Confirm & Pay, you agree to our Rental Agreement and Policies.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

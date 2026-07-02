"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Search, Shield, Star, Heart, MapPin, 
  Clock, Award, Calendar, ChevronRight, HelpCircle, Check, ArrowRight
} from "lucide-react";

interface Vehicle {
  id: string;
  category: string;
  make: string;
  model: string;
  price_per_day: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  image_url: string;
  rating?: number;
  reviews_count?: number;
  location?: string;
  owner?: string;
}

const fNameForOwner = (idx: number) => {
  const names = ["John Fleet", "Elite Rentals", "Khan Chauffeurs", "Adventure Hub", "Drive Comfort"];
  return names[idx % names.length];
};

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeSearchTab, setActiveSearchTab] = useState("cars");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Search inputs
  const [pickupLoc, setPickupLoc] = useState("");
  const [dropoffLoc, setDropoffLoc] = useState("");
  const [pickupDate, setPickupDate] = useState("20 May 2026");
  const [returnDate, setReturnDate] = useState("22 May 2026");

  // FAQ states
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const categories = [
    { name: "Economy Cars", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=car_rental" },
    { name: "Luxury Cars", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=luxury" },
    { name: "SUVs", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=car_rental" },
    { name: "Sports Cars", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=luxury" },
    { name: "City Bikes", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=bike_rental" },
    { name: "Sports Bikes", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=bike_rental" },
    { name: "Touring Bikes", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=bike_rental" },
    { name: "Buses", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=bus_coaster" },
    { name: "Coasters", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80", link: "/vehicles?category=bus_coaster" },
    { name: "Tours", image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=300&q=80", link: "/tours" }
  ];

  const tours = [
    {
      id: "hunza",
      title: "Hunza Valley Adventure",
      duration: "7 Days",
      seats: "29 Seats Available",
      price: 399,
      rating: 4.9,
      reviews: 140,
      image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
      itinerary: "Karimabad, Attabad Lake, Khunjerab Pass"
    },
    {
      id: "skardu",
      title: "Skardu Expedition",
      duration: "5 Days",
      seats: "15 Seats Available",
      price: 450,
      rating: 4.8,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1588096344356-9b6d80c059c2?auto=format&fit=crop&w=600&q=80",
      itinerary: "Deosai Plains, Shigar Fort, Shangrila Lake"
    },
    {
      id: "meadows",
      title: "Fairy Meadows Tour",
      duration: "4 Days",
      seats: "10 Seats Available",
      price: 299,
      rating: 5.0,
      reviews: 75,
      image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
      itinerary: "Raikot Bridge, Nanga Parbat Base Camp"
    }
  ];

  const testimonials = [
    {
      quote: "Booking the Lexus LX600 for our corporate team event was incredibly smooth. Premium service throughout.",
      author: "Haris Mehmood",
      role: "Operations Director",
      rating: 5
    },
    {
      quote: "The Hunza Valley package was breathtaking. Everything from transport to tour guide was handled to perfection.",
      author: "Amna Qureshi",
      role: "Adventure Traveler",
      rating: 5
    }
  ];

  const faqs = [
    {
      q: "How do self-drive car rentals work on RideSphere?",
      a: "Simply browse our fleet under 'Car Rental', choose your dates, and book. You can pick up the vehicle at the verified owner's hub or request premium door delivery."
    },
    {
      q: "Are the tours and guides verified?",
      a: "Yes. All tour guides and operators go through rigorous background checks and document verification processes before their packages are listed."
    },
    {
      q: "Can I cancel or reschedule my booking?",
      a: "Absolutely. Free cancellation is supported for most vehicles up to 24 hours prior to checkout. Check specific booking policies for details."
    }
  ];

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Add default location, ratings for seed vehicles
          const decorated = data.map((v: any, index: number) => ({
            ...v,
            rating: 4.5 + (index % 6) * 0.1,
            reviews_count: 15 + (index * 7) % 110,
            location: index % 2 === 0 ? "Lahore, PK" : "Islamabad, PK",
            owner: fNameForOwner(index)
          }));
          setVehicles(decorated.slice(0, 6)); // Display first 6
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow">
        
        {/* Hero Section */}
        <section className="relative h-[650px] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80" 
              alt="Premium Porsche Highway Ride" 
              className="w-full h-full object-cover brightness-40"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
              Your Journey, Our Priority
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight">
              Rent. Ride. Explore. <br />
              <span className="text-blue-500">Anywhere, Anytime.</span>
            </h1>
            <p className="text-slate-200 max-w-xl mx-auto text-sm sm:text-base font-medium">
              Book cars, bikes, buses, and customized tours with trusted providers at the best prices.
            </p>

            {/* Overlaid Search Widget */}
            <div className="max-w-4xl mx-auto bg-card-bg rounded-3xl shadow-2xl p-4 mt-10 text-left border border-card-border">
              {/* Category tabs */}
              <div className="flex border-b border-card-border pb-3 mb-4 gap-2 overflow-x-auto">
                {[
                  { id: "cars", label: "Cars" },
                  { id: "bikes", label: "Bikes" },
                  { id: "buses", label: "Buses" },
                  { id: "tours", label: "Tours" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSearchTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      activeSearchTab === tab.id
                        ? "bg-brand-primary text-white"
                        : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="border border-card-border rounded-2xl p-3 flex flex-col justify-center bg-brand-bg/20">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pick-up Location</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4 text-brand-primary shrink-0" />
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      className="bg-transparent border-none text-text-main font-semibold placeholder-text-muted text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border border-card-border rounded-2xl p-3 flex flex-col justify-center bg-brand-bg/20">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Drop-off Location</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4 text-brand-primary shrink-0" />
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={dropoffLoc}
                      onChange={(e) => setDropoffLoc(e.target.value)}
                      className="bg-transparent border-none text-text-main font-semibold placeholder-text-muted text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border border-card-border rounded-2xl p-3 flex flex-col justify-center bg-brand-bg/20">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pick-up Date</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar className="h-4 w-4 text-brand-primary shrink-0" />
                    <input
                      type="text"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="bg-transparent border-none text-text-main font-semibold text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="border border-card-border rounded-2xl p-3 flex flex-col justify-center grow bg-brand-bg/20">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Return Date</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="h-4 w-4 text-brand-primary shrink-0" />
                      <input
                        type="text"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="bg-transparent border-none text-text-main font-semibold text-xs w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <Link 
                    href="/vehicles"
                    className="h-12 w-12 bg-brand-primary hover:bg-brand-primary/90 rounded-2xl flex items-center justify-center text-white shadow-xs transition-colors shrink-0"
                  >
                    <Search className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Guarantees bar */}
              <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-card-border text-[10px] sm:text-xs text-text-muted font-semibold">
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> Best Price Guarantee</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> 24/7 Customer Support</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> Free Cancellation</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> Trusted & Verified</span>
              </div>
            </div>

          </div>
        </section>

        {/* Explore by Category */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl text-text-main">Explore by Category</h2>
              <p className="text-xs text-text-muted mt-1 font-semibold">Select from our wide range of premium vehicles and structured packages.</p>
            </div>
            <Link href="/vehicles" className="text-brand-primary text-xs font-bold hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none">
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={cat.link}
                className="bg-card-bg/75 backdrop-blur-md border border-card-border rounded-3xl overflow-hidden shrink-0 w-44 sm:w-48 h-64 shadow-xs hover:shadow-md hover:border-brand-primary/45 transition-all duration-300 flex flex-col group relative"
              >
                {/* Image Container */}
                <div className="w-full h-36 overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  />
                </div>
                
                {/* Content Container */}
                <div className="p-4 flex flex-col justify-between grow z-20">
                  <div>
                    <h3 className="font-display font-bold text-sm text-text-main group-hover:text-brand-primary transition-colors duration-300 line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-text-muted mt-1 font-semibold">Explore premium fleet</p>
                  </div>
                  
                  <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Vehicles Grid */}
        <section className="py-16 bg-brand-bg border-y border-card-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display font-bold text-2xl text-text-main">Featured Vehicles</h2>
                <p className="text-xs text-text-muted mt-1 font-semibold">Verify premium specifications, inspect models, and book instantly.</p>
              </div>
              <Link href="/vehicles" className="text-brand-primary text-xs font-bold hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((v) => (
                <div 
                  key={v.id} 
                  className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={v.image_url} 
                      alt={`${v.make} ${v.model}`} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    />
                    <button 
                      onClick={() => toggleFavorite(v.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-card-bg/85 backdrop-blur-md text-text-muted hover:text-rose-500 shadow-xs cursor-pointer transition-colors"
                    >
                      <Heart 
                        className={`h-4.5 w-4.5 ${favorites.includes(v.id) ? "fill-rose-500 text-rose-500" : ""}`} 
                      />
                    </button>
                    <span className="absolute bottom-4 left-4 text-[10px] font-bold bg-brand-primary text-white px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      Featured
                    </span>
                  </div>

                  <div className="p-6 grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-lg text-text-main group-hover:text-brand-primary transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> {v.rating?.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-4">
                        Owner: {v.owner} &bull; {v.location}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-text-muted border-t border-card-border pt-4 mb-4">
                        <div>
                          <span className="block text-[9px] font-bold text-text-muted uppercase">Seats</span>
                          <span className="font-semibold text-text-main">{v.seats} Seats</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-text-muted uppercase">Transmission</span>
                          <span className="font-semibold text-text-main capitalize">{v.transmission}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-text-muted uppercase">Fuel Type</span>
                          <span className="font-semibold text-text-main capitalize">{v.fuel_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xl font-bold text-text-main">${v.price_per_day}</span>
                        <span className="text-xs text-text-muted">/day</span>
                      </div>
                      <Link 
                        href={`/vehicles/${v.id}`}
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold rounded-xl transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Tourism Packages */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display font-bold text-2xl text-text-main">Customized Tourism Packages</h2>
              <p className="text-xs text-text-muted mt-1 font-semibold">Curated road adventures, local guides, and comfortable bus transfers.</p>
            </div>
            <Link href="/tours" className="text-brand-primary text-xs font-bold hover:underline flex items-center gap-0.5">
              Explore All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-card-bg/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-text-main shadow-xs">
                    {t.duration}
                  </div>
                </div>

                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-bold text-lg text-text-main group-hover:text-brand-primary transition-colors leading-tight">
                        {t.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text-muted mb-3 font-semibold">{t.itinerary}</p>
                    <div className="flex items-center gap-1 mb-4 text-xs font-medium text-text-muted">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{t.rating}</span> ({t.reviews} reviews)
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div>
                      <span className="text-xl font-bold text-slate-900">${t.price}</span>
                      <span className="text-xs text-slate-400"> /person</span>
                    </div>
                    <Link 
                      href={`/tours`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Book Tour
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center mb-16 space-y-3">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Premium Standard</span>
              <h2 className="font-display font-bold text-3xl">Why Choose RideSphere?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">We deliver high-end, secure mobility services matching international security and comfort protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Secure Payments", desc: "100% encrypted checkout processes and transparent invoices." },
                { title: "Verified Providers", desc: "Every owner, driver, and operator goes through compliance audit." },
                { title: "24/7 Support Desk", desc: "Our live support dispatch operations are awake 24/7." },
                { title: "Best Price Match", desc: "We match and deliver competitive hourly or monthly quotes." }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-850 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="font-display font-bold text-2xl text-slate-900">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.author}</h4>
                  <span className="text-[10px] text-slate-400 block">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-sm">
                  <button 
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full text-left p-5 font-semibold text-slate-800 text-xs sm:text-sm flex justify-between items-center cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle className={`h-4.5 w-4.5 text-blue-600 transition-transform ${faqOpen === idx ? "rotate-180" : ""}`} />
                  </button>
                  {faqOpen === idx && (
                    <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

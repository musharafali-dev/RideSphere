"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Settings, Shield, Bell, Globe, 
  Trash2, ToggleLeft, ToggleRight, Check, AlertTriangle 
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  
  // Toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en");

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Sync UI with current global theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkMode(savedTheme === "dark");
  }, []);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    const nextTheme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Broadcast theme update globally across tabs
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteAccount = () => {
    const conf = confirm("WARNING: Are you absolutely sure you want to permanently delete your RideSphere account? This action is irreversible.");
    if (conf) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-main transition-colors duration-200">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-card-border pb-6 mb-10">
          <h1 className="font-display font-bold text-3xl text-text-main">Account Settings</h1>
          <p className="text-xs text-text-muted mt-1 font-semibold">Configure your notification preferences, credentials security, and layout options.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Settings Tabs Sidebar */}
          <div className="space-y-1">
            {[
              { id: "account", label: "Account Options", icon: Settings },
              { id: "security", label: "Security & 2FA", icon: Shield },
              { id: "notifications", label: "Notifications Settings", icon: Bell },
              { id: "theme", label: "Theme & Language", icon: Globe }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
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

          {/* Main workspace */}
          <div className="lg:col-span-3">
            <div className="bg-card-bg border border-card-border p-8 rounded-3xl shadow-xs space-y-6">
              
              {/* ACCOUNT OPTIONS */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-main">Account Preferences</h2>
                    <p className="text-xs text-text-muted mt-1 font-semibold">Manage global system parameters.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-card-border pb-4">
                      <div>
                        <span className="text-xs font-bold text-text-main block">Simulate Offline Mode</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-semibold">Runs dashboard layouts with mock state data when APIs fail.</p>
                      </div>
                      <button onClick={() => {}} className="text-text-muted hover:text-text-main cursor-pointer">
                        <ToggleRight className="h-9 w-9 text-brand-primary" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-card-border pt-6">
                    <h3 className="text-xs font-bold text-brand-danger flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-4.5 w-4.5" /> Danger Zone
                    </h3>
                    <p className="text-[10px] text-text-muted mb-4 leading-relaxed font-semibold">
                      Deleting your profile removes wallet histories, saved cards, listings, and ongoing rentals permanently.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-5 py-2.5 bg-brand-danger/10 hover:bg-brand-danger/20 text-brand-danger border border-brand-danger/25 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Delete My Account
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY & 2FA */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-main">Security Policies</h2>
                    <p className="text-xs text-text-muted mt-1 font-semibold">Configure verification keys and passwords.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-card-border pb-4">
                      <div>
                        <span className="text-xs font-bold text-text-main block">Two-Factor Authentication (2FA)</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-semibold">Protects wallet funds with an OTP verification check on login.</p>
                      </div>
                      <button onClick={() => setTwoFactor(!twoFactor)} className="cursor-pointer">
                        {twoFactor ? (
                          <ToggleRight className="h-9 w-9 text-brand-primary" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-display">Update Password</span>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="bg-brand-bg border border-card-border text-text-main rounded-xl py-2 px-3 focus:outline-none focus:border-brand-primary text-xs font-medium"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="bg-brand-bg border border-card-border text-text-main rounded-xl py-2 px-3 focus:outline-none focus:border-brand-primary text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS SETTINGS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-main">Notification Alerts</h2>
                    <p className="text-xs text-text-muted mt-1 font-semibold">Configure where and when you receive ride notifications.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-card-border pb-4">
                      <div>
                        <span className="text-xs font-bold text-text-main block">Push Notifications</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-semibold">Receive updates for nearby vehicles and active rentals.</p>
                      </div>
                      <button onClick={() => setPushNotifs(!pushNotifs)} className="cursor-pointer">
                        {pushNotifs ? (
                          <ToggleRight className="h-9 w-9 text-brand-primary" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-center border-b border-card-border pb-4">
                      <div>
                        <span className="text-xs font-bold text-text-main block">Email Newsletters & Invoices</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-semibold">Receive receipt receipts and booking statements immediately via mail.</p>
                      </div>
                      <button onClick={() => setEmailNotifs(!emailNotifs)} className="cursor-pointer">
                        {emailNotifs ? (
                          <ToggleRight className="h-9 w-9 text-brand-primary" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* THEME & LANGUAGE */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-main">Theme & Language Settings</h2>
                    <p className="text-xs text-text-muted mt-1 font-semibold">Customize language preferences and visual styling.</p>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex justify-between items-center border-b border-card-border pb-4">
                      <div>
                        <span className="text-xs font-bold text-text-main block">Enable Dark Mode</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-semibold">Render layouts in dark colors.</p>
                      </div>
                      <button onClick={() => setDarkMode(!darkMode)} className="cursor-pointer">
                        {darkMode ? (
                          <ToggleRight className="h-9 w-9 text-brand-primary" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-display">System Language</label>
                        <select
                          value={lang}
                          onChange={(e) => setLang(e.target.value)}
                          className="w-full bg-brand-bg border border-card-border text-text-main text-xs font-semibold rounded-xl p-2.5 focus:outline-none cursor-pointer"
                        >
                          <option value="en">English (US)</option>
                          <option value="ur">Urdu (اردو)</option>
                          <option value="ar">Arabic (العربية)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions footer */}
              <div className="flex items-center justify-between border-t border-card-border pt-6">
                {saveSuccess ? (
                  <span className="text-brand-success text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="h-4 w-4" /> Preferences updated successfully!
                  </span>
                ) : (
                  <span className="text-text-muted text-xs font-semibold">Verify preferences prior to save.</span>
                )}
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  Save Settings
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

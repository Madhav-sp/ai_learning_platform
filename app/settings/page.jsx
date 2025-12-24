"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Bell,
  Zap,
  User,
  Shield,
  Palette,
  Globe,
  CreditCard,
} from "lucide-react";
import { useClerk, UserButton } from "@clerk/nextjs";
import WeatherWidget from "../components/WeatherWidget";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar activePage="/settings" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage="Settings" />

        <main className="flex-1 overflow-hidden flex">
          {/* SETTINGS SUB-NAV */}
          <aside className="w-64 border-r border-white/5 bg-[#0e0e10] p-6 flex flex-col gap-2">
            <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-4">
              Preference
            </h2>
            <TabButton
              id="general"
              label="General"
              icon={<User size={18} />}
              active={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              id="security"
              label="Security"
              icon={<Shield size={18} />}
              active={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              id="appearance"
              label="Appearance"
              icon={<Palette size={18} />}
              active={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              id="billing"
              label="Billing"
              icon={<CreditCard size={18} />}
              active={activeTab}
              onClick={setActiveTab}
            />
          </aside>

          {/* SETTINGS CONTENT */}
          <section className="flex-1 overflow-y-auto p-12 custom-scroll bg-[#0b0b0c]">
            <div className="max-w-2xl">
              {activeTab === "general" && <GeneralSettings />}
              {activeTab === "appearance" && <AppearanceSettings />}
              {activeTab === "security" && (
                <div className="text-gray-500">
                  Security settings managed via Clerk.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function GeneralSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">General Settings</h2>
        <p className="text-gray-500 text-sm">
          Manage your account details and language preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs uppercase font-bold text-gray-600">
            Display Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="bg-[#111113] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs uppercase font-bold text-gray-600">
            Primary Language
          </label>
          <select className="bg-[#111113] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white appearance-none">
            <option>English (US)</option>
            <option>Spanish</option>
            <option>Hindi</option>
          </select>
        </div>

        <button className="bg-orange-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
        <p className="text-gray-500 text-sm">
          Customize how TutorX looks on your screen.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-orange-500/50 bg-orange-500/5 cursor-pointer transition-all">
          <div className="w-full h-24 bg-[#0b0b0c] rounded-lg mb-3 border border-white/10 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#0e0e10] border-r border-white/5" />
            <div className="absolute top-2 left-6 right-2 h-2 bg-orange-500/20 rounded-full" />
          </div>
          <p className="text-sm font-bold text-orange-500 text-center">
            High Contrast (Dark)
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-[#111113] hover:border-white/20 cursor-pointer transition-all">
          <div className="w-full h-24 bg-[#1a1a1e] rounded-lg mb-3 border border-white/10 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#252529] border-r border-white/5" />
            <div className="absolute top-2 left-6 right-2 h-2 bg-gray-500/20 rounded-full" />
          </div>
          <p className="text-sm font-bold text-gray-500 text-center">
            Soft Onyx
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ id, label, icon, active, onClick }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-white/5 text-orange-400 font-semibold"
          : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

/* ================= SHARED LAYOUT COMPONENTS ================= */

function Sidebar({ activePage }) {
  const { signOut } = useClerk();
  const router = useRouter();
  const navItems = [
    { icon: Home, label: "Home", address: "/" },
    { icon: BookOpen, label: "Library", address: "/notebook" },
    { icon: BarChart3, label: "Analytics", address: "/analytics" },
    { icon: Target, label: "Goals", address: "/goals" },
    { icon: Settings, label: "Settings", address: "/settings" },
  ];

  return (
    <aside className="w-20 bg-[#0e0e10] border-r border-white/5 flex flex-col items-center py-8 justify-between">
      <div className="flex flex-col items-center gap-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.address)}
              className={`p-3 rounded-xl transition-colors ${
                activePage === item.address
                  ? "bg-white/10 text-orange-400"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={() => signOut({ redirectUrl: "/" })}
        className="p-3 text-gray-600 hover:text-red-400 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}

function TopBar({ currentPage }) {
  return (
    <header className="h-20 bg-[#0b0b0c] border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-medium tracking-wide text-gray-200 uppercase">
          Console <span className="text-gray-500">/ {currentPage}</span>
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-1">
          <WeatherWidget />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

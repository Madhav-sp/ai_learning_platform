"use client";

import React from "react";
import {
  Home,
  BookOpen,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Search,
  Bell,
  Zap,
  Play,
  Trophy,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import WeatherWidget from "../components/WeatherWidget";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <MainContent />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar() {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: BookOpen, label: "Library" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Target, label: "Goals" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-20 bg-[#0e0e10] border-r border-white/5 flex flex-col items-center py-8 justify-between">
      <div className="flex flex-col items-center gap-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <Zap className="w-5 h-5 text-black" />
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`p-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-white/10 text-orange-400"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </div>

      <button className="p-3 text-gray-600 hover:text-red-400 transition-colors">
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}

/* ================= TOP BAR ================= */

function TopBar() {
  return (
    <header className="h-20 bg-[#0b0b0c] border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-medium tracking-wide text-gray-200">
          Console <span className="text-gray-500">/ Dashboard</span>
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search commands…"
            className="bg-[#111113] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm w-64
            placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-400 hover:text-gray-200">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-1">
          <div className="flex items-center gap-2 text-sm text-gray-300">
          <WeatherWidget/>
          </div>
          <div className="w-7 h-7 rounded-full bg-orange-500 text-black flex items-center justify-center text-xs font-bold">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ================= MAIN CONTENT ================= */

function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* METRICS */}
        <section className="grid grid-cols-3 gap-6">
          {[
            { label: "Current Streak", value: "14", unit: "Days" },
            { label: "Focus Hours", value: "124.5", unit: "Hrs" },
            { label: "Completed", value: "12", unit: "Projects" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#111113] border border-white/5 rounded-2xl p-6"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {item.label}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-medium text-gray-100">
                  {item.value}
                </span>
                <span className="text-sm text-gray-500">{item.unit}</span>
              </div>
            </div>
          ))}
        </section>

        {/* MODULES */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6">
            Active Modules
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Neural Network Architecture", progress: 74 },
              { title: "Advanced Micro-Frontend Patterns", progress: 45 },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#111113] border border-white/5 rounded-3xl p-8 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex justify-between mb-10">
                  <h3 className="text-xl font-medium text-gray-100 max-w-[220px]">
                    {card.title}
                  </h3>
                  <button className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Completion</span>
                    <span className="text-gray-300">{card.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ================= RIGHT PANEL ================= */

function RightPanel() {
  return (
    <aside className="w-80 bg-[#0e0e10] border-l border-white/5 p-8 space-y-10">
      {/* ACTIVITY */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          Activity
        </h3>

        <div className="flex items-end gap-1 h-32">
          {[40, 70, 45, 90, 60, 30, 50].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === 3 ? "bg-orange-500" : "bg-white/10"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          Upcoming
        </h3>

        <div className="space-y-3">
          {[
            { label: "Performance Review", time: "14:00" },
            { label: "Algorithm Contest", time: "19:00" },
          ].map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-200">{e.label}</p>
                <p className="text-xs text-gray-500">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPGRADE */}
      <div className="p-6 rounded-3xl bg-[#111113] border border-orange-500/20">
        <p className="text-xs uppercase text-gray-400 mb-2">Pro Plan</p>
        <p className="text-lg font-semibold text-gray-100 mb-4">
          Unlock Cloud Compute
        </p>
        <button className="bg-orange-500 text-black px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
          Upgrade
        </button>
      </div>
    </aside>
  );
}

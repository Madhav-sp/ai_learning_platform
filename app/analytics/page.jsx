"use client";

import React, { useEffect, useState } from "react";
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
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import WeatherWidget from "../components/WeatherWidget";

/* ================= PAGE ================= */

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-8 custom-scroll">
          <AnalyticsContent />
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar() {
  const { signOut } = useClerk();
  const router = useRouter();

  const navItems = [
    { icon: Home, address: "/" },
    { icon: BookOpen, address: "/notebook" },
    { icon: BarChart3, address: "/analytics" },
    { icon: Target, address: "/goals" },
    { icon: Settings, address: "/settings" },
  ];

  return (
    <aside className="w-20 bg-[#0e0e10] border-r border-white/5 flex flex-col items-center py-8 justify-between">
      <div className="flex flex-col gap-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-black" />
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.address)}
              className={`p-3 rounded-xl ${
                item.address === "/analytics"
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
        className="p-3 text-gray-600 hover:text-red-400"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}

/* ================= TOP BAR ================= */

function TopBar() {
  return (
    <header className="h-20 bg-[#0b0b0c] border-b border-white/5 flex items-center justify-between px-8">
      <h1 className="text-sm font-medium tracking-wide text-gray-200 uppercase">
        Console <span className="text-gray-500">/ Analytics</span>
      </h1>

      <div className="flex items-center gap-5">
        <Bell className="w-5 h-5 text-gray-400" />
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1">
          <WeatherWidget />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

/* ================= ANALYTICS CONTENT ================= */

function AnalyticsContent() {
  const { user } = useUser();

  const [stats, setStats] = useState({
    totalCourses: 0,
    completedTopics: 0,
    avgProgress: 0,
    activeGoals: 0,
  });

  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0));
  const [skillData, setSkillData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      const courses = await fetch("/api/course").then((r) => r.json());
      const goals = await fetch("/api/goals", {
        headers: { "x-user-id": user.id },
      }).then((r) => r.json());

      let completedTopicsCount = 0;
      let progressSum = 0;
      const skillMap = {};
      const dailyCounts = Array(7).fill(0);
      const today = new Date();

      for (const course of courses) {
        const progress = await fetch(
          `/api/progress?courseId=${course._id}`
        ).then((r) => r.json());

        const completed = progress?.completedTopics || [];
        const totalTopics = course.totalTopics || 0;

        completedTopicsCount += completed.length;

        if (totalTopics > 0) {
          progressSum += Math.round((completed.length / totalTopics) * 100);
        }

        const skill = course.category || "Other";
        skillMap[skill] = (skillMap[skill] || 0) + 1;

        completed.forEach((t) => {
          if (!t.completedAt) return;

          const diff =
            (today - new Date(t.completedAt)) / (1000 * 60 * 60 * 24);

          if (diff >= 0 && diff < 7) {
            dailyCounts[6 - Math.floor(diff)]++;
          }
        });
      }

      setStats({
        totalCourses: courses.length,
        completedTopics: completedTopicsCount,
        avgProgress:
          courses.length > 0 ? Math.round(progressSum / courses.length) : 0,
        activeGoals: goals.filter((g) => !g.completed).length,
      });

      setWeeklyData(dailyCounts);

      const totalSkills = Object.values(skillMap).reduce((a, b) => a + b, 0);
      setSkillData(
        Object.entries(skillMap).map(([label, count]) => ({
          label,
          value: Math.round((count / totalSkills) * 100),
        }))
      );
    };

    loadAnalytics();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <MetricCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<TrendingUp />}
        />
        <MetricCard
          title="Topics Completed"
          value={stats.completedTopics}
          icon={<CheckCircle2 />}
        />
        <MetricCard
          title="Avg Progress"
          value={`${stats.avgProgress}%`}
          icon={<Clock />}
        />
        <MetricCard
          title="Active Goals"
          value={stats.activeGoals}
          icon={<Target />}
        />
      </section>

      {/* GRAPHS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProgressChart data={weeklyData} />
        <SkillDistribution skills={skillData} />
      </section>

      {/* INSIGHT */}
      <section className="bg-[#111113] border border-white/5 rounded-3xl p-8">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          Insight
        </h3>
        <p className="text-gray-300">
          You are making consistent progress 🚀. Completing at least{" "}
          <span className="text-orange-400">2 goals per day</span> can improve
          your learning speed by <strong>35%</strong>.
        </p>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          {title}
        </p>
        <p className="text-3xl font-semibold text-gray-100">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function WeeklyProgressChart({ data }) {
  const max = Math.max(...data, 1);

  return (
    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6">
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-6">
        Weekly Progress
      </h3>

      <div className="flex items-end gap-3 h-40">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-orange-500 rounded-md transition-all"
              style={{ height: `${(v / max) * 100}%` }}
            />
            <span className="text-[10px] text-gray-500">
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillDistribution({ skills }) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6">
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-6">
        Skill Focus
      </h3>

      <div className="space-y-5">
        {skills.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-2">
              <span>{s.label}</span>
              <span>{s.value}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

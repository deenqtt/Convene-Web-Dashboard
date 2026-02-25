"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Search, Plus, Zap,
  Home, Calendar, Users, Settings, LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { meetingApi } from "@/lib/api";
import type { TodayDashboard, Meeting } from "@/types/meeting";
import TodayBanner from "@/components/TodayBanner";
import MeetingCard from "@/components/MeetingCard";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/lib/use-user";

const SIDEBAR_NAV = [
  { label: "Home",     href: "/",         Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "Contacts", href: "/contacts", Icon: Users },
  { label: "Settings", href: "/settings", Icon: Settings },
];

export default function HomePage() {
  const router = useRouter();
  const [today, setToday] = useState<TodayDashboard | null>(null);
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFab, setShowFab] = useState(false);

  const { user, logout } = useUser();
  const todayLabel = format(new Date(), "EEEE, MMM d").toUpperCase();

  const load = useCallback(async () => {
    try {
      const [t, u] = await Promise.all([
        meetingApi.getToday(),
        meetingApi.getUpcoming(7, 10),
      ]);
      setToday(t);
      setUpcoming(u);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleJoin = (meeting: Meeting) => {
    if (meeting.meetingLink) window.open(meeting.meetingLink, "_blank");
  };

  const filteredUpcoming = search
    ? upcoming.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : upcoming;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white pb-20 sm:pb-0">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden sm:flex fixed top-0 left-0 h-full w-56 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 flex-col p-5 gap-1 z-30">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Meeting</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">by deenqtt</p>
        </div>

        {SIDEBAR_NAV.map(({ label, href, Icon }) => {
          const isActive = href === "/";
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          );
        })}

        <div className="mt-auto space-y-2">
          <button
            onClick={() => router.push("/meetings/quick")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Zap className="w-4 h-4" /> Quick Add
          </button>
          <button
            onClick={() => router.push("/meetings/new")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Meeting
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="sm:ml-56 max-w-2xl mx-auto sm:mx-0 px-4 sm:px-8 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hello, {user?.username ?? "—"}</h2>
            <p className="text-xs text-gray-500 font-medium">{todayLabel}</p>
          </div>
          <button className="relative p-2 rounded-full bg-gray-100 dark:bg-[#1a2540] border border-gray-200 dark:border-white/10">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 mb-5">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <input
            className="flex-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none bg-transparent"
            placeholder="Search meetings, people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Today Banner */}
        {loading ? (
          <div className="bg-gray-200 dark:bg-[#1a2540] rounded-2xl h-36 animate-pulse mb-5" />
        ) : today ? (
          <div className="mb-5">
            <TodayBanner data={today} onViewSchedule={() => setSearch("")} />
          </div>
        ) : null}

        {/* Upcoming Meetings */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Meetings</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">See all</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-[#111827] rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : filteredUpcoming.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No upcoming meetings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUpcoming.map((m) => (
              <MeetingCard key={m.id} meeting={m} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </main>

      {/* ── FAB (mobile only) ── */}
      <div className="fixed bottom-20 right-4 sm:hidden z-40">
        {showFab && (
          <div className="flex flex-col items-end gap-2 mb-2">
            <button
              onClick={() => router.push("/meetings/new")}
              className="flex items-center gap-2 bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg"
            >
              <Plus className="w-4 h-4" /> New Meeting
            </button>
            <button
              onClick={() => router.push("/meetings/quick")}
              className="flex items-center gap-2 bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg"
            >
              <Zap className="w-4 h-4" /> Quick Add
            </button>
          </div>
        )}
        <button
          onClick={() => setShowFab((v) => !v)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className={`w-6 h-6 transition-transform duration-200 ${showFab ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <BottomNav active="/" />
    </div>
  );
}

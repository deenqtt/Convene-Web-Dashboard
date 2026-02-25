"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Video, MapPin,
  Calendar, Home, Users, Settings, Loader2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { meetingApi } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

const SIDEBAR_NAV = [
  { label: "Home",     href: "/",         Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "Contacts", href: "/contacts", Icon: Users },
  { label: "Settings", href: "/settings", Icon: Settings },
];

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_COLOR: Record<string, string> = {
  UPCOMING:  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  ONGOING:   "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  COMPLETED: "bg-gray-200/60 text-gray-500 dark:bg-white/5 dark:text-gray-400 border-transparent",
};

/** Parse meeting.date → "YYYY-MM-DD" (UTC date, no timezone shift) */
function toDateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10);
}

/** Group meetings by "YYYY-MM-DD" */
function groupByDate(meetings: Meeting[]): Record<string, Meeting[]> {
  return meetings.reduce<Record<string, Meeting[]>>((acc, m) => {
    const key = toDateKey(m.date);
    (acc[key] ??= []).push(m);
    return acc;
  }, {});
}

export default function CalendarPage() {
  const now   = new Date();
  const [year, setYear]       = useState(now.getFullYear());
  const [month, setMonth]     = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await meetingApi.list();
      setMeetings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = groupByDate(meetings);

  /** "YYYY-MM-DD" key untuk hari yang dipilih */
  const selectedKey = [
    year,
    String(month + 1).padStart(2, "0"),
    String(selected).padStart(2, "0"),
  ].join("-");

  const selectedMeetings = grouped[selectedKey] ?? [];

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelected(1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelected(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white pb-20 sm:pb-0">

      {/* Sidebar */}
      <aside className="hidden sm:flex fixed top-0 left-0 h-full w-56 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 flex-col p-5 gap-1 z-30">
        <div className="mb-6">
          <h1 className="text-lg font-bold">Meeting</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">by deenqtt</p>
        </div>
        {SIDEBAR_NAV.map(({ label, href, Icon }) => (
          <a key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              href === "/calendar"
                ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </a>
        ))}
      </aside>

      <main className="sm:ml-56 max-w-2xl mx-auto sm:mx-0 px-4 sm:px-8 py-6">

        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{MONTHS[month]} {year}</h2>
            {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          </div>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <p key={d} className="text-center text-xs text-gray-400 dark:text-gray-500 font-semibold py-1">{d}</p>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = [
              year,
              String(month + 1).padStart(2, "0"),
              String(day).padStart(2, "0"),
            ].join("-");
            const isToday    = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSelected = day === selected;
            const dayMeetings = grouped[key] ?? [];
            const hasOngoing  = dayMeetings.some((m) => m.status === "ONGOING");

            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isToday
                    ? "bg-blue-600/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                {day}
                {dayMeetings.length > 0 && !isSelected && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    hasOngoing ? "bg-green-500" : "bg-blue-500"
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Meetings for selected day */}
        <div>
          <h3 className="font-bold mb-3">
            {MONTHS[month]} {selected}
            {" — "}
            {loading
              ? "Loading..."
              : selectedMeetings.length === 0
              ? "No meetings"
              : `${selectedMeetings.length} meeting${selectedMeetings.length > 1 ? "s" : ""}`}
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-[#111827] rounded-2xl h-16 animate-pulse" />
              ))}
            </div>
          ) : selectedMeetings.length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-600">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No meetings this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedMeetings
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((m) => (
                  <div key={m.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
                    {m.type === "VIRTUAL"
                      ? <Video className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      : <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{m.title}</p>
                      <p className="text-xs text-gray-500">
                        {m.startTime} – {m.endTime}
                        {m.participants.length > 0 && (
                          <span className="ml-2 text-gray-400">· {m.participants.length} participant{m.participants.length > 1 ? "s" : ""}</span>
                        )}
                      </p>
                    </div>

                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLOR[m.status] ?? ""}`}>
                      {m.status.charAt(0) + m.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav active="/calendar" />
    </div>
  );
}

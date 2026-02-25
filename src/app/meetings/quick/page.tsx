"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Users, Clock, CalendarDays, Plus } from "lucide-react";
import { format, addDays, nextMonday } from "date-fns";
import { meetingApi } from "@/lib/api";

type DateOption = "today" | "tomorrow" | "next-monday";
type Duration = 30 | 60;

const DATE_OPTIONS: { label: string; value: DateOption }[] = [
  { label: "Today",    value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "Next Mon", value: "next-monday" },
];

function resolveDate(opt: DateOption): string {
  const now = new Date();
  if (opt === "today") return format(now, "yyyy-MM-dd");
  if (opt === "tomorrow") return format(addDays(now, 1), "yyyy-MM-dd");
  return format(nextMonday(now), "yyyy-MM-dd");
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export default function QuickAddPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dateOpt, setDateOpt] = useState<DateOption>("today");
  const [time, setTime] = useState("10:30");
  const [duration, setDuration] = useState<Duration>(30);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endTime = addMinutes(time, duration);

  const dateLabel = DATE_OPTIONS.find((d) => d.value === dateOpt)?.label ?? "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const timeLabel = `${hour}:${m.toString().padStart(2, "0")} ${period}`;

  const handleCreate = async () => {
    if (!title.trim()) { setError("Please describe the meeting"); return; }
    setError("");
    setLoading(true);
    try {
      await meetingApi.create({
        title: title.trim(),
        type: "VIRTUAL",
        date: resolveDate(dateOpt),
        startTime: time,
        endTime,
        isRecurring,
      });
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50/90 dark:bg-[#0d1117]/90 backdrop-blur border-b border-gray-200 dark:border-white/10 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">Quick Add Meeting</h1>
        <div className="w-8" />
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Meeting details */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide mb-2">MEETING DETAILS</p>
          <input
            className="w-full bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="What's the meeting about?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">DATE</p>
          </div>
          <div className="flex gap-2">
            {DATE_OPTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDateOpt(d.value)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-colors border ${
                  dateOpt === d.value
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white dark:bg-[#1a2540] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222f4a]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time + Duration */}
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">TIME</p>
            </div>
            <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
              <input
                type="time"
                className="bg-transparent text-gray-900 dark:text-white outline-none text-sm w-full"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide mb-2">DURATION</p>
            <div className="flex gap-2">
              {([30, 60] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-colors border ${
                    duration === d
                      ? "bg-gray-200 dark:bg-[#2a3a5c] border-blue-500/50 text-gray-900 dark:text-white"
                      : "bg-white dark:bg-[#1a2540] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {d === 30 ? "30m" : "1h"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Participants */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">INVITE PARTICIPANTS</p>
          </div>
          <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
            <input
              className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
              placeholder="Search name or email..."
            />
          </div>
        </div>

        {/* Recurring */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3.5">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Recurring Meeting</span>
          </div>
          <button
            onClick={() => setIsRecurring((v) => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              isRecurring ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isRecurring ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Live summary */}
        <p className="text-xs text-center text-gray-500">
          Scheduled for{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{dateLabel}</span> at{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{timeLabel}</span> for{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{duration === 30 ? "30m" : "1h"}</span>.
        </p>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          {loading ? "Creating..." : "Create Meeting"}
        </button>
      </div>
    </div>
  );
}

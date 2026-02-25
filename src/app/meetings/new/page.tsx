"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Link2, Video, MapPin, Calendar,
  Clock, Bold, Italic, List, Paperclip,
} from "lucide-react";
import { format } from "date-fns";
import { meetingApi } from "@/lib/api";
import type { MeetingType, CreateMeetingPayload } from "@/types/meeting";
import ParticipantPicker from "@/components/ParticipantPicker";
import type { ParticipantPayload } from "@/types/meeting";

const DEFAULT_FORM = {
  title: "",
  type: "VIRTUAL" as MeetingType,
  meetingLink: "",
  location: "",
  date: format(new Date(), "yyyy-MM-dd"),
  startTime: "10:00",
  endTime: "11:00",
  agenda: "",
  isRecurring: false,
  participants: [] as ParticipantPayload[],
};

export default function CreateMeetingPage() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof DEFAULT_FORM, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Meeting title is required"); return; }
    setError("");
    setLoading(true);
    try {
      const payload: CreateMeetingPayload = {
        title: form.title.trim(),
        type: form.type,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        agenda: form.agenda || undefined,
        isRecurring: form.isRecurring,
        participants: form.participants,
        ...(form.type === "VIRTUAL"
          ? { meetingLink: form.meetingLink || undefined }
          : { location: form.location || undefined }),
      };
      await meetingApi.create(payload);
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create meeting");
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
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
        <h1 className="text-base font-bold">Create New Meeting</h1>
        <div className="w-20" />
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Title */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">MEETING TITLE</label>
          <input
            className="w-full mt-2 bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="e.g., Weekly Sync"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        {/* Type toggle */}
        <div className="flex bg-gray-100 dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl p-1 gap-1">
          {(["VIRTUAL", "PHYSICAL"] as MeetingType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("type", t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                form.type === t
                  ? "bg-white dark:bg-[#2a3a5c] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t === "VIRTUAL"
                ? <Video className="w-4 h-4" />
                : <MapPin className="w-4 h-4" />}
              {t === "VIRTUAL" ? "Virtual" : "Physical"}
            </button>
          ))}
        </div>

        {/* Meeting link / location */}
        {form.type === "VIRTUAL" ? (
          <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Link2 className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none text-sm"
              placeholder="Add Video Call Link"
              value={form.meetingLink}
              onChange={(e) => set("meetingLink", e.target.value)}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none text-sm"
              placeholder="Location / Room"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
        )}

        {/* Date */}
        <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide mb-0.5">DATE</p>
            <input
              type="date"
              className="bg-transparent text-gray-900 dark:text-white outline-none text-sm w-full"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        {/* Start / End time */}
        <div className="grid grid-cols-2 gap-3">
          {(["startTime", "endTime"] as const).map((key) => (
            <div key={key} className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide">
                  {key === "startTime" ? "START" : "END"}
                </p>
              </div>
              <input
                type="time"
                className="bg-transparent text-gray-900 dark:text-white outline-none text-sm w-full"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
              PARTICIPANTS
              {form.participants.length > 0 && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  ({form.participants.length} selected)
                </span>
              )}
            </label>
          </div>
          <ParticipantPicker
            value={form.participants}
            onChange={(list) => set("participants", list)}
          />
        </div>

        {/* Agenda & Notes */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">AGENDA & NOTES</label>
          <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl mt-2 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-white/10">
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><List className="w-4 h-4" /></button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"><Paperclip className="w-4 h-4" /></button>
            </div>
            <textarea
              className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none resize-none"
              rows={5}
              placeholder="What is this meeting about?"
              value={form.agenda}
              onChange={(e) => set("agenda", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm mt-2"
        >
          <Calendar className="w-4 h-4" />
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </div>
    </div>
  );
}

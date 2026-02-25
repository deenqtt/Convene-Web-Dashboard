"use client";

import { CalendarDays, ArrowRight } from "lucide-react";
import { minutesUntil } from "@/lib/utils";
import type { TodayDashboard } from "@/types/meeting";

interface TodayBannerProps {
  data: TodayDashboard;
  onViewSchedule?: () => void;
}

export default function TodayBanner({ data, onViewSchedule }: TodayBannerProps) {
  const { total, nextMeeting } = data;

  const getNextInfo = () => {
    if (!nextMeeting) return null;
    const mins = minutesUntil(nextMeeting.date, nextMeeting.startTime);
    if (mins <= 0) return "is happening now.";
    if (mins < 60) return `starts in ${mins} minutes.`;
    const hrs = Math.floor(mins / 60);
    return `starts in ${hrs}h ${mins % 60}m.`;
  };

  const nextInfo = getNextInfo();

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-xl shadow-blue-900/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-blue-300" />
            <p className="text-xs font-semibold text-blue-300 tracking-wide">TODAY&apos;S SCHEDULE</p>
          </div>
          <h2 className="text-2xl font-bold leading-tight">
            {total === 0 ? "No Meetings Today" : `${total} Meeting${total > 1 ? "s" : ""} Today`}
          </h2>
          {nextMeeting && nextInfo && (
            <p className="text-sm text-blue-100 mt-1.5">
              Your next meeting is{" "}
              <span className="font-semibold text-white underline decoration-blue-300">
                {nextMeeting.title}
              </span>{" "}
              {nextInfo}
            </p>
          )}
          {total === 0 && (
            <p className="text-sm text-blue-200 mt-1.5">Enjoy your free day!</p>
          )}
        </div>
      </div>

      <button
        onClick={onViewSchedule}
        className="mt-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
      >
        View Schedule <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

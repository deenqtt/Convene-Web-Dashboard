"use client";

import { Video, MapPin, MoreHorizontal, Bell, ExternalLink } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { formatTime } from "@/lib/utils";
import Avatar from "./Avatar";

interface MeetingCardProps {
  meeting: Meeting;
  onJoin?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
}

export default function MeetingCard({ meeting, onJoin }: MeetingCardProps) {
  const isCancelled = meeting.status === "CANCELLED";
  const isUpcoming  = meeting.status === "UPCOMING";
  const isOngoing   = meeting.status === "ONGOING";
  const visibleParticipants = meeting.participants.slice(0, 3);
  const extraCount = meeting.participants.length - 3;

  const [timeVal, period] = formatTime(meeting.startTime).split(" ") as [string, string];

  return (
    <div
      className={`bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-4 transition-opacity ${
        isCancelled ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">

        {/* Time column */}
        <div className="w-14 flex-shrink-0 text-center pt-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{period}</p>
          <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{timeVal}</p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={`font-semibold truncate ${isCancelled ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                {meeting.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {meeting.type === "VIRTUAL" ? (
                  <Video className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                ) : (
                  <MapPin className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {meeting.location ?? meeting.meetingLink ?? "Virtual Meeting"}
                </p>
              </div>
            </div>

            {isCancelled ? (
              <span className="flex-shrink-0 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                CANCELLED
              </span>
            ) : (
              <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 flex-shrink-0 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isCancelled && (
            <div className="flex items-center justify-between mt-3">
              {/* Participant avatars */}
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {visibleParticipants.map((p) => (
                    <Avatar key={p.id} email={p.email ?? p.name} size="sm" />
                  ))}
                </div>
                {extraCount > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">+{extraCount}</span>
                )}
              </div>

              {/* Action */}
              {(isOngoing || isUpcoming) && onJoin && (
                <button
                  onClick={() => onJoin(meeting)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    isOngoing
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600/10"
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  {isOngoing ? "Join Now" : "Join"}
                </button>
              )}

              {isUpcoming && !onJoin && (
                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="text-xs">Reminder</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

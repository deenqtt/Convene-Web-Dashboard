"use client";

import { getInitials } from "@/lib/utils";

const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
];

interface AvatarProps {
  email: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ email, avatar, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  const colorIdx = email.charCodeAt(0) % COLORS.length;

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={email}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClass} ${COLORS[colorIdx]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {getInitials(email)}
    </div>
  );
}

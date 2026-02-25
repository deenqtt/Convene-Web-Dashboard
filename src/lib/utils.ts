import { clsx, type ClassValue } from "clsx";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale/id";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMeetingDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d, yyyy", { locale: localeId });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function minutesUntil(dateStr: string, timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  const meeting = new Date(dateStr);
  meeting.setHours(h, m, 0, 0);
  return Math.round((meeting.getTime() - Date.now()) / 60000);
}

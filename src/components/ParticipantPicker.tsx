"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, UserPlus } from "lucide-react";
import { DUMMY_CONTACTS } from "@/lib/dummy";

interface ExtUser {
  id: number;
  name: string;
  email: string;
  departmentName: string;
}

interface Participant {
  extId?: string;
  name: string;
  email?: string;
  department?: string;
}

interface Props {
  value: Participant[];
  onChange: (list: Participant[]) => void;
}

const MAX_VISIBLE = 8;

// Deterministic avatar color from name
const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "bg-violet-500/20 text-violet-600 dark:text-violet-400",
  "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  "bg-rose-500/20 text-rose-600 dark:text-rose-400",
  "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  "bg-pink-500/20 text-pink-600 dark:text-pink-400",
];

function avatarColor(name: string) {
  const code = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ParticipantPicker({ value, onChange }: Props) {
  const allUsers: ExtUser[] = DUMMY_CONTACTS as ExtUser[];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedExtIds = new Set(value.map((p) => p.extId).filter(Boolean));

  const totalMatches = query.trim()
    ? allUsers.filter(
        (u) =>
          !selectedExtIds.has(String(u.id)) &&
          (u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.departmentName.toLowerCase().includes(query.toLowerCase()))
      ).length
    : 0;

  const filtered = query.trim()
    ? allUsers
        .filter(
          (u) =>
            !selectedExtIds.has(String(u.id)) &&
            (u.name.toLowerCase().includes(query.toLowerCase()) ||
              u.email.toLowerCase().includes(query.toLowerCase()) ||
              u.departmentName.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, MAX_VISIBLE)
    : [];

  const addUser = useCallback(
    (user: ExtUser) => {
      onChange([...value, {
        extId: String(user.id),
        name: user.name,
        email: user.email,
        department: user.departmentName,
      }]);
      setQuery("");
      inputRef.current?.focus();
    },
    [value, onChange]
  );

  const removeUser = useCallback(
    (extId: string) => onChange(value.filter((p) => p.extId !== extId)),
    [value, onChange]
  );

  return (
    <div ref={containerRef} className="space-y-2">

      {/* ── Search input ─────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 bg-white dark:bg-[#1a2540] border rounded-2xl px-4 py-3 cursor-text transition-colors ${
          open
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-200 dark:border-white/10"
        }`}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
      >
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
          placeholder="Search by name, email, or department..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setQuery(""); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Dropdown ─────────────────────────────────────── */}
      {open && query.trim().length > 0 && (
        <div className="relative z-50">
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500 text-center">
                No users found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul className="max-h-60 overflow-y-auto">
                {filtered.map((user, i) => (
                  <li
                    key={user.id}
                    className={i !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => addUser(user)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${avatarColor(user.name)}`}>
                        {initials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {user.departmentName} · {user.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <UserPlus className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {totalMatches > MAX_VISIBLE && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 dark:text-gray-500 text-center">
                Showing {MAX_VISIBLE} of {totalMatches} — type more to narrow down
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Selected participants ────────────────────────── */}
      {value.length > 0 && (
        <div className="bg-white dark:bg-[#1a2540] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wide">
              {value.length} PARTICIPANT{value.length > 1 ? "S" : ""} ADDED
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
            >
              Clear all
            </button>
          </div>

          {/* List */}
          <ul>
            {value.map((p, i) => (
              <li
                key={p.extId ?? i}
                className={`flex items-center gap-3 px-4 py-2.5 ${
                  i !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""
                }`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${avatarColor(p.name)}`}>
                  {initials(p.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {p.department}
                  </p>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeUser(p.extId ?? "")}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

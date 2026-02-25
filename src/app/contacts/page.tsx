"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Mail, Phone, Calendar,
  Home, Users, Settings, Building2, X,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DUMMY_CONTACTS } from "@/lib/dummy";

const SIDEBAR_NAV = [
  { label: "Home",     href: "/",         Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "Contacts", href: "/contacts", Icon: Users },
  { label: "Settings", href: "/settings", Icon: Settings },
];

const AVATAR_COLORS = [
  "bg-blue-500",   "bg-violet-500", "bg-emerald-500",
  "bg-amber-500",  "bg-rose-500",   "bg-cyan-500",
  "bg-orange-500", "bg-pink-500",
];

function avatarColor(name: string) {
  const code = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface ExtUser {
  id: number;
  name: string;
  email: string | null;
  departmentName: string | null;
  phoneHr: string | null;
  authorizationLevel: string | null;
}

export default function ContactsPage() {
  const router = useRouter();
  const contacts = DUMMY_CONTACTS as ExtUser[];
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.departmentName?.toLowerCase().includes(q) ||
        c.authorizationLevel?.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  // Group by department when no search, flat list when searching
  const grouped = useMemo(() => {
    if (search.trim()) return null;
    return contacts.reduce<Record<string, ExtUser[]>>((acc, c) => {
      const dept = c.departmentName ?? "Other";
      (acc[dept] ??= []).push(c);
      return acc;
    }, {});
  }, [contacts, search]);

  const departments = grouped ? Object.keys(grouped).sort() : [];

  function ContactCard({ contact }: { contact: ExtUser }) {
    const isSelected = selected === contact.id;
    return (
      <button
        onClick={() => setSelected(isSelected ? null : contact.id)}
        className={`w-full text-left bg-white dark:bg-[#111827] border rounded-2xl p-4 transition-all ${
          isSelected
            ? "border-blue-500/50 ring-1 ring-blue-500/20"
            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white ${avatarColor(contact.name)}`}>
            {initials(contact.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{contact.name}</p>
            <p className="text-xs text-gray-500 truncate">{contact.departmentName}</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
            {contact.authorizationLevel}
          </span>
        </div>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{contact.email}</span>
            </div>
            {contact.phoneHr && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                {contact.phoneHr}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
              {contact.departmentName}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/meetings/new");
              }}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold py-2 rounded-xl hover:bg-blue-600/20 dark:hover:bg-blue-600/30 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule Meeting
            </button>
          </div>
        )}
      </button>
    );
  }

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
              href === "/contacts"
                ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </a>
        ))}
      </aside>

      <main className="sm:ml-56 max-w-2xl mx-auto sm:mx-0 px-4 sm:px-8 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold">Contacts</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {contacts.length} people
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 mb-5">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <input
            className="flex-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none bg-transparent"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search results — flat list */}
        {search.trim() ? (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No contacts found for &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide px-1 mb-2">
                  {filtered.length} RESULT{filtered.length > 1 ? "S" : ""}
                </p>
                {filtered.map((c) => <ContactCard key={c.id} contact={c} />)}
              </>
            )}
          </div>

        /* Default — grouped by department */
        ) : (
          <div className="space-y-5">
            {departments.map((dept) => (
              <div key={dept}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide">
                    {dept.toUpperCase()}
                  </p>
                  <span className="text-xs text-gray-300 dark:text-gray-600">
                    ({grouped![dept].length})
                  </span>
                </div>
                <div className="space-y-2">
                  {grouped![dept]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => <ContactCard key={c.id} contact={c} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="/contacts" />
    </div>
  );
}

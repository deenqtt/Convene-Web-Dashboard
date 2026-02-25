"use client";

import {
  User, Bell, Shield, Palette, Globe,
  ChevronRight, LogOut, Moon, Sun, Monitor, Smartphone,
  Home, Calendar, Users, Settings,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Avatar from "@/components/Avatar";
import { useTheme, type Theme } from "@/lib/theme";
import { useUser } from "@/lib/use-user";

const SIDEBAR_NAV = [
  { label: "Home",     href: "/",         Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "Contacts", href: "/contacts", Icon: Users },
  { label: "Settings", href: "/settings", Icon: Settings },
];

const THEME_OPTIONS: { value: Theme; label: string; Icon: React.ElementType }[] = [
  { value: "light",  label: "Light",  Icon: Sun },
  { value: "dark",   label: "Dark",   Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const SETTING_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User,       label: "Profile",          desc: "Edit your name and avatar" },
      { icon: Shield,     label: "Security",         desc: "Password & 2FA" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell,       label: "Notifications",    desc: "Meeting reminders & alerts" },
      { icon: Globe,      label: "Language",         desc: "English" },
      { icon: Palette,    label: "Theme",            desc: "Blue (default)" },
    ],
  },
  {
    title: "App",
    items: [
      { icon: Smartphone, label: "Mobile App",       desc: "Download for iOS & Android" },
    ],
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();

  const themeDesc = theme === "light" ? "Light mode" : theme === "dark" ? "Dark mode" : "System default";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white pb-20 sm:pb-0">
      {/* Sidebar */}
      <aside className="hidden sm:flex fixed top-0 left-0 h-full w-56 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 flex-col p-5 gap-1 z-30">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Meeting</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">by deenqtt</p>
        </div>
        {SIDEBAR_NAV.map(({ label, href, Icon }) => (
          <a key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              href === "/settings"
                ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </a>
        ))}
      </aside>

      <main className="sm:ml-56 max-w-2xl mx-auto sm:mx-0 px-4 sm:px-8 py-6">
        <h2 className="text-xl font-bold mb-6">Settings</h2>

        {/* Profile card */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <Avatar email={user?.email ?? ""} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white">{user?.username ?? "—"}</p>
            <p className="text-xs text-gray-500">{user?.email ?? ""}</p>
            {user?.role && (
              <span className="inline-block mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Appearance section */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide mb-2 px-1">
            APPEARANCE
          </p>
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1a2540] flex items-center justify-center flex-shrink-0">
                <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Appearance</p>
                <p className="text-xs text-gray-500">{themeDesc}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    theme === value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings sections */}
        <div className="space-y-5">
          {SETTING_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide mb-2 px-1">
                {section.title.toUpperCase()}
              </p>
              <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                {section.items.map((item, idx) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left ${
                      idx !== 0 ? "border-t border-gray-100 dark:border-white/5" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1a2540] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Version + Logout */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6">Meeting App v1.0.0 · by deenqtt</p>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-semibold text-sm py-3 rounded-2xl hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </main>

      <BottomNav active="/settings" />
    </div>
  );
}

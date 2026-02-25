"use client";

import { Home, Calendar, Users, Settings } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home,     label: "Home",     href: "/" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Users,    label: "Contacts", href: "/contacts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface BottomNavProps {
  active: string;
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-white/10 flex sm:hidden z-40">
      {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
        const isActive = active === href;
        return (
          <a
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-colors ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

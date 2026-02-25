"use client";

import { useRouter } from "next/navigation";
import { DUMMY_USER } from "@/lib/dummy";

export interface UserInfo {
  username: string;
  email: string | null;
  role: string | null;
}

export function useUser() {
  const router = useRouter();

  function logout() {
    router.push("/login");
  }

  return { user: DUMMY_USER as UserInfo, loading: false, logout };
}

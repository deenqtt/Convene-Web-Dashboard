"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detect actual resolved theme (dark class on <html>)
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1117] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={isDark ? "/icon-dark.svg" : "/icon-light.svg"}
            alt="Convene logo"
            width={72}
            height={72}
            className="rounded-2xl mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Convene
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Meeting management · by deenqtt
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Convene © {new Date().getFullYear()} deenqtt
        </p>
      </div>
    </div>
  );
}

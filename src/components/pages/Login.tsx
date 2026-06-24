import React, { useState } from "react";
import { useAuthStore, useNavigationStore } from "../../store";
import { GraduationCap, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const { navigate } = useNavigationStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email) {
      setFormError("Please enter your academic email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    const success = await login(email);
    if (success) {
      navigate("/dashboard");
    } else {
      setFormError(error || "Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative light rings */}
        <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center space-x-2 cursor-pointer mb-6"
            onClick={() => navigate("/")}
          >
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus<span className="text-indigo-600 dark:text-indigo-400 font-medium font-sans">Flow</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back Student</h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-2">Enter your campus credentials to open your dashboard.</p>
        </div>

        {formError && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Academic Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@campusflow.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center space-x-2 text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Sign In Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 text-center text-xs">
          <span className="text-slate-400">Don't have an account? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            Sign Up & Onboard
          </button>
        </div>
      </div>
    </div>
  );
}

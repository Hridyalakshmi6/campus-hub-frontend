import React, { useState } from "react";
import { useAuthStore, useNavigationStore } from "../../store";
import { GraduationCap, ArrowRight, User as UserIcon, Mail, Phone, BookOpen, Layers, CheckCircle2, AlertCircle } from "lucide-react";

export default function Register() {
  const { register, loading, error } = useAuthStore();
  const { navigate } = useNavigationStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleLinked, setGoogleLinked] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLinkGoogle = () => {
    setIsLinking(true);
    setTimeout(() => {
      setGoogleLinked(true);
      setIsLinking(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !whatsapp) {
      setFormError("Please fill in all required student credentials.");
      return;
    }

    const success = await register(name, email, branch, year, whatsapp);
    if (success) {
      useAuthStore.setState({
        user: {
          name,
          email,
          branch,
          year,
          whatsapp,
          subjects: ["Compiler Design", "Operating Systems", "Computer Networks", "Software Engineering"],
          googleLinked,
        },
      });
      navigate("/dashboard");
    } else {
      setFormError(error || "Registration failed. Please check inputs.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Ambient top decoration */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Onboarding Setup</h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-2">Create your account and define your academic environment.</p>
        </div>

        {formError && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Hridya Lakshmi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Engineering Branch / Major
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>WhatsApp Number</span>
                <span className="text-[10px] text-indigo-500 font-bold">For Automations</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+919876543210"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Google Link Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Google Calendar Sync
              </label>
              {googleLinked ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Google Calendar Linked</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setGoogleLinked(false)}
                    className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLinkGoogle}
                  disabled={isLinking}
                  className="w-full bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLinking ? (
                    <span className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Link Google Calendar</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Default Onboard Subjects:</span>
              <p className="mt-1">
                Your year ({year}) and branch ({branch}) initializes automatic tracking for core subjects: Compiler Design, Operating Systems, Computer Networks, and Software Engineering.
              </p>
            </div>
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
                <span>Complete Student Onboarding</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 text-center text-xs">
          <span className="text-slate-400">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

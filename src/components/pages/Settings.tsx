import React, { useState } from "react";
import { useAuthStore, useNavigationStore } from "../../store";
import { Settings as SettingsIcon, Bell, Moon, Sun, Shield, Lock, Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const { user } = useAuthStore();
  const { navigate } = useNavigationStore();

  const [darkMode, setDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Configure notification dispatch settings, theme selections, and developer keys.
        </p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        {saveSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center space-x-2">
            <CheckCircle className="h-4.5 w-4.5" />
            <span>Workspace preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Theme customizer */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
              Appearance & Feel
            </h3>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center space-x-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light Theme Toggle</span>
              </span>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="bg-slate-100 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-850 transition-colors"
              >
                {darkMode ? "Switch to Light" : "Switch to Dark"}
              </button>
            </div>
          </div>

          {/* Integration dispatch settings */}
          <div className="space-y-4 pt-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
              Notification Routing
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Receive weekly attendance safety analysis emails</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarSync}
                  onChange={(e) => setCalendarSync(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Automatically sync homework schedules with linked Calendar account</span>
              </label>
            </div>
          </div>

          {/* Security details */}
          <div className="space-y-4 pt-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
              Security & Credentials
            </h3>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center space-x-2">
                <Lock className="h-4 w-4 text-indigo-500" />
                <span>Manage Linked Google OAuth Token</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Linked
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-colors"
          >
            <Save className="h-4.5 w-4.5" />
            <span>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAutomationStore, useAuthStore } from "../../store";
import { Cpu, MessageSquare, Calendar, RefreshCw, ToggleLeft, ToggleRight, Settings, Plus, Activity } from "lucide-react";

export default function AutomationDashboard() {
  const {
    whatsappStatus,
    calendarStatus,
    deadlineScraperWebhook,
    noticeScraperWebhook,
    logs,
    loading,
    fetchAutomations,
    toggleWhatsapp,
    toggleCalendar,
    triggerNoticeWebhook,
    triggerDeadlineWebhook
  } = useAutomationStore();

  const { user } = useAuthStore();

  const [reminderLimit, setReminderLimit] = useState("1 day before");

  useEffect(() => {
    fetchAutomations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Automations Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Monitor your active n8n webhooks, edit alert parameters, and verify dispatch timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Core Channels & Webhook URLs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Channels */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-6">
              Active Integration Channels
            </h3>

            {loading ? (
              <div className="py-8 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* WhatsApp Status Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-150">WhatsApp Reminders</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Dispatches class warning summaries to {user ? user.whatsapp : "+919876543210"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleWhatsapp}
                    className="text-slate-500 hover:text-indigo-600 focus:outline-none transition-colors cursor-pointer"
                  >
                    {whatsappStatus === "ACTIVE" ? (
                      <ToggleRight className="h-10 w-10 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-10 w-10" />
                    )}
                  </button>
                </div>

                {/* Google Calendar Status Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-150">Google Calendar Lock</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Synchronizes extracted exam bulletins automatically
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleCalendar}
                    className="text-slate-500 hover:text-indigo-600 focus:outline-none transition-colors cursor-pointer"
                  >
                    {calendarStatus === "CONNECTED" ? (
                      <ToggleRight className="h-10 w-10 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-10 w-10" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Webhook listings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">
              Durable n8n Workflow Hooks
            </h3>

            <div className="space-y-4">
              {/* Notice Webhook */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Notice Board Scraper Webhook
                  </span>
                  <button
                    onClick={() => triggerNoticeWebhook("Test Manual Trigger")}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl px-3 py-2 text-[10px] text-slate-450 truncate font-mono border border-slate-100 dark:border-slate-855">
                  {noticeScraperWebhook}
                </div>
              </div>

              {/* Deadline Webhook */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-855">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Deadline Dispatch Webhook
                  </span>
                  <button
                    onClick={() => triggerDeadlineWebhook()}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl px-3 py-2 text-[10px] text-slate-450 truncate font-mono border border-slate-100 dark:border-slate-855">
                  {deadlineScraperWebhook}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Activity timeline logs & notification config (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-6 flex items-center space-x-1.5">
              <Activity className="h-5 w-5 text-indigo-500" />
              <span>Real-Time Workflow Logs</span>
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-start gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 animate-pulse" />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-800 dark:text-slate-205">{log.workflow}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1 leading-relaxed">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100/50 rounded-3xl p-6">
            <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-400 mb-2 flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span>Global Dispatch Parameters</span>
            </h4>
            <div className="mt-4 space-y-3">
              <label className="block text-[10px] text-slate-450 uppercase tracking-wider font-semibold">
                Study Reminder Buffer
              </label>
              <select
                value={reminderLimit}
                onChange={(e) => setReminderLimit(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <option value="2 hours before">2 hours before class</option>
                <option value="12 hours before">12 hours before class</option>
                <option value="1 day before">1 day before exam</option>
                <option value="2 days before">2 days before exam</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useTaskStore, useAuthStore } from "../../store";
import { Plus, CheckSquare, Trash2, Calendar, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

export default function TaskList() {
  const { tasks, loading, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Compiler Design");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [dueDate, setDueDate] = useState("2026-06-25");
  const [reminderTime, setReminderTime] = useState("18:00");
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [whatsappReminder, setWhatsappReminder] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addTask({
      title,
      subject,
      priority,
      dueDate,
      reminderTime,
      addToCalendar,
      whatsappReminder,
    });
    setTitle("");
    setIsModalOpen(false);
  };

  const pending = tasks.filter((t) => t.status === "PENDING");
  const completed = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tasks & Daily Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Toggle reminders and calendar locks for each specific task assignment.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1 & 2: Lists of Pending & Completed tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Pending Assignments ({pending.length})</span>
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : pending.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                All assignments are completed! Log a new goal above.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {pending.map((t) => (
                  <div key={t.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={t.status === "COMPLETED"}
                        onChange={() => updateTask(t.id, { status: "COMPLETED" })}
                        className="rounded h-5 w-5 text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500/20 mt-0.5 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {t.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                            {t.subject}
                          </span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                            t.priority === "HIGH" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-slate-50 text-slate-500"
                          }`}>
                            {t.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {t.whatsappReminder && (
                        <MessageSquare className="h-4.5 w-4.5 text-emerald-500" title="WhatsApp remind active" />
                      )}
                      {t.addToCalendar && (
                        <Calendar className="h-4.5 w-4.5 text-indigo-500" title="Google Calendar locked" />
                      )}
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Completed Assignments ({completed.length})</span>
            </h3>
            {completed.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Complete pending goals to build your streak.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {completed.map((t) => (
                  <div key={t.id} className="py-4 flex items-center justify-between gap-4 opacity-60">
                    <div className="flex items-center space-x-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={t.status === "COMPLETED"}
                        onChange={() => updateTask(t.id, { status: "PENDING" })}
                        className="rounded h-5 w-5 text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500/20 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-through truncate">
                          {t.title}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{t.subject}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Task Quick Tips & Workspace Settings */}
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/20 rounded-3xl p-6">
            <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-400 mb-2 flex items-center space-x-1.5">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>Automated Reminder Settings</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When WhatsApp Reminders are enabled, CampusFlow dispatches automated status check messages to your WhatsApp number ({user ? user.whatsapp : "+919876543210"}) at your exact selected Reminder Time. Keep calendar checkboxes checked to maintain synchronized offline timelines!
            </p>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-6">Create Academic Task</h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Write LR(1) parser parser algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Subject Tag
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    {user?.subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    )) || (
                      <>
                        <option value="Compiler Design">Compiler Design</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Placement Prep">Placement Prep</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToCalendar}
                    onChange={(e) => setAddToCalendar(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Add instantly to Google Calendar</span>
                </label>
                <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappReminder}
                    onChange={(e) => setWhatsappReminder(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Receive WhatsApp deadline alert</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Confirm Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

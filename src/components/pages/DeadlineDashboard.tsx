import React, { useState, useEffect } from "react";
import { useDeadlineStore, useAuthStore } from "../../store";
import { Plus, Calendar, Sparkles, RefreshCw, Layers, CheckCircle2, AlertCircle } from "lucide-react";

export default function DeadlineDashboard() {
  const { deadlines, loading, aiLoading, fetchDeadlines, addDeadline, generateStudyPlan, updateDeadline } = useDeadlineStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Compiler Design");
  const [dueDate, setDueDate] = useState("2026-06-28");

  const [activeDeadlineId, setActiveDeadlineId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addDeadline({
      title,
      subject,
      dueDate,
    });
    setTitle("");
    setIsModalOpen(false);
  };

  const handleGeneratePlan = async (id: string) => {
    await generateStudyPlan(id);
  };

  const activeDeadline = deadlines.find((d) => d.id === (activeDeadlineId || deadlines[0]?.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Deadline Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Let Gemini construct structured study timelines matched to your due dates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Deadline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Deadlines selection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">
              Registered Deadlines
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : deadlines.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No deadlines logged. Click "Add Deadline" to register one.
              </div>
            ) : (
              <div className="space-y-3">
                {deadlines.map((dl) => {
                  const isActive = activeDeadline?.id === dl.id;
                  return (
                    <div
                      key={dl.id}
                      onClick={() => {
                        setActiveDeadlineId(dl.id);
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20"
                          : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                            {dl.subject}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 mt-2 truncate max-w-[200px]">
                            {dl.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">Due Date: {dl.dueDate}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {dl.progress}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${dl.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Slider to adjust progress */}
                      {isActive && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Adjust Progress:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={dl.progress}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateDeadline(dl.id, { progress: Number(e.target.value) });
                            }}
                            className="w-2/3 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: AI Study Plan viewer (7 cols) */}
        <div className="lg:col-span-7">
          {activeDeadline ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                      {activeDeadline.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Study guidelines for {activeDeadline.subject} exam timeline
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-xl font-bold">
                    Goal: {activeDeadline.dailyGoal} / day
                  </span>
                </div>

                {aiLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-350">
                      Gemini is tailoring your daily study schedule...
                    </p>
                  </div>
                ) : !activeDeadline.studyPlan ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-sm">
                      No study plan initialized for this deadline.
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Let Gemini analyze your timeline and break down preparation milestones day-by-day.
                    </p>
                    <button
                      onClick={() => handleGeneratePlan(activeDeadline.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI Study Plan</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Plan Overview
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed italic bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                        "{activeDeadline.studyPlan.overview}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Day-by-Day Roadmap
                      </p>
                      <div className="space-y-3">
                        {activeDeadline.studyPlan.timeline.map((phase, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex gap-4"
                          >
                            <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="space-y-2 min-w-0 flex-1">
                              <div className="flex justify-between">
                                <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                  {phase.phaseName}
                                </h5>
                                <span className="text-[10px] text-slate-400">{phase.duration}</span>
                              </div>
                              <ul className="space-y-1 pl-4 list-disc text-xs text-slate-500">
                                {phase.tasks.map((task, tIdx) => (
                                  <li key={tIdx} className="leading-relaxed">
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeDeadline.studyPlan && (
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                  <button
                    onClick={() => handleGeneratePlan(activeDeadline.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer flex items-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Regenerate Roadmap with AI</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center h-full min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-sm text-slate-400">Select a deadline on the left panel to inspect study roadmaps.</p>
            </div>
          )}
        </div>
      </div>

      {/* Deadline Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-6">Log New Deadline</h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Deadline Goal / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DBMS term paper submission"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Course Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {user?.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )) || (
                    <>
                      <option value="Compiler Design">Compiler Design</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Cryptography">Cryptography</option>
                    </>
                  )}
                </select>
              </div>

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
                  Confirm Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

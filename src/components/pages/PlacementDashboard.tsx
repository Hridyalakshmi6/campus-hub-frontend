import React, { useState, useEffect } from "react";
import { usePlacementStore, useAuthStore } from "../../store";
import { Plus, Award, Briefcase, Calendar, Sparkles, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

export default function PlacementDashboard() {
  const { placements, loading, aiLoading, fetchPlacements, addPlacement, generatePrepTips, updatePlacement } = usePlacementStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("Software Development Engineer (SDE)");
  const [stage, setStage] = useState("Technical Interview Round 1");
  const [status, setStatus] = useState<"APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED">("INTERVIEWING");

  const [activePlacementId, setActivePlacementId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    await addPlacement({
      company,
      role,
      stage,
      status,
      nextEvent: null,
    });
    setCompany("");
    setIsModalOpen(false);
  };

  const handleGeneratePrep = async (id: string) => {
    await generatePrepTips(id);
  };

  const activePlacement = placements.find((p) => p.id === (activePlacementId || placements[0]?.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Placement Prep Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Track company application funnels and let Gemini customize mock questions for active rounds.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Company</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Applications List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">
              Your Application Funnel
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : placements.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No company pipelines logged yet. Click "Add Company" to initialize.
              </div>
            ) : (
              <div className="space-y-3">
                {placements.map((p) => {
                  const isActive = activePlacement?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePlacementId(p.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? "border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/20"
                          : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                            {p.company}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">
                            {p.role}
                          </p>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded-md font-semibold mt-2 inline-block">
                            Stage: {p.stage}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.status === "OFFER"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                            : p.status === "REJECTED"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                            : p.status === "INTERVIEWING"
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      {isActive && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Update Status:</span>
                          <select
                            value={p.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              updatePlacement(p.id, { status: e.target.value as any });
                            }}
                            className="text-[10px] font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded cursor-pointer text-slate-600 dark:text-slate-350"
                          >
                            <option value="APPLIED">APPLIED</option>
                            <option value="INTERVIEWING">INTERVIEWING</option>
                            <option value="OFFERED">OFFERED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: AI Practice Tips & Study Board (7 cols) */}
        <div className="lg:col-span-7">
          {activePlacement ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                      Practice Tips: {activePlacement.company}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Prep module for "{activePlacement.role}" position
                    </p>
                  </div>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-indigo-900/30 px-3 py-1 rounded-xl font-bold">
                    Active stage: {activePlacement.stage}
                  </span>
                </div>

                {aiLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-350">
                      Gemini is generating customized prep kits for {activePlacement.company}...
                    </p>
                  </div>
                ) : !activePlacement.prepTips ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-sm">
                      No preparation questions compiled yet.
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Fetch target DSA topics, coding queries, and core system architectures based on this interview stage.
                    </p>
                    <button
                      onClick={() => handleGeneratePrep(activePlacement.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Prepare with Gemini AI</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Focus parameters */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-850">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Primary DSA Topics</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          {activePlacement.prepTips.recommendedTopics?.join(", ") || "Graphs, DP, Recursion"}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-850">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated difficulty</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          {activePlacement.prepTips.difficulty || "Medium to Hard"}
                        </p>
                      </div>
                    </div>

                    {/* DSA questions */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Practice LeetCode / DSA Problems
                      </p>
                      <div className="space-y-3">
                        {activePlacement.prepTips.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850"
                          >
                            <h5 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-150">
                              {q.topic}
                            </h5>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line">
                              {q.questionText}
                            </p>
                            <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-xl text-[11px] text-indigo-600 dark:text-indigo-400 leading-relaxed mt-3 border border-indigo-100/30">
                              <span className="font-bold">Key Review Focus:</span> {q.conceptRequired}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activePlacement.prepTips && (
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                  <button
                    onClick={() => handleGeneratePrep(activePlacement.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer flex items-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Regenerate Prep Cards</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center h-full min-h-[420px] flex flex-col items-center justify-center">
              <p className="text-sm text-slate-400">Select an application item on the left list to generate preparatory blueprints.</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-6">Track Target Placement Application</h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Uber"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Target Role / Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE Intern, Frontend dev, Analyst"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Current Stage
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technical Round 2"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Funnel Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="INTERVIEWING">INTERVIEWING</option>
                    <option value="OFFER">OFFER</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
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
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

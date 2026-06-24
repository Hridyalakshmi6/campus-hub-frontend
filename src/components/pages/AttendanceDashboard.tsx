import React, { useState, useEffect } from "react";
import { useAttendanceStore, useAuthStore } from "../../store";
import { Plus, AlertTriangle, CheckCircle, Flame, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";

export default function AttendanceDashboard() {
  const { attendance, loading, fetchAttendance, logAttendance } = useAttendanceStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("Compiler Design");
  const [attended, setAttended] = useState(15);
  const [total, setTotal] = useState(20);

  // Calculator State
  const [calcSubjectId, setCalcSubjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAttendance(subject, attended, total);
    setIsModalOpen(false);
  };

  const selectedSubject = attendance.find((a) => a.id === (calcSubjectId || attendance[0]?.id));

  // Compute lectures needed to reach 75%
  const getLecturesNeeded = (att: number, tot: number) => {
    if (tot === 0) return 0;
    const currentRatio = att / tot;
    if (currentRatio >= 0.75) return 0;

    // We want (att + x) / (tot + x) >= 0.75
    // att + x >= 0.75 * tot + 0.75 * x
    // 0.25 * x >= 0.75 * tot - att
    // x >= 3 * tot - 4 * att
    const x = Math.ceil(3 * tot - 4 * att);
    return x > 0 ? x : 0;
  };

  // Compute safe classes to skip before dropping below 75%
  const getSafeSkips = (att: number, tot: number) => {
    if (tot === 0) return 0;
    const currentRatio = att / tot;
    if (currentRatio < 0.75) return 0;

    // We want att / (tot + y) >= 0.75
    // att >= 0.75 * tot + 0.75 * y
    // 0.75 * y <= att - 0.75 * tot
    // y <= (att - 0.75 * tot) / 0.75
    // y <= (4 * att - 3 * tot) / 3
    const y = Math.floor((4 * att - 3 * tot) / 3);
    return y > 0 ? y : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attendance Risk Alerter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Track daily lectures attended and verify safe margins for each academic subject.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Update Attendance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Attendance Board (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-6 flex items-center justify-between">
              <span>Class Attendance safety rating (75% Minimum)</span>
              <span className="text-[10px] text-slate-400">Log changes to recalculate</span>
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attendance.map((sub) => {
                  const ratio = sub.total > 0 ? (sub.attended / sub.total) * 100 : 100;
                  const isCritical = ratio < 75;
                  const isWarning = ratio >= 75 && ratio < 80;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setCalcSubjectId(sub.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        selectedSubject?.id === sub.id
                          ? "border-indigo-600 bg-indigo-50/15 dark:bg-indigo-950/20"
                          : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                            {sub.subject}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Logged: {sub.attended} of {sub.total} classes
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isCritical
                            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                            : isWarning
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                        }`}>
                          {ratio.toFixed(0)}%
                        </span>
                      </div>

                      {/* Progress Visualizer */}
                      <div className="mt-4 space-y-2">
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                          <span>Target: 75%</span>
                          <span>
                            {isCritical ? "⚠️ CRITICAL" : isWarning ? "⚠️ WARNING" : "🟢 SAFE"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Classes Required Safety Calculator (5 cols) */}
        <div className="lg:col-span-5">
          {selectedSubject ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850 mb-4">
                  Safety Calculator: {selectedSubject.subject}
                </h3>

                <div className="space-y-6">
                  {/* Subject Status indicators */}
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-center border border-slate-100 dark:border-slate-850">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attended</p>
                      <p className="font-sans font-bold text-lg text-slate-800 dark:text-white mt-1">
                        {selectedSubject.attended}
                      </p>
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-center border border-slate-100 dark:border-slate-850">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Classes</p>
                      <p className="font-sans font-bold text-lg text-slate-800 dark:text-white mt-1">
                        {selectedSubject.total}
                      </p>
                    </div>
                  </div>

                  {/* Math safety analysis */}
                  <div className="space-y-4">
                    {/* CASE 1: Low Attendance - consecutive lectures needed */}
                    {getLecturesNeeded(selectedSubject.attended, selectedSubject.total) > 0 ? (
                      <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            Below criteria! Action needed
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                            You must attend the next{" "}
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              {getLecturesNeeded(selectedSubject.attended, selectedSubject.total)}
                            </span>{" "}
                            consecutive lectures in {selectedSubject.subject} to restore your safety rating above 75%. Do not skip classes!
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* CASE 2: Safe Attendance - skips available */
                      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            Sufficient Safety Margin
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                            Your attendance is healthy. You can safely skip up to{" "}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {getSafeSkips(selectedSubject.attended, selectedSubject.total)}
                            </span>{" "}
                            lectures in {selectedSubject.subject} before slipping below the mandatory 75% limit.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/40 dark:bg-indigo-950/10 p-3.5 rounded-xl border border-indigo-100/60 dark:border-indigo-900/20 text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5 mt-6">
                <Flame className="h-4 w-4" />
                <span>Attendance alerts are compiled weekly and sent via WhatsApp.</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center h-full min-h-[350px] flex flex-col items-center justify-center">
              <p className="text-sm text-slate-400">Select a course tag on the left list to run safety algorithms.</p>
            </div>
          )}
        </div>
      </div>

      {/* Attendance log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-6">Log Class Attendance</h3>

            <form onSubmit={handleLog} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Syllabus Subject
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
                      <option value="Computer Networks">Computer Networks</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Lectures Attended</span>
                    <button
                      type="button"
                      onClick={() => setAttended(Math.max(0, attended - 1))}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      <MinusCircle className="h-3.5 w-3.5" />
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      value={attended}
                      onChange={(e) => setAttended(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAttended(attended + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 cursor-pointer"
                    >
                      <PlusCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Total Held</span>
                    <button
                      type="button"
                      onClick={() => setTotal(Math.max(0, total - 1))}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      <MinusCircle className="h-3.5 w-3.5" />
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      value={total}
                      onChange={(e) => setTotal(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setTotal(total + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 cursor-pointer"
                    >
                      <PlusCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
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
                  Confirm Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

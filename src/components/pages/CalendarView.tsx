import { useState, useEffect } from "react";
import { useTaskStore, useDeadlineStore, useStudyGroupStore } from "../../store";
import { Calendar as CalendarIcon, Clock, Layers, Users, Sparkles, CheckCircle } from "lucide-react";

export default function CalendarView() {
  const { tasks, fetchTasks } = useTaskStore();
  const { deadlines, fetchDeadlines } = useDeadlineStore();
  const { groups, fetchGroups } = useStudyGroupStore();

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchTasks();
    fetchDeadlines();
    fetchGroups();
  }, []);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => null);

  // Match items to selected day
  const formattedSelectedDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  const todayTasks = tasks.filter((t) => t.dueDate === formattedSelectedDateStr);
  const todayDeadlines = deadlines.filter((d) => d.dueDate === formattedSelectedDateStr);
  const todayGroups = groups.filter((g) => g.date === formattedSelectedDateStr);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Schedules & Calendar
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Lock test schedules, peer review slots, and homework assignments into your synchronized student roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Interactive Month Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                {monthNames[selectedMonth]} {selectedYear}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer"
                >
                  ◀
                </button>
                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Grid Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-2">
              {blankDays.map((_, idx) => (
                <div key={`blank-${idx}`} className="h-10 sm:h-12" />
              ))}
              {calendarDays.map((day) => {
                const isSelected = selectedDay === day;
                const formattedDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                const hasTask = tasks.some((t) => t.dueDate === formattedDateStr);
                const hasDeadline = deadlines.some((d) => d.dueDate === formattedDateStr);
                const hasGroup = groups.some((g) => g.date === formattedDateStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 sm:h-12 rounded-xl text-xs font-semibold flex flex-col items-center justify-between p-1 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                        : "bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    <span>{day}</span>
                    <div className="flex gap-1 justify-center pb-0.5">
                      {hasTask && <span className="h-1 w-1 rounded-full bg-amber-400" />}
                      {hasDeadline && <span className="h-1 w-1 rounded-full bg-rose-400" />}
                      {hasGroup && <span className="h-1 w-1 rounded-full bg-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Daily events details (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850 mb-4 flex items-center justify-between">
                <span>Agenda: {formattedSelectedDateStr}</span>
                <span className="text-[10px] text-slate-400">Day details</span>
              </h3>

              {todayTasks.length === 0 && todayDeadlines.length === 0 && todayGroups.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-emerald-500/85" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">No scheduled events</p>
                  <p className="text-slate-450 text-[10px]">Your daily timeline is clear. Sit back and study!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {/* Deadlines */}
                  {todayDeadlines.map((dl) => (
                    <div key={dl.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/30 rounded-xl text-xs flex gap-3">
                      <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center h-8 w-8">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-150">{dl.title}</p>
                        <p className="text-[10px] text-slate-450 mt-1">Deadline Goal • {dl.subject}</p>
                      </div>
                    </div>
                  ))}

                  {/* Tasks */}
                  {todayTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs flex gap-3">
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center h-8 w-8">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-150">{t.title}</p>
                        <p className="text-[10px] text-slate-455 mt-1">Assignment Due • {t.subject}</p>
                      </div>
                    </div>
                  ))}

                  {/* Study Rooms */}
                  {todayGroups.map((g) => (
                    <div key={g.id} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-xs flex gap-3">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center h-8 w-8">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-150">{g.topic}</p>
                        <p className="text-[10px] text-slate-450 mt-1">Study session Lobby • {g.roomCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-950/15 p-3 rounded-xl border border-indigo-100/60 text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus events automatically sync with linked Google Calendar.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

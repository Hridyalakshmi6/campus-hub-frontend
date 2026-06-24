import { useEffect, useState } from "react";
import {
  useAuthStore,
  useNavigationStore,
  useTaskStore,
  useDeadlineStore,
  useAttendanceStore,
  usePlacementStore,
  useAutomationStore,
} from "../../store";
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  Clock,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Plus,
  BookOpen,
  MessageSquare,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { navigate } = useNavigationStore();
  const { tasks, fetchTasks, updateTask } = useTaskStore();
  const { deadlines, fetchDeadlines } = useDeadlineStore();
  const { attendance, fetchAttendance } = useAttendanceStore();
  const { placements, fetchPlacements } = usePlacementStore();
  const { whatsappStatus, calendarStatus, logs, fetchAutomations } = useAutomationStore();

  const [aiTip, setAiTip] = useState("");

  const aiTips = [
    "Prioritize Operating Systems process synchronization review today. Focus on mutex locks first.",
    "Your attendance in Computer Networks is close to 75%. Sit in the next 2 lectures to secure your criteria.",
    "Web Security Project is due in 4 days. Let Gemini break down your coding tasks into standard 30-minute blocks.",
    "Uber HR rounds typically highlight microservices and scaling trade-offs. Spend 15 minutes reviewing system architecture."
  ];

  useEffect(() => {
    fetchTasks();
    fetchDeadlines();
    fetchAttendance();
    fetchPlacements();
    fetchAutomations();
    
    // Pick a random student-focused AI Tip
    setAiTip(aiTips[Math.floor(Math.random() * aiTips.length)]);
  }, []);

  // Filter today's tasks & deadlines
  const activeTasks = tasks.filter((t) => t.status === "PENDING").slice(0, 3);
  const urgentDeadlines = deadlines.slice(0, 2);
  const criticalAttendance = attendance.filter((a) => a.risk === "CRITICAL" || a.risk === "WARNING");
  const activePlacements = placements.filter((p) => p.status === "INTERVIEWING" || p.status === "APPLIED").slice(0, 2);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-900 dark:via-violet-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-200 animate-pulse" />
            <span>AI Copilot Engine Synced</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight">
            Hey, {user ? user.name : "Hridya Lakshmi"}!
          </h1>
          <p className="text-sm text-indigo-100 max-w-xl">
            You are managing {tasks.filter((t) => t.status === "PENDING").length} pending items across {user?.subjects.length || 4} branches. Your Google Calendar and WhatsApp workflows are active.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto z-10">
          <button
            onClick={() => navigate("/tasks/new")}
            className="flex-1 md:flex-none bg-white text-indigo-600 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => navigate("/study-buddy")}
            className="flex-1 md:flex-none bg-indigo-500/25 border border-indigo-400/30 hover:bg-indigo-500/40 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Study Buddy</span>
          </button>
        </div>
        {/* Abstract glowing graphics */}
        <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
      </div>

      {/* 2. Bento Grid Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: Today's Tasks & Urgent Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Deadlines Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                <h2 className="font-sans font-bold text-base text-slate-900 dark:text-white">Active Deadlines</h2>
              </div>
              <button
                onClick={() => navigate("/deadlines")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <span>Timeline View</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {urgentDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No deadlines registered.</div>
            ) : (
              <div className="space-y-4">
                {urgentDeadlines.map((dl) => (
                  <div
                    key={dl.id}
                    onClick={() => navigate(`/deadlines`)}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                          {dl.subject}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {dl.title}
                        </h4>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-rose-500">{dl.dueDate}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Study goal: {dl.dailyGoal}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                        <span>Preparation Progress</span>
                        <span>{dl.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                          style={{ width: `${dl.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tasks List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                <h2 className="font-sans font-bold text-base text-slate-900 dark:text-white">Pending Tasks</h2>
              </div>
              <button
                onClick={() => navigate("/tasks")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <span>Task Manager</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {activeTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">All tasks completed! Awesome job.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {activeTasks.map((task) => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.status === "COMPLETED"}
                        onChange={() => updateTask(task.id, { status: "COMPLETED" })}
                        className="rounded h-4.5 w-4.5 text-indigo-600 border-slate-300 dark:border-slate-700 cursor-pointer focus:ring-indigo-500/20"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {task.title}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{task.subject}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      task.priority === "HIGH"
                        ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                        : "bg-slate-50 dark:bg-slate-805 text-slate-500"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: Sidebar Widgets (AI Advice, Attendance Risks, Placement Prep, Automation Center) */}
        <div className="space-y-6">
          {/* AI Tip Of The Day Widget */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-3">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h3 className="font-sans font-bold text-sm">AI Study Buddy Recommendation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
              "{aiTip || 'Review your low-attendance indices and map them on your calendar.'}"
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/study-buddy")}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Practice Course Quizzes →
              </button>
            </div>
          </div>

          {/* Attendance Safety Warning Widget */}
          {criticalAttendance.length > 0 && (
            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/20 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 mb-3">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-sans font-bold text-sm">Attendance Risk Alert</h3>
              </div>
              <div className="space-y-3">
                {criticalAttendance.map((sub) => {
                  const ratio = sub.total > 0 ? (sub.attended / sub.total) * 100 : 100;
                  return (
                    <div key={sub.id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{sub.subject}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Ratio: {sub.attended}/{sub.total} classes</p>
                      </div>
                      <span className="font-bold text-rose-500 text-sm bg-rose-500/10 px-2 py-0.5 rounded-lg">
                        {ratio.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => navigate("/attendance")}
                className="w-full mt-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Open Safety Calculator
              </button>
            </div>
          )}

          {/* Placement Progress Checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                <Award className="h-5 w-5 text-indigo-500" />
                <h3 className="font-sans font-bold text-sm">Placement Funnel</h3>
              </div>
              <button
                onClick={() => navigate("/placements")}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Full Funnel
              </button>
            </div>
            {activePlacements.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">No placements registered.</div>
            ) : (
              <div className="space-y-3">
                {activePlacements.map((p) => (
                  <div key={p.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{p.company}</span>
                      <span className="text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{p.stage}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Automation Connectivity Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Cpu className="h-5 w-5 text-indigo-500" />
              <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-white">Automation Channels</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 flex items-center space-x-1">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  <span>WhatsApp reminders</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                  {whatsappStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Google Calendar lock</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">
                  {calendarStatus === "CONNECTED" ? "ACTIVE" : "DISCONNECTED"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/automations")}
              className="w-full mt-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            >
              Open Workspace Webhooks
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Automation Webhook Logs Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-indigo-500" />
          <h2 className="font-sans font-bold text-base text-slate-900 dark:text-white">Active Automation History</h2>
        </div>
        <div className="space-y-3">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex gap-3 text-xs p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{log.workflow}</p>
                  <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-500 mt-1">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

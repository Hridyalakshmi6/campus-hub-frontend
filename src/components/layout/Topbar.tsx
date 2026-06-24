import { useState, useEffect } from "react";
import { useAuthStore, useNavigationStore, useTaskStore, useDeadlineStore, useAttendanceStore } from "../../store";
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const { navigate } = useNavigationStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { deadlines, fetchDeadlines } = useDeadlineStore();
  const { attendance, fetchAttendance } = useAttendanceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchDeadlines();
    fetchAttendance();
  }, []);

  // Assemble dynamic smart notifications based on mock server state
  const getNotifications = () => {
    const list = [];
    
    // Low attendance critical alerts
    attendance.forEach(subject => {
      const ratio = subject.total > 0 ? (subject.attended / subject.total) * 100 : 100;
      if (ratio < 75) {
        list.push({
          id: `notif-att-${subject.id}`,
          type: "danger",
          icon: AlertTriangle,
          title: "Attendance Risk Alert",
          message: `Your attendance in ${subject.subject} is ${ratio.toFixed(0)}%. You must attend the next 3 classes!`,
          time: "Just now",
          actionPath: "/attendance"
        });
      }
    });

    // Upcoming deadlines list
    deadlines.forEach(dl => {
      list.push({
        id: `notif-dl-${dl.id}`,
        type: "warning",
        icon: Calendar,
        title: "Upcoming Deadline",
        message: `${dl.title} is due on ${dl.dueDate}. Generate an AI Study Plan now.`,
        time: "1 hour ago",
        actionPath: "/deadlines"
      });
    });

    // Low priority general tasks pending
    const pendingTasks = tasks.filter(t => t.status === "PENDING" && t.priority === "HIGH");
    if (pendingTasks.length > 0) {
      list.push({
        id: "notif-task-pending",
        type: "info",
        icon: CheckCircle2,
        title: "High Priority Task Pending",
        message: `You have ${pendingTasks.length} pending high priority compiler & lab tasks.`,
        time: "Today",
        actionPath: "/tasks"
      });
    }

    return list;
  };

  const notifications = getNotifications();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sm:px-6 relative transition-colors duration-300">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-lg hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks, study guides, companies, notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden">
        {/* Title placeholder on mobile */}
        <span className="font-sans font-bold text-slate-800 dark:text-white">CampusFlow</span>
      </div>

      {/* Right Header Navigation Panel */}
      <div className="flex items-center space-x-4">
        {/* Quick Action Button - AI Study Buddy */}
        <button
          onClick={() => navigate("/study-buddy")}
          className="hidden lg:flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1.5 rounded-xl text-xs font-semibold hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>AI Study Buddy</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition-colors relative cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">Alerts & Notifications</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                  {notifications.length} Action Needed
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-400">All caught up! No notifications.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        navigate(notif.actionPath);
                        setIsNotifOpen(false);
                      }}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors flex gap-3"
                    >
                      <div className={`p-1.5 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0 ${
                        notif.type === "danger"
                          ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600"
                          : notif.type === "warning"
                          ? "bg-amber-100 dark:bg-amber-950/50 text-amber-600"
                          : "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600"
                      }`}>
                        <notif.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{notif.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  View all alerts in history
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-2 p-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {user ? user.name[0] : "H"}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden md:block">
              {user ? user.name.split(" ")[0] : "Student"}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user ? user.name : "Hridya Lakshmi"}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user ? user.email : "student@campusflow.edu"}</p>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center space-x-2 cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center space-x-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Settings</span>
                </button>
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

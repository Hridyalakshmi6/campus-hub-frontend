import { useState } from "react";
import { useNavigationStore, useThemeStore, useAuthStore } from "../../store";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  AlertTriangle,
  FileText,
  Briefcase,
  Users,
  Calendar,
  Cpu,
  User as UserIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  GraduationCap
} from "lucide-react";

export default function Sidebar() {
  const { currentPath, navigate } = useNavigationStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Tasks & Deadlines", icon: CheckSquare, path: "/tasks" },
    { label: "AI Study Buddy", icon: BookOpen, path: "/study-buddy" },
    { label: "Deadline Manager", icon: Calendar, path: "/deadlines" },
    { label: "Attendance Tracker", icon: AlertTriangle, path: "/attendance" },
    { label: "Notice Center", icon: FileText, path: "/notices" },
    { label: "Placement Prep", icon: Briefcase, path: "/placements" },
    { label: "Study Groups", icon: Users, path: "/study-groups" },
    { label: "Full Calendar", icon: Calendar, path: "/calendar" },
    { label: "Automations Center", icon: Cpu, path: "/automations" },
  ];

  const secondaryItems = [
    { label: "Profile", icon: UserIcon, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={`hidden md:flex flex-col h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
          onClick={() => navigate("/dashboard")}
        >
          <div className="bg-indigo-600 text-white p-2 rounded-xl flex-shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="font-sans text-lg font-bold tracking-tight text-white animate-fade-in whitespace-nowrap">
              Campus<span className="text-indigo-400 font-medium">Flow</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-150"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400"}`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate animate-fade-in">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-950 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-800 my-4 pt-4 space-y-1">
          {secondaryItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-150"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 truncate animate-fade-in">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Area with Theme Switcher, Student Info and Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mb-3 cursor-pointer"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-5 w-5 flex-shrink-0 text-indigo-400" />
              {!isCollapsed && <span className="ml-3 animate-fade-in">Dark Mode</span>}
            </>
          ) : (
            <>
              <Sun className="h-5 w-5 flex-shrink-0 text-amber-400" />
              {!isCollapsed && <span className="ml-3 animate-fade-in">Light Mode</span>}
            </>
          )}
        </button>

        {/* User Mini Profile & Logout */}
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center min-w-0 gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold flex-shrink-0 border border-indigo-500/10">
              {user ? user.name[0] : "H"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user ? user.name : "Student"}</p>
                <p className="text-xs text-slate-500 truncate">{user ? user.branch : "Computer Science"}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-850 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

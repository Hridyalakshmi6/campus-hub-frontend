import { LayoutDashboard, CheckSquare, BookOpen, FileText, User } from "lucide-react";
import { useNavigationStore } from "../../store";

export default function MobileNav() {
  const { currentPath, navigate } = useNavigationStore();

  const tabs = [
    { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "AI Buddy", icon: BookOpen, path: "/study-buddy" },
    { label: "Notices", icon: FileText, path: "/notices" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 pb-safe z-40 transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path || currentPath.startsWith(tab.path + "/");
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <tab.icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

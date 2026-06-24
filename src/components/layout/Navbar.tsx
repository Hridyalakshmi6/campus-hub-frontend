import { GraduationCap, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigationStore } from "../../store";

export default function Navbar() {
  const { currentPath, navigate } = useNavigationStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="h-6 w-6" id="logo-icon" />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-indigo-600 dark:text-indigo-400 font-medium">Flow</span>
              </span>
            </div>
            <div className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all cursor-pointer ${
                    currentPath === item.path
                      ? "border-indigo-600 dark:border-indigo-400 text-slate-900 dark:text-white"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-200">
          <div className="pt-2 pb-4 px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-xl text-base font-medium ${
                  currentPath === item.path
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4 flex flex-col space-y-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium text-base"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white text-center py-2.5 rounded-xl font-medium text-base shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

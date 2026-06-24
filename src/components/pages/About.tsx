import { GraduationCap, Github, Code, Globe, Shield } from "lucide-react";
import { useNavigationStore } from "../../store";

export default function About() {
  const { navigate } = useNavigationStore();

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-2xl w-fit mx-auto text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
            Our Mission & Vision
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            CampusFlow was built with a single goal: to empower college students. We streamline fragmented announcement portals, complex course timetables, and placement checklist guidelines into a unified dashboard powered by Gemini AI and automated workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
              <Code className="h-5 w-5" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Student First Architecture</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Designed from first-hand frustrations with manual datesheet copies and calendar overlays. We provide automated calendar syncing and direct WhatsApp alerts so you never miss a submission grade again.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <Shield className="h-5 w-5" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Secure Integrations</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              We leverage safe API connections to link Google Calendar. Your login data is secure, sandboxed, and optimized for private student storage.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-slate-100 dark:border-slate-900 pt-12">
          <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-white">Connect & Collaborate</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
            CampusFlow is open source and built to serve university departments and student communities. Connect with our core maintainers.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <a href="#" className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
              <Github className="h-4 w-4" />
              <span>GitHub Org</span>
            </a>
            <a href="#" className="flex items-center space-x-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md">
              <Globe className="h-4 w-4" />
              <span>Developer API Docs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

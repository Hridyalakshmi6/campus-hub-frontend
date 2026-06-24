import { GraduationCap, ArrowRight, Sparkles, CheckCircle2, Cpu, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { useNavigationStore } from "../../store";

export default function Landing() {
  const { navigate } = useNavigationStore();

  const benefits = [
    { title: "AI Study Plans", desc: "Get adaptive daily timelines matched to your deadlines.", icon: Sparkles, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { title: "WhatsApp Sync", desc: "Get attendance and test reminders directly on WhatsApp.", icon: MessageSquare, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Google Calendar", desc: "Instantly lock exam notice events into your calendar.", icon: Calendar, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    { title: "Risk Alerter", desc: "Never slide below 75%. Calculate exactly which lectures to attend.", icon: AlertCircle, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden border-b border-slate-100 dark:border-slate-900">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[70px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in border border-indigo-100 dark:border-indigo-900/20">
            <Sparkles className="h-3 w-3" />
            <span>AI-Driven Campus Assistant</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight md:leading-none">
            Streamline your student life with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:to-violet-400">
              CampusFlow
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The intelligent, full-stack student workspace that automates study guides, coordinates calendar schedules, tracks placement prep, and sends smart alerts to make you excel.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Launch Your Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/features")}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 px-8 py-3.5 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Explore Features</span>
            </button>
          </div>

          {/* Interactive Feature Cards Hero Preview */}
          <div className="mt-16 relative rounded-2xl border border-slate-200 dark:border-slate-800 p-2 bg-slate-100/40 dark:bg-slate-900/40 max-w-5xl mx-auto shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-950 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <div className="h-2 w-12 bg-indigo-500 rounded-full" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Attendance Safety</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Calculates exactly which lectures to sit for based on dynamic 75% guidelines.</p>
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-2.5 rounded-lg text-[10px] text-rose-600 dark:text-rose-400 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Critical Risk: Networks attendance is 60%. Need 3 lectures.</span>
                </div>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-850 pt-4 md:pt-0 md:pl-6">
                <div className="h-2 w-12 bg-indigo-500 rounded-full" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Study Buddy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pasted board notes instantly convert to interactive smart flashcards and MCQ practice tests.</p>
                <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-2.5 rounded-lg text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>⚡ Notes tokenized!</span>
                  <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate("/study-buddy")}>Practice Quiz →</span>
                </div>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-850 pt-4 md:pt-0 md:pl-6">
                <div className="h-2 w-12 bg-indigo-500 rounded-full" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Workflow Status</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Durable calendar syncing, notice scraping webhooks and dispatch alerts logs.</p>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-lg text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>WhatsApp automation workflow: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built For Modern Students
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Automating tedious campus notice boards and calendar entries so you focus purely on studying, learning, and landing that placement offer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              <div>
                <div className={`p-3 rounded-xl w-fit ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-4">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust banner */}
      <section className="bg-indigo-600 dark:bg-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold">Unclutter Your College Schedules Today</h2>
          <p className="mt-4 text-slate-100 text-sm sm:text-base max-w-xl mx-auto">
            Get instant onboarding for your course year and subjects. No setup required.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-8 bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            Create Your Account
          </button>
        </div>
      </section>
    </div>
  );
}

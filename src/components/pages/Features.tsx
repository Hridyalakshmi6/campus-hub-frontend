import { Sparkles, MessageSquare, Calendar, ShieldCheck, Cpu, Clock, Award, BookOpen } from "lucide-react";
import { useNavigationStore } from "../../store";

export default function Features() {
  const { navigate } = useNavigationStore();

  const list = [
    {
      title: "AI Study Buddy",
      desc: "Paste notes from your phone or laptop. CampusFlow tokenizes and drafts custom flashcards or interactive self-test quizzes in seconds with immediate scoring and explanations.",
      icon: Sparkles,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Smart Deadline Tracker",
      desc: "Add deadlines. Let Gemini calculate a step-by-step custom daily preparation plan. Toggle automatic Calendar locks and dynamic push reminders.",
      icon: Calendar,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Attendance Safety Index",
      desc: "Quickly track lecture attended/total counts. Receive a calculated warning index telling you exactly how many lectures are required to meet your 75% bar.",
      icon: Clock,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      title: "Notice Summarizer & WhatsApp Broadcaster",
      desc: "Paste raw announcements from WhatsApp boards or portal bulletins. AI extracts core schedules, provides clean WhatsApp broadcast copies, and exports calendar slots.",
      icon: MessageSquare,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Placement Stage Prep Tracker",
      desc: "Track company applications, interview rounds, and prepare with customized stage-by-stage AI prep feedback and recommended learning modules.",
      icon: Award,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
    },
    {
      title: "Study Group Matchmaker",
      desc: "Coordinate joint study sessions. Match available calendars with other students from your subject classes seamlessly and view schedules on joint room calendars.",
      icon: BookOpen,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
    }
  ];

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Unleash Productive Learning Automation
          </h1>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
            Engineered exclusively to clear administrative campus clutter. Manage exams, check attendance safety, practice mock interviews, and organize class timetables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((feat, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className={`p-3 rounded-xl w-fit ${feat.color}`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mt-6">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/80 text-center max-w-4xl mx-auto">
          <h3 className="font-sans font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">Durable n8n & Google Calendar Automation Center</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Our background workflows link your calendar and phone seamlessly. Set reminder limits, receive notice updates directly, and dispatch class broadcasts dynamically.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md cursor-pointer"
          >
            Launch CampusFlow Now
          </button>
        </div>
      </div>
    </div>
  );
}

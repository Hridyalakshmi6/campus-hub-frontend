import { useState } from "react";
import { Bell, Sparkles, MessageSquare, AlertTriangle, Calendar, Check } from "lucide-react";

export default function Notifications() {
  const [items, setItems] = useState([
    {
      id: "1",
      title: "Notice Summarized",
      desc: "Raw notice 'Midterm Datesheet Release' tokenized into bullet points.",
      time: "2 hours ago",
      type: "AI",
      unread: true,
    },
    {
      id: "2",
      title: "Attendance Danger Alerter",
      desc: "Computer Networks has dropped to 60%. Restoring the safety index requires sitting in the next 3 consecutive lectures.",
      time: "1 day ago",
      type: "ALERT",
      unread: true,
    },
    {
      id: "3",
      title: "Study Group Lobby Ready",
      desc: "Your Peer Review Study Session on 'Compiler LL(1) parsers' is starting in 30 minutes. Join with lobby ROOM-109.",
      time: "2 days ago",
      type: "GROUP",
      unread: false,
    },
  ]);

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, unread: false })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Browse recent campus alerts, study group triggers, and AI study buddy logs.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex gap-4 transition-all ${
                item.unread
                  ? "border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/20"
                  : "border-slate-100 dark:border-slate-850"
              }`}
            >
              <div className={`p-2.5 rounded-xl h-fit ${
                item.type === "AI"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : item.type === "ALERT"
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
              }`}>
                {item.type === "AI" ? (
                  <Sparkles className="h-5 w-5" />
                ) : item.type === "ALERT" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <span>{item.title}</span>
                    {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                  </h4>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

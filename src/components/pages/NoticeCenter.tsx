import React, { useState, useEffect } from "react";
import { useNoticeStore, useAutomationStore } from "../../store";
import { Sparkles, RefreshCw, MessageSquare, Calendar, ChevronRight, FileText, Check } from "lucide-react";

export default function NoticeCenter() {
  const { notices, loading, aiLoading, fetchNotices, summarizeNotice } = useNoticeStore();
  const { triggerNoticeWebhook } = useAutomationStore();

  const [title, setTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText) return;
    await summarizeNotice(title || "Bulletin Update", noticeText);
    setTitle("");
    setNoticeText("");
  };

  const handleCopyBroadcast = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerBroadcast = async (noticeTitle: string) => {
    await triggerNoticeWebhook(noticeTitle);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Notice Summarizer & Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Paste announcements from college bulletins to instantly summarize, extract schedules, and broadcast to student channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT FORM PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">
              Scrape Portal Announcement
            </h3>

            <form onSubmit={handleSummarize} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Notice Label / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Datesheet Released"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Raw Portal Text
                </label>
                <textarea
                  required
                  placeholder="Paste raw email notice, portal bullet text, or unstructured datesheet lines here..."
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={aiLoading || !noticeText}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-50 transition-colors cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    <span>Gemini is scraping notice elements...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Summarize notice with AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT BOARD: Notice Summaries History Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-6">
              Bulletin Summary & Broadcast Feed
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
              </div>
            ) : notices.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No bulletin summaries generated yet. Paste raw text on the left form to synthesize.
              </div>
            ) : (
              <div className="space-y-8 max-h-[550px] overflow-y-auto pr-1">
                {notices.map((n) => (
                  <div key={n.id} className="space-y-4 border-b border-slate-100 dark:border-slate-850 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Processed on: {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTriggerBroadcast(n.title)}
                        className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold hover:scale-[1.02] cursor-pointer"
                      >
                        Trigger WhatsApp Broadcast
                      </button>
                    </div>

                    {/* AI bullet summary */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        AI Bullet Takeaways
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                        {n.summary}
                      </div>
                    </div>

                    {/* WhatsApp copy template */}
                    {n.broadcastMessage && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            WhatsApp Group Copy
                          </p>
                          <button
                            onClick={() => handleCopyBroadcast(n.id, n.broadcastMessage)}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                          >
                            {copiedId === n.id ? (
                              <span className="flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                Copied!
                              </span>
                            ) : (
                              "Copy Template Text"
                            )}
                          </button>
                        </div>
                        <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line font-mono">
                          {n.broadcastMessage}
                        </div>
                      </div>
                    )}

                    {/* Extracted calendar events list */}
                    {n.extractedEvents && n.extractedEvents.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Extracted Calendar Events
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {n.extractedEvents.map((evt, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-805 rounded-xl text-xs flex gap-3"
                            >
                              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 h-8 w-8">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 dark:text-slate-250 truncate">{evt.title}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {evt.date} {evt.time ? `• ${evt.time}` : ""}
                                </p>
                                {evt.location && (
                                  <p className="text-[10px] text-slate-450 mt-0.5 truncate">
                                    Loc: {evt.location}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

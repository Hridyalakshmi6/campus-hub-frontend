import React, { useState, useEffect } from "react";
import { useStudyGroupStore, useAuthStore } from "../../store";
import { Plus, Users, Calendar, Video, CheckCircle, RefreshCw, Layers } from "lucide-react";

export default function StudyGroups() {
  const { groups, loading, fetchGroups, createGroup, joinGroup } = useStudyGroupStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Compiler Design");
  const [date, setDate] = useState("2026-06-25");
  const [time, setTime] = useState("15:00");
  const [roomCode, setRoomCode] = useState("ROOM-404");

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    await createGroup({
      topic,
      subject,
      date,
      time,
      host: user?.name || "Hridya Lakshmi",
      slotsLeft: 4,
      roomCode: roomCode || `ROOM-${Math.floor(100 + Math.random() * 900)}`,
    });
    setTopic("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Study Group Scheduler
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
            Coordinate subject-wise study rooms and synchronize calendars with class peers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Organize Session</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
          <Users className="h-5 w-5 text-indigo-500" />
          <span>Active Peer Review Slots</span>
        </h3>

        {loading ? (
          <div className="py-12 flex justify-center">
            <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
          </div>
        ) : groups.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No study rooms schedule active. Set up a classroom review slot.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => {
              const isJoined = group.members.includes(user?.name || "");
              return (
                <div
                  key={group.id}
                  className="p-6 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 px-2 py-0.5 rounded-full font-bold">
                        {group.subject}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{group.members.length} members</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-150 leading-tight">
                        {group.topic}
                      </h4>
                      <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                        <p className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {group.date} • {group.time}
                          </span>
                        </p>
                        <p className="flex items-center space-x-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                          <Video className="h-3.5 w-3.5" />
                          <span>Lobby: {group.roomCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Attendee List:</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed truncate">
                        {group.members.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                    {isJoined ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center space-x-1.5">
                        <CheckCircle className="h-4 w-4" />
                        <span>Seat Confirmed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => joinGroup(group.id, user?.name || "Anonymous Friend")}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Join Review Session
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-6">Host Study Room</h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Session Study Goal / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & DFS trees review"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Subject Class
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {user?.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )) || (
                    <>
                      <option value="Compiler Design">Compiler Design</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Computer Networks">Computer Networks</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Virtual Lobby Code / Room Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. ROOM-789 or custom zoom URL"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                >
                  Organize Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

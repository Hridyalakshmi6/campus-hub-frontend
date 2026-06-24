import React, { useState } from "react";
import { useAuthStore } from "../../store";
import { User, BookOpen, Plus, Tag, X, Save, CheckCircle } from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuthStore();

  const [name, setName] = useState(user?.name || "Hridya Lakshmi");
  const [email, setEmail] = useState(user?.email || "hridyalakshmipm6@gmail.com");
  const [branch, setBranch] = useState(user?.branch || "Computer Science & Engineering");
  const [year, setYear] = useState(user?.year || "3rd Year");
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || "+919876543210");
  const [subjects, setSubjects] = useState<string[]>(
    user?.subjects || ["Compiler Design", "Operating Systems", "Computer Networks", "Software Engineering"]
  );

  const [newSubject, setNewSubject] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSubject = () => {
    if (!newSubject) return;
    if (subjects.includes(newSubject)) {
      setNewSubject("");
      return;
    }
    setSubjects([...subjects, newSubject]);
    setNewSubject("");
  };

  const handleRemoveSubject = (tag: string) => {
    setSubjects(subjects.filter((sub) => sub !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    useAuthStore.setState({
      user: {
        name,
        email,
        branch,
        year,
        whatsapp,
        subjects,
        googleLinked: user?.googleLinked || false,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Student Profile Onboarding
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Update your academic branch, customize tracked subjects, and coordinate notification routes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Form details (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            {saveSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Profile updated successfully! Subjects synced across widgets.</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Academic Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Engineering Branch Major
                  </label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Active Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    WhatsApp Automation Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Save className="h-4.5 w-4.5" />
                <span>Save Student Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Academic Tag Manager (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850 mb-4 flex items-center space-x-1.5">
                <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                <span>Manage Course Subjects</span>
              </h3>

              <div className="space-y-4">
                <p className="text-xs text-slate-450 leading-relaxed">
                  These subjects map automatic class listings and assignment tags. Add or remove tags to tailor dashboard dropdown menus.
                </p>

                {/* Subject tag input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Database Systems"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={handleAddSubject}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Display active tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {subjects.map((sub) => (
                    <div
                      key={sub}
                      className="inline-flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 text-xs text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium"
                    >
                      <Tag className="h-3 w-3 text-slate-400" />
                      <span>{sub}</span>
                      <button
                        onClick={() => handleRemoveSubject(sub)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-6 text-[10px] text-slate-450 leading-relaxed">
              * Note: Editing these lists will update all corresponding active dropdown modules on task planners, study buddies, and safety trackers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

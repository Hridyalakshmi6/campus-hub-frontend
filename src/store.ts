import { create } from "zustand";
import {
  User,
  Task,
  Deadline,
  AttendanceSubject,
  Notice,
  Placement,
  StudyGroupSession,
  AutomationLog,
  AutomationConfig,
} from "./types";

// ==========================================
// 1. NAVIGATION STORE (HASH ROUTING)
// ==========================================
interface NavigationState {
  currentPath: string;
  params: Record<string, string>;
  navigate: (path: string, params?: Record<string, string>) => void;
}

export const useNavigationStore = create<NavigationState>((set) => {
  // Parse initial hash or default to "/"
  const getHashPath = () => {
    const hash = window.location.hash || "#/";
    return hash.substring(1).split("?")[0];
  };

  return {
    currentPath: getHashPath(),
    params: {},
    navigate: (path, params = {}) => {
      window.location.hash = `#${path}`;
      set({ currentPath: path, params });
    },
  };
});

// Update navigation path on window hash change
window.addEventListener("hashchange", () => {
  const hash = window.location.hash || "#/";
  const path = hash.substring(1).split("?")[0];
  useNavigationStore.setState({ currentPath: path });
});

// ==========================================
// 2. THEME STORE (LIGHT/DARK)
// ==========================================
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem("campusflow-theme");
  const initialTheme = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

  if (initialTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        localStorage.setItem("campusflow-theme", nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return { theme: nextTheme };
      }),
  };
});

// ==========================================
// 3. AUTH STORE
// ==========================================
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string, branch: string, year: string, whatsapp: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: "Hridya Lakshmi",
    email: "student@campusflow.edu",
    branch: "Computer Science & Engineering",
    year: "3rd Year",
    whatsapp: "+919876543210",
    subjects: ["Compiler Design", "Operating Systems", "Computer Networks", "Software Engineering"],
    googleLinked: true,
  },
  token: "dummy-token",
  loading: false,
  error: null,
  login: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
  register: async (name, email, branch, year, whatsapp) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, branch, year, whatsapp }),
      });
      const data = await res.json();
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
  logout: () => {
    set({ user: null, token: null });
  },
  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const user = await res.json();
      set({ user });
    } catch (err) {}
  },
  updateUser: (fields) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...fields } : null,
    }));
  },
}));

// ==========================================
// 4. TASK STORE
// ==========================================
interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "status">) => Promise<void>;
  updateTask: (id: string, fields: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  addTask: async (task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      set({ tasks: [newTask, ...get().tasks] });
    } catch (err) {}
  },
  updateTask: async (id, fields) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const updated = await res.json();
      set({
        tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
      });
    } catch (err) {}
  },
  deleteTask: async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } catch (err) {}
  },
}));

// ==========================================
// 5. DEADLINE STORE
// ==========================================
interface DeadlineState {
  deadlines: Deadline[];
  loading: boolean;
  aiLoading: boolean;
  fetchDeadlines: () => Promise<void>;
  addDeadline: (deadline: Omit<Deadline, "id" | "progress" | "dailyGoal" | "studyPlan">) => Promise<void>;
  updateDeadline: (id: string, fields: Partial<Deadline>) => Promise<void>;
  generateStudyPlan: (id: string) => Promise<void>;
}

export const useDeadlineStore = create<DeadlineState>((set, get) => ({
  deadlines: [],
  loading: false,
  aiLoading: false,
  fetchDeadlines: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/deadlines");
      const data = await res.json();
      set({ deadlines: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  addDeadline: async (deadline) => {
    try {
      const res = await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deadline),
      });
      const newDeadline = await res.json();
      set({ deadlines: [newDeadline, ...get().deadlines] });
    } catch (err) {}
  },
  updateDeadline: async (id, fields) => {
    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const updated = await res.json();
      set({
        deadlines: get().deadlines.map((d) => (d.id === id ? updated : d)),
      });
    } catch (err) {}
  },
  generateStudyPlan: async (id) => {
    set({ aiLoading: true });
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const updatedDeadline = await res.json();
      set({
        deadlines: get().deadlines.map((d) => (d.id === id ? updatedDeadline : d)),
        aiLoading: false,
      });
    } catch (err) {
      set({ aiLoading: false });
    }
  },
}));

// ==========================================
// 6. ATTENDANCE STORE
// ==========================================
interface AttendanceState {
  attendance: AttendanceSubject[];
  loading: boolean;
  fetchAttendance: () => Promise<void>;
  logAttendance: (subject: string, attended: number, total: number) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendance: [],
  loading: false,
  fetchAttendance: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      set({ attendance: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  logAttendance: async (subject, attended, total) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, attended, total }),
      });
      const data = await res.json();
      const exists = get().attendance.some((a) => a.id === data.id);
      if (exists) {
        set({
          attendance: get().attendance.map((a) => (a.id === data.id ? data : a)),
        });
      } else {
        set({ attendance: [...get().attendance, data] });
      }
    } catch (err) {}
  },
}));

// ==========================================
// 7. NOTICE CENTER STORE
// ==========================================
interface NoticeState {
  notices: Notice[];
  loading: boolean;
  aiLoading: boolean;
  fetchNotices: () => Promise<void>;
  summarizeNotice: (title: string, originalText: string) => Promise<void>;
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
  notices: [],
  loading: false,
  aiLoading: false,
  fetchNotices: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      set({ notices: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  summarizeNotice: async (title, originalText) => {
    set({ aiLoading: true });
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, noticeText: originalText }),
      });
      const data = await res.json();
      set({ notices: [data, ...get().notices], aiLoading: false });
    } catch (err) {
      set({ aiLoading: false });
    }
  },
}));

// ==========================================
// 8. PLACEMENT STORE
// ==========================================
interface PlacementState {
  placements: Placement[];
  loading: boolean;
  aiLoading: boolean;
  fetchPlacements: () => Promise<void>;
  addPlacement: (placement: Omit<Placement, "id" | "aiAdvice">) => Promise<void>;
  updatePlacement: (id: string, fields: Partial<Placement>) => Promise<void>;
  generatePrepTips: (id: string) => Promise<void>;
}

export const usePlacementStore = create<PlacementState>((set, get) => ({
  placements: [],
  loading: false,
  aiLoading: false,
  fetchPlacements: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/placements");
      const data = await res.json();
      set({ placements: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  addPlacement: async (placement) => {
    try {
      const res = await fetch("/api/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placement),
      });
      const newPlacement = await res.json();
      set({ placements: [newPlacement, ...get().placements] });
    } catch (err) {}
  },
  updatePlacement: async (id, fields) => {
    try {
      const res = await fetch(`/api/placements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const updated = await res.json();
      set({
        placements: get().placements.map((p) => (p.id === id ? updated : p)),
      });
    } catch (err) {}
  },
  generatePrepTips: async (id) => {
    set({ aiLoading: true });
    try {
      const res = await fetch("/api/ai/placement-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const updated = await res.json();
      set({
        placements: get().placements.map((p) => (p.id === id ? updated : p)),
        aiLoading: false,
      });
    } catch (err) {
      set({ aiLoading: false });
    }
  },
}));

// ==========================================
// 9. STUDY GROUP STORE
// ==========================================
interface StudyGroupState {
  sessions: StudyGroupSession[];
  groups: StudyGroupSession[];
  loading: boolean;
  fetchSessions: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  createSession: (session: Omit<StudyGroupSession, "id" | "members">) => Promise<void>;
  createGroup: (session: Omit<StudyGroupSession, "id" | "members">) => Promise<void>;
  joinSession: (id: string, studentName: string) => Promise<void>;
  joinGroup: (id: string, studentName: string) => Promise<void>;
}

export const useStudyGroupStore = create<StudyGroupState>((set, get) => ({
  sessions: [],
  groups: [],
  loading: false,
  fetchSessions: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/study-groups");
      const data = await res.json();
      set({ sessions: data, groups: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },
  fetchGroups: async () => {
    return get().fetchSessions();
  },
  createSession: async (session) => {
    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
      const newGroup = await res.json();
      const updatedList = [newGroup, ...get().sessions];
      set({ sessions: updatedList, groups: updatedList });
    } catch (err) {}
  },
  createGroup: async (session) => {
    return get().createSession(session);
  },
  joinSession: async (id, studentName) => {
    try {
      const res = await fetch(`/api/study-groups/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName }),
      });
      const updated = await res.json();
      const updatedList = get().sessions.map((s) => (s.id === id ? updated : s));
      set({
        sessions: updatedList,
        groups: updatedList,
      });
    } catch (err) {}
  },
  joinGroup: async (id, studentName) => {
    return get().joinSession(id, studentName);
  },
}));

// ==========================================
// 10. AUTOMATION STORE
// ==========================================
interface AutomationState {
  whatsappStatus: "ACTIVE" | "INACTIVE";
  calendarStatus: "CONNECTED" | "DISCONNECTED";
  deadlineScraperWebhook: string;
  noticeScraperWebhook: string;
  logs: AutomationLog[];
  loading: boolean;
  fetchAutomations: () => Promise<void>;
  toggleWhatsapp: () => Promise<void>;
  toggleCalendar: () => Promise<void>;
  triggerDeadlineWebhook: (title?: string, whatsapp?: string) => Promise<void>;
  triggerNoticeWebhook: (title?: string) => Promise<void>;
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  whatsappStatus: "ACTIVE",
  calendarStatus: "CONNECTED",
  deadlineScraperWebhook: "https://n8n.campusflow.edu/webhook/dispatched-deadlines",
  noticeScraperWebhook: "https://n8n.campusflow.edu/webhook/scraped-notice",
  logs: [],
  loading: false,
  fetchAutomations: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/automations");
      const data = await res.json();
      set({
        whatsappStatus: data.whatsappStatus,
        calendarStatus: data.calendarStatus,
        logs: data.logs,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },
  toggleWhatsapp: async () => {
    const nextStatus = get().whatsappStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    set({ whatsappStatus: nextStatus });
  },
  toggleCalendar: async () => {
    const nextStatus = get().calendarStatus === "CONNECTED" ? "DISCONNECTED" : "CONNECTED";
    set({ calendarStatus: nextStatus });
  },
  triggerDeadlineWebhook: async (title = "Midterm Preparation", whatsapp = "+919876543210") => {
    try {
      await fetch("/api/n8n/deadline-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadlineTitle: title, studentWhatsapp: whatsapp }),
      });
      get().fetchAutomations();
    } catch (err) {}
  },
  triggerNoticeWebhook: async (title = "General Notice Release") => {
    try {
      await fetch("/api/n8n/notice-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeTitle: title }),
      });
      get().fetchAutomations();
    } catch (err) {}
  },
}));

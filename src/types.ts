export interface User {
  name: string;
  email: string;
  branch: string;
  year: string;
  whatsapp: string;
  subjects: string[];
  googleLinked: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  reminderTime: string;
  addToCalendar: boolean;
  whatsappReminder: boolean;
  status: "PENDING" | "COMPLETED";
}

export interface StudyPlanPhase {
  phaseName: string;
  duration: string;
  tasks: string[];
}

export interface StudyPlan {
  overview: string;
  dailyStudyGoal: string;
  timeline: StudyPlanPhase[];
}

export interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  progress: number; // percentage
  dailyGoal: string;
  studyPlan: StudyPlan | null;
}

export interface AttendanceSubject {
  id: string;
  subject: string;
  attended: number;
  total: number;
  risk: "SAFE" | "WARNING" | "CRITICAL";
}

export interface ExtractedEvent {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

export interface Notice {
  id: string;
  title: string;
  originalText: string;
  summary: string;
  broadcastMessage: string;
  extractedEvents: ExtractedEvent[];
  createdAt: string;
}

export interface Placement {
  id: string;
  company: string;
  role: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED";
  stage: string;
  nextEvent: string | null;
  aiAdvice: string;
  prepTips?: {
    recommendedTopics: string[];
    difficulty: string;
    questions: { topic: string; questionText: string; conceptRequired: string }[];
  };
}

export interface StudyGroupSession {
  id: string;
  subject: string;
  topic: string;
  host: string;
  date: string;
  time: string;
  members: string[];
  slotsLeft: number;
  roomCode: string;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  workflow: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  message: string;
}

export interface AutomationConfig {
  whatsappStatus: "ACTIVE" | "INACTIVE";
  calendarStatus: "CONNECTED" | "DISCONNECTED";
  logs: AutomationLog[];
}

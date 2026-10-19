export type TaskCategory =
  | 'Personal'
  | 'Household'
  | 'Children'
  | 'Tuition Academy'
  | 'Power BI'
  | 'Data Analytics'
  | 'AI Automation'
  | 'Job Search'
  | 'Client Outreach'
  | 'Social Media'
  | 'Rest';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Postponed';

export type WeatherSensitivity = 'Weather Sensitive' | 'Indoor Alternative Available' | 'Flexible' | 'Fixed';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  startTime: string; // "08:00"
  endTime: string;   // "08:30"
  priority: TaskPriority;
  estimatedDuration: number; // in minutes
  notes?: string;
  isRecurring?: boolean;
  recurringDays?: string[];
  completed: boolean;
  completedAt?: string;
  status: TaskStatus;
  isFixed?: boolean;
  weatherSensitivity?: WeatherSensitivity;
  reminder?: boolean;
  date: string; // YYYY-MM-DD
}

export type ProjectPhase =
  | 'Requirements'
  | 'Data Collection'
  | 'Data Cleaning'
  | 'Data Modeling'
  | 'DAX Measures'
  | 'Dashboard Design'
  | 'Validation'
  | 'Business Insights'
  | 'Documentation'
  | 'Portfolio Publication';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface PhaseItem {
  id: string;
  name: ProjectPhase | string;
  completed: boolean;
  tasks: Subtask[];
}

export interface WorkSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  notes: string;
}

export interface PowerBIProject {
  id: string;
  name: string;
  description: string;
  startDate: string;
  targetDate: string;
  currentPhase: string;
  plannedHours: number;
  actualHours: number;
  notes: string;
  status: 'Active' | 'In Review' | 'Completed' | 'Paused';
  portfolioStatus: 'Draft' | 'Published' | 'Under Review';
  phases: PhaseItem[];
  sessions: WorkSession[];
}

export interface AILearningChecklist {
  attendLiveClass: boolean;
  writeClassNotes: boolean;
  implementLearned: boolean;
  testResult: boolean;
  saveArtifact: boolean;
  publishDocumentation: boolean;
}

export interface AILearningRecord {
  id: string;
  date: string;
  topic: string;
  classNotes: string;
  keyConcepts: string[];
  practicalExercise: string;
  checklist: AILearningChecklist;
  practiceMinutes: number;
  resourceLinks: Array<{ title: string; url: string }>;
  completed: boolean;
  completedAt?: string;
}

export type JobStatus =
  | 'Saved'
  | 'To Apply'
  | 'Applied'
  | 'Interview'
  | 'Follow Up'
  | 'Rejected'
  | 'Closed';

export interface JobRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  datePosted?: string;
  deadline?: string;
  experienceReq: string;
  requiredSkills: string[];
  applicationUrl: string;
  dateDiscovered: string;
  status: JobStatus;
  notes: string;
  isVerifiedRemote: boolean;
  appliedDate?: string;
}

export type OutreachStatus =
  | 'Draft'
  | 'Sent'
  | 'Follow-up Scheduled'
  | 'Replied'
  | 'Closed';

export interface OutreachContact {
  id: string;
  contactName: string;
  company: string;
  role: string;
  verifiedEmail: string;
  relevantNeed: string;
  personalizationNotes: string;
  subject: string;
  body: string;
  followUpDate?: string;
  status: OutreachStatus;
  sentAt?: string;
}

export type SocialPlatform = 'LinkedIn' | 'Facebook' | 'Instagram' | 'Other';
export type SocialPostStatus = 'Idea' | 'Draft' | 'Ready' | 'Published';

export interface SocialMediaPost {
  id: string;
  topic: string;
  platform: SocialPlatform;
  postType:
    | 'Project showcase'
    | 'Power BI dashboard'
    | 'Excel tips'
    | 'Before-and-after data cleaning'
    | 'AI Automation learning'
    | 'Portfolio announcement'
    | 'Freelance service';
  caption: string;
  hashtags: string;
  attachmentNote?: string;
  plannedDate: string;
  status: SocialPostStatus;
  relatedProjectId?: string;
  publishedUrl?: string;
}

export type HouseholdCategory =
  | 'Cooking'
  | "Children's meals"
  | 'Laundry'
  | 'Cleaning'
  | 'Kitchen organization'
  | 'Tuition preparation'
  | 'Household errands';

export interface HouseholdTask {
  id: string;
  title: string;
  category: HouseholdCategory;
  frequency: 'Daily' | 'Weekly' | 'Selected Days';
  selectedDays?: string[];
  estimatedDuration: number;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  completedAt?: string;
  weatherSensitivity: WeatherSensitivity;
  notes?: string;
}

export interface WeeklyGoal {
  id: string;
  weekStartDate: string; // YYYY-MM-DD (Monday)
  powerBIHoursTarget: number;
  aiLearningHoursTarget: number;
  jobApplicationsTarget: number;
  outreachEmailsTarget: number;
  socialPostsTarget: number;
  sleepHoursTarget: number;
  reviewWhatWentWell: string;
  reviewUnfinished: string;
  reviewProjectProgress: string;
  reviewNextWeekPriority: string;
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  hours: number;
  notes?: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  lastUpdated: string;
  hourly: Array<{
    time: string;
    temp: number;
    code: number;
    pop: number;
  }>;
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    code: number;
    popMax: number;
  }>;
  isLoading: boolean;
  error?: string;
}

export type NavigationPage =
  | 'today'
  | 'planner'
  | 'powerbi'
  | 'learning'
  | 'home'
  | 'jobs'
  | 'social'
  | 'weather'
  | 'progress'
  | 'settings';

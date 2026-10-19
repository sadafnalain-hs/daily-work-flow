import {
  Task,
  PowerBIProject,
  AILearningRecord,
  JobRecord,
  OutreachContact,
  SocialMediaPost,
  HouseholdTask,
  WeeklyGoal,
  SleepLog,
} from '../types';

// Helper for today's date formatted as YYYY-MM-DD in Asia/Karachi
export function getKarachiTodayDate(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

const today = getKarachiTodayDate();

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: "Morning routine, getting ready, and reviewing today's plan",
    category: 'Personal',
    startTime: '08:00',
    endTime: '08:30',
    priority: 'Medium',
    estimatedDuration: 30,
    notes: 'Gratitude, hydration, and review LifeFlow AI priorities',
    completed: true,
    completedAt: `${today}T08:25:00`,
    status: 'Completed',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-2',
    title: "Breakfast, children's needs, and essential household responsibilities",
    category: 'Children',
    startTime: '08:30',
    endTime: '10:00',
    priority: 'High',
    estimatedDuration: 90,
    notes: 'Prepare healthy breakfast and check school assignments',
    completed: true,
    completedAt: `${today}T09:55:00`,
    status: 'Completed',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Indoor Alternative Available',
    date: today,
  },
  {
    id: 'task-3',
    title: 'Focused Power BI project work: Urban Mart portfolio',
    category: 'Power BI',
    startTime: '10:00',
    endTime: '12:00',
    priority: 'High',
    estimatedDuration: 120,
    notes: 'Deep work block: build DAX measures for Year-over-Year sales growth and inventory turnover',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Indoor Alternative Available',
    date: today,
  },
  {
    id: 'task-4',
    title: 'Break and personal time',
    category: 'Rest',
    startTime: '12:00',
    endTime: '12:30',
    priority: 'Low',
    estimatedDuration: 30,
    notes: 'Stretching, green tea, step away from screens',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-5',
    title: 'Search for remote jobs and shortlist two suitable opportunities',
    category: 'Job Search',
    startTime: '12:30',
    endTime: '13:30',
    priority: 'High',
    estimatedDuration: 60,
    notes: 'Target: Remote Junior Data Analyst / Power BI roles accepting Pakistan candidates',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-6',
    title: 'Lunch and preparation for tuition',
    category: 'Personal',
    startTime: '13:30',
    endTime: '14:15',
    priority: 'Medium',
    estimatedDuration: 45,
    notes: 'Wholesome lunch with family before afternoon classes',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-7',
    title: 'Prepare two personalized outreach emails for prospective clients or recruiters',
    category: 'Client Outreach',
    startTime: '14:15',
    endTime: '14:45',
    priority: 'High',
    estimatedDuration: 30,
    notes: 'Write tailored notes highlighting portfolio dashboard links',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-8',
    title: 'Prepare the tuition teaching materials',
    category: 'Tuition Academy',
    startTime: '14:45',
    endTime: '15:00',
    priority: 'Medium',
    estimatedDuration: 15,
    notes: 'Arrange practice worksheets and lesson plans for 3 PM batch',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-9',
    title: 'Teach students at the home tuition academy',
    category: 'Tuition Academy',
    startTime: '15:00',
    endTime: '18:00',
    priority: 'Urgent',
    estimatedDuration: 180,
    notes: 'PROTECTED FIXED COMMITMENT: In-person tuition teaching session (3:00 PM – 6:00 PM)',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: true,
    weatherSensitivity: 'Fixed',
    date: today,
  },
  {
    id: 'task-10',
    title: 'Children, dinner preparation, and essential household tasks',
    category: 'Household',
    startTime: '18:00',
    endTime: '19:00',
    priority: 'High',
    estimatedDuration: 60,
    notes: 'Check children homework, dinner cooking and table setup',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Indoor Alternative Available',
    date: today,
  },
  {
    id: 'task-11',
    title: 'Continue the Power BI project or improve the portfolio',
    category: 'Power BI',
    startTime: '19:00',
    endTime: '20:00',
    priority: 'Medium',
    estimatedDuration: 60,
    notes: 'Refine data model relationships and tooltips for portfolio showcase',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-12',
    title: 'Dinner and a short break',
    category: 'Rest',
    startTime: '20:00',
    endTime: '20:30',
    priority: 'Low',
    estimatedDuration: 30,
    notes: 'Unwind and eat dinner with family',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-13',
    title: 'Review AI Automation notes and prepare for the live class',
    category: 'AI Automation',
    startTime: '20:30',
    endTime: '21:30',
    priority: 'High',
    estimatedDuration: 60,
    notes: 'Review previous lecture notes on LLM prompt orchestration and API chaining',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-14',
    title: 'Class setup and break',
    category: 'Rest',
    startTime: '21:30',
    endTime: '22:00',
    priority: 'Low',
    estimatedDuration: 30,
    notes: 'Test audio, webcam, IDE environment, and rest eyes before midnight lecture',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-15',
    title: 'Live AI Automation class',
    category: 'AI Automation',
    startTime: '22:00',
    endTime: '00:00',
    priority: 'Urgent',
    estimatedDuration: 120,
    notes: 'PROTECTED FIXED COMMITMENT: Live cohort training class (10:00 PM – 12:00 AM)',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: true,
    weatherSensitivity: 'Fixed',
    date: today,
  },
  {
    id: 'task-16',
    title: 'Practical implementation of concepts learned in the class',
    category: 'AI Automation',
    startTime: '00:00',
    endTime: '01:30',
    priority: 'High',
    estimatedDuration: 90,
    notes: 'Code exercise: Build automation script connecting data pipelines to automated reporting',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-17',
    title: 'Social media content creation and publishing',
    category: 'Social Media',
    startTime: '01:30',
    endTime: '03:00',
    priority: 'Medium',
    estimatedDuration: 90,
    notes: 'LinkedIn post on Power BI data modeling best practices with sample screenshots',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
  {
    id: 'task-18',
    title: 'Sleep & Night Recovery (Current schedule: 5 hours - below 7-8h target)',
    category: 'Rest',
    startTime: '03:00',
    endTime: '08:00',
    priority: 'Urgent',
    estimatedDuration: 300,
    notes: 'HEALTH WARNING: 5-hour sleep is insufficient for long-term health. Consider shifting post-midnight study to daytime.',
    completed: false,
    status: 'Pending',
    isRecurring: true,
    isFixed: false,
    weatherSensitivity: 'Flexible',
    date: today,
  },
];

export const DEFAULT_PROJECTS: PowerBIProject[] = [
  {
    id: 'proj-1',
    name: 'Urban Mart Power BI Portfolio',
    description: 'Executive retail analytics dashboard tracking $4.2M sales, inventory turnover, customer retention, and regional profitability across 18 store branches.',
    startDate: '2026-09-15',
    targetDate: '2026-11-10',
    currentPhase: 'DAX Measures',
    plannedHours: 40,
    actualHours: 24.5,
    notes: 'Star schema configured with FactSales and DimCustomer, DimProduct, DimDate. Next: YoY variance and dynamic currency formatting.',
    status: 'Active',
    portfolioStatus: 'Under Review',
    phases: [
      {
        id: 'phase-1',
        name: 'Requirements',
        completed: true,
        tasks: [
          { id: 'p1-t1', title: 'Define KPI metrics with stakeholders (Sales, Margin, AOV)', completed: true },
          { id: 'p1-t2', title: 'Prepare wireframe layout sketches for desktop & mobile view', completed: true },
        ],
      },
      {
        id: 'phase-2',
        name: 'Data Collection',
        completed: true,
        tasks: [
          { id: 'p2-t1', title: 'Export transactional CSV files and customer master data', completed: true },
          { id: 'p2-t2', title: 'Inspect data types and audit missing value distributions', completed: true },
        ],
      },
      {
        id: 'phase-3',
        name: 'Data Cleaning',
        completed: true,
        tasks: [
          { id: 'p3-t1', title: 'Power Query: Trim strings, unpivot promotional columns', completed: true },
          { id: 'p3-t2', title: 'Handle missing order return status and remove duplicates', completed: true },
        ],
      },
      {
        id: 'phase-4',
        name: 'Data Modeling',
        completed: true,
        tasks: [
          { id: 'p4-t1', title: 'Establish 1-to-many single direction relationships in Star Schema', completed: true },
          { id: 'p4-t2', title: 'Create standard DimDate calendar table with fiscal periods', completed: true },
        ],
      },
      {
        id: 'phase-5',
        name: 'DAX Measures',
        completed: false,
        tasks: [
          { id: 'p5-t1', title: 'Total Revenue, Total Cost, and Gross Margin %', completed: true },
          { id: 'p5-t2', title: 'Same Period Last Year (SPLY) and YoY Growth %', completed: false },
          { id: 'p5-t3', title: 'Dynamic Rolling 90-Day Moving Average Revenue', completed: false },
        ],
      },
      {
        id: 'phase-6',
        name: 'Dashboard Design',
        completed: false,
        tasks: [
          { id: 'p6-t1', title: 'Apply cohesive color palette matching Urban Mart branding', completed: false },
          { id: 'p6-t2', title: 'Add custom tooltip cards showing store manager breakdown', completed: false },
        ],
      },
      {
        id: 'phase-7',
        name: 'Validation',
        completed: false,
        tasks: [
          { id: 'p7-t1', title: 'Cross-check DAX outputs against original Excel pivot tables', completed: false },
        ],
      },
      {
        id: 'phase-8',
        name: 'Business Insights',
        completed: false,
        tasks: [
          { id: 'p8-t1', title: 'Write 3 executive summary bullets on underperforming categories', completed: false },
        ],
      },
      {
        id: 'phase-9',
        name: 'Documentation',
        completed: false,
        tasks: [
          { id: 'p9-t1', title: 'Write comprehensive GitHub README with data dictionary', completed: false },
        ],
      },
      {
        id: 'phase-10',
        name: 'Portfolio Publication',
        completed: false,
        tasks: [
          { id: 'p10-t1', title: 'Publish interactive report to NovyPro & record 90s walkthrough', completed: false },
        ],
      },
    ],
    sessions: [
      { id: 'sess-1', date: '2026-10-16', durationMinutes: 120, notes: 'Completed star schema and connected DimDate table' },
      { id: 'sess-2', date: '2026-10-17', durationMinutes: 90, notes: 'Implemented gross profit and sales margin DAX measures' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Financial Analysis Power BI Project',
    description: 'Corporate income statement, variance analysis, and cash burn forecasting dashboard for mid-market B2B services.',
    startDate: '2026-10-01',
    targetDate: '2026-11-25',
    currentPhase: 'Data Cleaning',
    plannedHours: 35,
    actualHours: 11.0,
    notes: 'Standardizing chart of accounts across three operating entities.',
    status: 'Active',
    portfolioStatus: 'Draft',
    phases: [
      {
        id: 'f-phase-1',
        name: 'Requirements',
        completed: true,
        tasks: [
          { id: 'fp1-1', title: 'Define EBITDA, OPEX, and cash runway calculation formulas', completed: true },
        ],
      },
      {
        id: 'f-phase-2',
        name: 'Data Collection',
        completed: true,
        tasks: [
          { id: 'fp2-1', title: 'Consolidate 12-month QuickBooks general ledger extracts', completed: true },
        ],
      },
      {
        id: 'f-phase-3',
        name: 'Data Cleaning',
        completed: false,
        tasks: [
          { id: 'fp3-1', title: 'Unpivot monthly budget vs actual columns in Power Query', completed: true },
          { id: 'fp3-2', title: 'Harmonize departmental account codes across entities', completed: false },
        ],
      },
      {
        id: 'f-phase-4',
        name: 'Data Modeling',
        completed: false,
        tasks: [
          { id: 'fp4-1', title: 'Construct financial statement hierarchy and parent-child bridge', completed: false },
        ],
      },
      {
        id: 'f-phase-5',
        name: 'DAX Measures',
        completed: false,
        tasks: [
          { id: 'fp5-1', title: 'Calculate variance to budget and forecast burn rate', completed: false },
        ],
      },
      {
        id: 'f-phase-6',
        name: 'Dashboard Design',
        completed: false,
        tasks: [
          { id: 'fp6-1', title: 'Build clean waterfall chart for EBITDA breakdown', completed: false },
        ],
      },
      {
        id: 'f-phase-7',
        name: 'Validation',
        completed: false,
        tasks: [
          { id: 'fp7-1', title: 'Validate totals against audited financial statements', completed: false },
        ],
      },
      {
        id: 'f-phase-8',
        name: 'Business Insights',
        completed: false,
        tasks: [
          { id: 'fp8-1', title: 'Highlight OPEX drivers and seasonal revenue peaks', completed: false },
        ],
      },
      {
        id: 'f-phase-9',
        name: 'Documentation',
        completed: false,
        tasks: [
          { id: 'fp9-1', title: 'Prepare documentation PDF and measure dictionary', completed: false },
        ],
      },
      {
        id: 'f-phase-10',
        name: 'Portfolio Publication',
        completed: false,
        tasks: [
          { id: 'fp10-1', title: 'Export anonymized mock portfolio report for LinkedIn showcase', completed: false },
        ],
      },
    ],
    sessions: [
      { id: 'fsess-1', date: '2026-10-15', durationMinutes: 110, notes: 'Extracted QuickBooks GL files and mapped chart of accounts' },
    ],
  },
];

export const DEFAULT_AI_LEARNING: AILearningRecord[] = [
  {
    id: 'learn-1',
    date: today,
    topic: 'Building Automated AI Data Pipelines & LLM Function Calling',
    classNotes:
      'Covered how to integrate LLMs into Python ETL jobs. Learned structured outputs with JSON schemas, error retry mechanisms, and chaining Power BI dataset refresh triggers via REST APIs.',
    keyConcepts: [
      'Structured JSON extraction from raw business text',
      'Function calling for database querying',
      'Prompt orchestration & temperature discipline',
      'Automated email notification triggers',
    ],
    practicalExercise:
      'Write a Python script that takes unstructured customer reviews, parses sentiment and category into a clean tabular DataFrame, and dumps to CSV for Power BI ingestion.',
    checklist: {
      attendLiveClass: false,
      writeClassNotes: true,
      implementLearned: false,
      testResult: false,
      saveArtifact: false,
      publishDocumentation: false,
    },
    practiceMinutes: 45,
    resourceLinks: [
      { title: 'Google GenAI TypeScript / Python Documentation', url: 'https://ai.google.dev/gemini-api/docs' },
      { title: 'Power BI REST API for Automated Dataset Refresh', url: 'https://learn.microsoft.com/power-bi/developer/automation' },
    ],
    completed: false,
  },
];

export const DEFAULT_JOBS: JobRecord[] = [
  {
    id: 'job-1',
    title: 'Junior Remote Data Analyst',
    company: 'Nexus Analytics Partners',
    location: 'Remote (Worldwide / Pakistan eligible)',
    datePosted: '2026-10-16',
    deadline: '2026-10-30',
    experienceReq: '0–2 years of experience with Excel, SQL, and Power BI',
    requiredSkills: ['Power BI', 'Advanced Excel (XLOOKUP, Power Pivot)', 'SQL', 'Data Storytelling'],
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Data%20Analyst%20Remote',
    dateDiscovered: today,
    status: 'To Apply',
    notes: 'Matches my Urban Mart project perfectly. Include link to interactive dashboard in cover letter.',
    isVerifiedRemote: true,
  },
  {
    id: 'job-2',
    title: 'Reporting & Dashboard Developer (Freelance / Contract)',
    company: 'SwiftLogistics EMEA',
    location: 'Remote (Asia / Pakistan timezone overlap)',
    datePosted: '2026-10-17',
    deadline: '2026-11-05',
    experienceReq: 'Demonstrated portfolio in supply chain or sales dashboards',
    requiredSkills: ['Power BI DAX', 'Data Modeling', 'Power Query M Code', 'KPI Reporting'],
    applicationUrl: 'https://www.upwork.com/freelance-jobs/power-bi/',
    dateDiscovered: today,
    status: 'Saved',
    notes: 'Client needs to migrate legacy spreadsheets to a centralized Power BI dashboard.',
    isVerifiedRemote: true,
  },
];

export const DEFAULT_OUTREACH: OutreachContact[] = [
  {
    id: 'out-1',
    contactName: 'Ayesha Tariq',
    company: 'Apex Data Insights',
    role: 'Lead Analytics Manager',
    verifiedEmail: 'ayesha.tariq@apexanalytics.io',
    relevantNeed: 'Expanding their junior reporting team for retail client projects',
    personalizationNotes: 'Noticed her recent post on optimizing DAX star schemas for large datasets',
    subject: 'Junior Data Analyst | Loved your insight on DAX optimization + Quick intro',
    body: `Hi Ayesha,

I read your recent post on simplifying DAX relationships in complex retail schemas—the tip about avoiding bidirectional filtering on high-cardinality keys was super helpful.

I am a Junior Data Analyst based in Lahore, specializing in Excel and Power BI dashboards. I recently finished an end-to-end retail performance dashboard (Urban Mart) covering $4.2M in sales with dynamic YoY growth metrics and inventory turnover rates.

I would love to share a 2-minute interactive link if you are open to seeing how I structure data models. Either way, thank you for sharing your analytics knowledge with our community!

Warm regards,
Sadaf Nalain
Junior Data Analyst | Lahore, Pakistan`,
    followUpDate: '2026-10-24',
    status: 'Draft',
  },
  {
    id: 'out-2',
    contactName: 'David Miller',
    company: 'CloudScale Growth Partners',
    role: 'Operations & Business Systems Director',
    verifiedEmail: 'd.miller@cloudscalepartners.com',
    relevantNeed: 'Looking for freelance dashboard developer to automate manual weekly Excel sales sheets',
    personalizationNotes: 'Company currently spending 8 hours weekly copying formulas between spreadsheets',
    subject: 'Automating your weekly sales reporting into Power BI | Quick idea',
    body: `Hi David,

I saw that CloudScale is currently scaling client onboarding and managing weekly reporting through Excel sheets. Many growing teams lose 5–10 hours each week troubleshooting broken VLOOKUPs and manual pivots.

I specialize in transforming complex Excel workbooks into automated, refreshable Power BI dashboards with clean DAX measures and automated data pipelines.

Would you be open to a brief 10-minute chat or seeing a sample financial dashboard I built for multi-branch performance?

Best regards,
Sadaf Nalain
Data & BI Analyst | Lahore, Pakistan`,
    followUpDate: '2026-10-25',
    status: 'Draft',
  },
];

export const DEFAULT_SOCIAL_POSTS: SocialMediaPost[] = [
  {
    id: 'soc-1',
    topic: 'DAX Star Schema vs Snowflake: Why 1-to-Many Relationships Speed Up Reports',
    platform: 'LinkedIn',
    postType: 'Power BI dashboard',
    caption: `3 mistakes I stopped making when modeling data in Power BI:

1. Never use bi-directional relationships unless absolutely unavoidable. Single direction keeps memory footprint light and avoids ambiguous filter paths.
2. Build a dedicated DimDate table in Power Query or DAX (never rely on auto date/time hierarchies).
3. Hide foreign keys from the Report View so users never accidentally aggregate ID fields.

Here is a sneak peek of the Star Schema I designed for my Urban Mart Retail Portfolio project! 👇

What is your #1 golden rule when structuring data models?`,
    hashtags: '#DataAnalytics #PowerBI #DAX #DataModeling #CareerInData #WomenInTech',
    attachmentNote: 'UrbanMart_Star_Schema_Model_View.png',
    plannedDate: today,
    status: 'Ready',
    relatedProjectId: 'proj-1',
  },
  {
    id: 'soc-2',
    topic: 'Excel XLOOKUP vs Power BI Relationships: When to graduate from spreadsheets',
    platform: 'LinkedIn',
    postType: 'Excel tips',
    caption: `If your Excel sheet is taking 45 seconds to calculate every time you change a cell, it might be time to move to Power BI!

Here is why:
- XLOOKUP recalculates row-by-row on the CPU.
- VertiPaq engine in Power BI stores columns in-memory and compressed.
- What takes 200MB in Excel often takes less than 25MB in a clean .pbix file.

Are you still relying on VLOOKUP/XLOOKUP for large datasets?`,
    hashtags: '#ExcelTips #PowerBI #DataAnalyst #Productivity #ContinuousLearning',
    plannedDate: '2026-10-20',
    status: 'Idea',
  },
];

export const DEFAULT_HOUSEHOLD: HouseholdTask[] = [
  {
    id: 'home-1',
    title: 'Prepare healthy breakfast and children morning needs',
    category: "Children's meals",
    frequency: 'Daily',
    estimatedDuration: 45,
    priority: 'High',
    completed: true,
    completedAt: `${today}T09:00:00`,
    weatherSensitivity: 'Flexible',
    notes: 'Oatmeal, fruits, and school lunchbox',
  },
  {
    id: 'home-2',
    title: 'Morning laundry wash and outdoor line hanging',
    category: 'Laundry',
    frequency: 'Selected Days',
    selectedDays: ['Mon', 'Wed', 'Sat'],
    estimatedDuration: 30,
    priority: 'Medium',
    completed: false,
    weatherSensitivity: 'Weather Sensitive',
    notes: 'Check weather forecast! If rain or dust storm is expected in Lahore, use indoor drying rack.',
  },
  {
    id: 'home-3',
    title: 'Tuition room setup and clean desk preparation',
    category: 'Tuition preparation',
    frequency: 'Daily',
    estimatedDuration: 20,
    priority: 'High',
    completed: false,
    weatherSensitivity: 'Indoor Alternative Available',
    notes: 'Wipe whiteboards, organize student stationery and chairs before 3:00 PM',
  },
  {
    id: 'home-4',
    title: 'Dinner preparation and family evening meal',
    category: 'Cooking',
    frequency: 'Daily',
    estimatedDuration: 60,
    priority: 'High',
    completed: false,
    weatherSensitivity: 'Flexible',
    notes: 'Healthy home-cooked meal right after tuition ends at 6 PM',
  },
  {
    id: 'home-5',
    title: 'Kitchen cleanup and counters sanitizing',
    category: 'Kitchen organization',
    frequency: 'Daily',
    estimatedDuration: 25,
    priority: 'Medium',
    completed: false,
    weatherSensitivity: 'Flexible',
    notes: 'Clean surfaces and prep kettle for evening tea',
  },
  {
    id: 'home-6',
    title: 'Weekly grocery restock and essentials checklist',
    category: 'Household errands',
    frequency: 'Weekly',
    selectedDays: ['Sat'],
    estimatedDuration: 60,
    priority: 'Medium',
    completed: false,
    weatherSensitivity: 'Weather Sensitive',
    notes: 'Visit local market during cooler morning hours if heat is high',
  },
];

export const DEFAULT_WEEKLY_GOAL: WeeklyGoal = {
  id: 'week-current',
  weekStartDate: today,
  powerBIHoursTarget: 15,
  aiLearningHoursTarget: 12,
  jobApplicationsTarget: 10,
  outreachEmailsTarget: 10,
  socialPostsTarget: 5,
  sleepHoursTarget: 7.5,
  reviewWhatWentWell: 'Completed star schema modeling for Urban Mart portfolio and kept tuition hours protected.',
  reviewUnfinished: 'Need to increase sleep from 5 hours to at least 7 hours by shifting post-midnight study to daytime.',
  reviewProjectProgress: 'Urban Mart reached 60% completion. DAX measures progressing nicely.',
  reviewNextWeekPriority: 'Finish Urban Mart dashboard visual design, publish to NovyPro, and apply to 10 verified remote roles.',
};

export const DEFAULT_SLEEP_LOGS: SleepLog[] = [
  { date: '2026-10-14', hours: 5.5, notes: 'Stayed up implementing AI class practice until 2:30 AM' },
  { date: '2026-10-15', hours: 5.0, notes: 'Felt tired during afternoon tuition. Need more rest.' },
  { date: '2026-10-16', hours: 6.0, notes: 'Took 30m daytime nap' },
  { date: '2026-10-17', hours: 5.0, notes: 'Late night LinkedIn post creation' },
  { date: '2026-10-18', hours: 5.5, notes: 'Working on adjusting schedule towards 7 hours' },
];

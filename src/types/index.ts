export interface UserProfile {
  id: string;
  name: string;
  email: string;
  /** Resume or cover letter — AI scans for relevant experience matching target startup */
  contentDocument?: {
    type: "resume" | "cover-letter";
    file: File;
    text: string; // extracted text for RAG analysis
  };
  /** Writing sample — AI studies writing style/habits/structure ONLY, ignores content */
  styleSample?: {
    file: File;
    text: string; // extracted text for style analysis
  };
  preferences: {
    roles: string[];
    industries: string[];
    locations: string[];
  };
}

export interface Startup {
  id: string;
  name: string;
  founderName: string;
  website: string;
  // Auto-scraped from website
  product: string;
  description: string;
  stage: "pre-seed" | "seed" | "series-a" | "series-b" | "growth";
  techStack: string[];
  industry: string;
  scrapedAt?: string;
  // Adaptive feedback
  outreachStatus?: "not-sent" | "sent" | "success" | "failed";
  feedback?: string;
  addedAt?: string;
}

export interface StartupResearch {
  startupId: string;
  founderPriorities: string[];
  recentActivity: string[];
  relevantSkills: string[];
  hooks: string[];
  confidence: number;
}

export interface OutreachMessage {
  id: string;
  startupId: string;
  subject: string;
  body: string;
  rationale: string;
  matchScore: number;
  status: "draft" | "sent" | "replied" | "no-reply";
  createdAt: string;
}

export interface OutreachResult {
  messageId: string;
  replied: boolean;
  responseTime?: number;
  sentiment?: "positive" | "neutral" | "negative";
  feedback?: string;
}

export interface DashboardStats {
  totalSent: number;
  totalReplies: number;
  replyRate: number;
  avgResponseTime: number;
  positiveReplies: number;
  topMatchScore: number;
}

export interface StartupLead {
  id: string;
  name: string;
  website: string;
  techStack: string[];
  industry: string;
  stage: "pre-seed" | "seed" | "series-a" | "series-b" | "growth";
  matchReason: string;
  hiringFor: string[];
}

export interface LeadGenerationState {
  generatedLeads: StartupLead[];
  generationsUsed: number;
  lastResetTime: string;
  maxGenerations: number;
}

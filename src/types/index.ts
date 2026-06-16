export interface UserProfile {
  id: string;
  name: string;
  email: string;
  contentDocument?: {
    type: "resume" | "cover-letter";
    file: File;
    text: string;
  };
  styleSample?: {
    file: File;
    text: string;
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
  founderLinkedIn?: string;
  product: string;
  description: string;
  stage: "pre-seed" | "seed" | "series-a" | "series-b" | "growth";
  techStack: string[];
  industry: string;
  website?: string;
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

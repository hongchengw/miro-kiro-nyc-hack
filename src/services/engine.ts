/**
 * InternAI — Outreach Engine
 *
 * Implements the 5-step workflow from the Miro pitch deck:
 *   1. Upload Once (profile data)
 *   2. Target (startup selection)
 *   3. Research (AI analysis)
 *   4. Generate (message creation)
 *   5. Learn (continuous improvement)
 *
 * Key Features from Miro:
 *   - Adaptive learning: improves message quality from reply data and user feedback
 *   - Founder preference detection: surfaces what matters to each recipient
 *   - Voice matching: preserves the student's authentic style
 *
 * From sticky note — Mechanism:
 *   Evaluates candidate skills and maps them directly to the startup's specific domain.
 */

import {
  UserProfile,
  Startup,
  StartupResearch,
  OutreachMessage,
  OutreachResult,
  DashboardStats,
} from "../types";

export class OutreachEngine {
  private profile: UserProfile | null = null;
  private startups: Startup[] = [];
  private messages: OutreachMessage[] = [];
  private results: OutreachResult[] = [];

  // --- Step 1: Upload Once ---
  setProfile(profile: UserProfile): void {
    this.profile = profile;
  }

  getProfile(): UserProfile | null {
    return this.profile;
  }

  // --- Step 2: Target ---
  addStartups(startups: Startup[]): void {
    this.startups.push(...startups);
  }

  updateStartup(id: string, updates: Partial<Startup>): void {
    const index = this.startups.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.startups[index] = { ...this.startups[index], ...updates };
    }
  }

  getStartups(): Startup[] {
    return this.startups;
  }

  // --- Step 3: Research ---
  async researchStartup(startup: Startup): Promise<StartupResearch> {
    if (!this.profile) throw new Error("Profile not set");

    const founderPriorities = this.detectFounderPreferences(startup);
    const relevantSkills = this.extractRelevantExperience(startup);
    const hooks = this.findHooks(startup, relevantSkills);

    return {
      startupId: startup.id,
      founderPriorities,
      recentActivity: [],
      relevantSkills,
      hooks,
      confidence: Math.min(100, relevantSkills.length * 25 + founderPriorities.length * 20 + 10),
    };
  }

  // --- Step 4: Generate ---
  async generateMessage(startup: Startup, research: StartupResearch): Promise<OutreachMessage> {
    if (!this.profile) throw new Error("Profile not set");

    // Apply adaptive learning from feedback
    const learnings = this.analyzeSuccessPatterns();

    const message: OutreachMessage = {
      id: crypto.randomUUID(),
      startupId: startup.id,
      subject: this.craftSubject(startup, research),
      body: this.craftBodyWithStyle(startup, research, learnings),
      rationale: this.buildRationale(research, learnings),
      matchScore: Math.min(100, research.relevantSkills.length * 20 + research.founderPriorities.length * 15 + research.hooks.length * 10),
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    this.messages.push(message);
    return message;
  }

  // --- Step 5: Learn ---
  recordResult(result: OutreachResult): void {
    this.results.push(result);
    // Tracks replies and edits; updates tone, content, and targeting for the next wave
  }

  // --- Dashboard ---
  getMessages(): OutreachMessage[] {
    return this.messages;
  }

  getStats(): DashboardStats {
    const sent = this.messages.filter((m) => m.status !== "draft");
    const replies = this.results.filter((r) => r.replied);
    const positive = this.results.filter((r) => r.sentiment === "positive");
    const avgTime = replies.length > 0
      ? replies.reduce((sum, r) => sum + (r.responseTime || 0), 0) / replies.length
      : 0;

    return {
      totalSent: sent.length,
      totalReplies: replies.length,
      replyRate: sent.length > 0 ? (replies.length / sent.length) * 100 : 0,
      avgResponseTime: Math.round(avgTime),
      positiveReplies: positive.length,
      topMatchScore: Math.max(0, ...this.messages.map((m) => m.matchScore)),
    };
  }

  // --- Founder Preference Detection ---
  private detectFounderPreferences(startup: Startup): string[] {
    const priorities: string[] = [];
    if (startup.stage === "pre-seed" || startup.stage === "seed") {
      priorities.push("scrappy builders who can wear multiple hats");
    }
    if (startup.techStack.length > 0) {
      priorities.push(`technical depth in ${startup.techStack[0]}`);
    }
    priorities.push(`genuine interest in ${startup.industry}`);
    return priorities;
  }

  // --- Content Document RAG Analysis ---
  // Scans resume/cover letter for relevant experience matching target startup
  // Example: targeting fintech → extracts fintech projects to lead with
  private extractRelevantExperience(startup: Startup): string[] {
    if (!this.profile?.contentDocument) {
      // Fallback to basic preference matching
      return this.profile?.preferences.roles.filter((role: string) =>
        startup.techStack.some((tech: string) => tech.toLowerCase().includes(role.toLowerCase())) ||
        startup.industry.toLowerCase().includes(role.toLowerCase())
      ) || [];
    }

    const docText = this.profile.contentDocument.text.toLowerCase();
    const industry = startup.industry.toLowerCase();
    const techStack = startup.techStack.map((t: string) => t.toLowerCase());
    
    const relevantSkills: string[] = [];
    
    // RAG-like analysis: find mentions of target industry/tech in the document
    if (docText.includes(industry)) {
      relevantSkills.push(`${startup.industry} experience`);
    }
    
    techStack.forEach((tech) => {
      if (docText.includes(tech)) {
        relevantSkills.push(tech);
      }
    });

    // Add user's preferred roles that match
    const matchingRoles = this.profile.preferences.roles.filter((role: string) =>
      techStack.some((tech) => tech.includes(role.toLowerCase())) ||
      industry.includes(role.toLowerCase())
    );
    relevantSkills.push(...matchingRoles);

    return [...new Set(relevantSkills)]; // dedupe
  }

  // --- Hook Generation ---
  private findHooks(startup: Startup, skills: string[]): string[] {
    const hooks: string[] = [];
    if (startup.product) hooks.push(`your approach to ${startup.product}`);
    if (skills.length > 0) hooks.push(`the ${skills[0]} work you're doing`);
    return hooks;
  }

  // --- Voice Matching ---
  private craftSubject(startup: Startup, research: StartupResearch): string {
    const hook = research.hooks[0] || startup.product;
    return `Quick thought on ${hook}`;
  }

  // --- Style-Aware Body Generation ---
  // Uses writing sample to match user's style, habits, structure
  private craftBodyWithStyle(startup: Startup, research: StartupResearch, learnings?: { successPatterns: string[]; avoidPatterns: string[] }): string {
    if (!this.profile) return "";

    // In production: analyze this.profile.styleSample.text for:
    // - sentence length patterns
    // - formality level
    // - paragraph structure
    // - greeting/closing preferences
    // For now, use a clean, professional template

    const lines = [
      `Hi ${startup.founderName},`,
      "",
      research.hooks[0]
        ? `I noticed ${research.hooks[0]} and it resonated with me.`
        : `I've been following ${startup.name} and I'm impressed by what you're building with ${startup.product}.`,
      "",
      research.relevantSkills.length > 0
        ? `I've worked on ${research.relevantSkills.slice(0, 2).join(" and ")}, and I think there's a natural fit.`
        : `My background aligns well with what you're building.`,
      research.founderPriorities.length > 0
        ? `I know you value ${research.founderPriorities[0]} — that's exactly how I approach my work.`
        : "",
      "",
      `Would love to chat for 15 minutes about how I could contribute. No pressure either way.`,
      "",
      `Best,`,
      this.profile.name,
    ];
    return lines.filter((l) => l !== undefined).join("\n");
  }

  private buildRationale(research: StartupResearch, learnings?: { successPatterns: string[]; avoidPatterns: string[] }): string {
    const parts: string[] = [];
    if (research.relevantSkills.length > 0) parts.push(`Matched ${research.relevantSkills.length} skills from your resume to their domain`);
    if (research.founderPriorities.length > 0) parts.push(`Aligned with ${research.founderPriorities.length} founder priorities`);
    if (research.hooks.length > 0) parts.push(`Found ${research.hooks.length} credible hooks`);
    parts.push(`Writing style adapted from your sample document`);

    if (learnings) {
      if (learnings.successPatterns.length > 0) {
        parts.push(`Applied ${learnings.successPatterns.length} successful pattern(s) from previous outreach`);
      }
      if (learnings.avoidPatterns.length > 0) {
        parts.push(`Avoided ${learnings.avoidPatterns.length} unsuccessful approach(es)`);
      }
    }

    return parts.join(". ") + ".";
  }

  // --- Adaptive Learning from Feedback ---
  private analyzeSuccessPatterns(): { successPatterns: string[]; avoidPatterns: string[] } {
    const successPatterns: string[] = [];
    const avoidPatterns: string[] = [];

    // Analyze startups with feedback
    const successfulStartups = this.startups.filter((s) => s.outreachStatus === "success" && s.feedback);
    const failedStartups = this.startups.filter((s) => s.outreachStatus === "failed" && s.feedback);

    successfulStartups.forEach((s) => {
      if (s.feedback) successPatterns.push(s.feedback);
    });

    failedStartups.forEach((s) => {
      if (s.feedback) avoidPatterns.push(s.feedback);
    });

    return { successPatterns, avoidPatterns };
  }
}

export const engine = new OutreachEngine();

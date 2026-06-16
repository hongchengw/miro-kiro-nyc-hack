/**
 * Lead Generation Service
 * 
 * Generates AI-powered startup leads based on user profile and interests.
 * Includes rate limiting: 3 generations per session, resets every few hours.
 */

import { StartupLead, LeadGenerationState, UserProfile } from "../types";

const RATE_LIMIT = 3;
const RESET_HOURS = 3;
const LEADS_PER_GENERATION = 10;

export class LeadGenerator {
  private state: LeadGenerationState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): LeadGenerationState {
    const stored = localStorage.getItem("leadGenerationState");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if reset time has passed
      const lastReset = new Date(parsed.lastResetTime);
      const now = new Date();
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

      if (hoursSinceReset >= RESET_HOURS) {
        // Reset the counter
        return {
          generatedLeads: parsed.generatedLeads || [],
          generationsUsed: 0,
          lastResetTime: now.toISOString(),
          maxGenerations: RATE_LIMIT,
        };
      }
      return parsed;
    }

    return {
      generatedLeads: [],
      generationsUsed: 0,
      lastResetTime: new Date().toISOString(),
      maxGenerations: RATE_LIMIT,
    };
  }

  private saveState(): void {
    localStorage.setItem("leadGenerationState", JSON.stringify(this.state));
  }

  canGenerate(): boolean {
    return this.state.generationsUsed < this.state.maxGenerations;
  }

  getGenerationsRemaining(): number {
    return this.state.maxGenerations - this.state.generationsUsed;
  }

  getTimeUntilReset(): string {
    const lastReset = new Date(this.state.lastResetTime);
    const resetTime = new Date(lastReset.getTime() + RESET_HOURS * 60 * 60 * 1000);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();

    if (diff <= 0) return "Available now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  async generateLeads(profile: UserProfile): Promise<StartupLead[]> {
    if (!this.canGenerate()) {
      throw new Error(`Rate limit reached. Resets in ${this.getTimeUntilReset()}`);
    }

    // Simulate AI generation based on user profile
    const leads = await this.fetchMatchingStartups(profile);

    this.state.generatedLeads.push(...leads);
    this.state.generationsUsed++;
    this.saveState();

    return leads;
  }

  private async fetchMatchingStartups(profile: UserProfile): Promise<StartupLead[]> {
    // In production, this would call an API that:
    // 1. Analyzes user's resume/skills/preferences
    // 2. Searches startup databases (YC, AngelList, Crunchbase)
    // 3. Filters for companies actively hiring interns
    // 4. Matches tech stack and industry to user profile

    // For prototype, generate realistic mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const industries = profile.preferences.industries.length > 0
      ? profile.preferences.industries
      : ["AI/ML", "Fintech", "Developer Tools", "HealthTech"];

    const roles = profile.preferences.roles.length > 0
      ? profile.preferences.roles
      : ["Full-stack", "Frontend", "Backend", "ML Engineer"];

    const startupPool = this.generateStartupPool(industries, roles);

    // Return 10 random startups
    const shuffled = startupPool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, LEADS_PER_GENERATION);
  }

  private generateStartupPool(industries: string[], roles: string[]): StartupLead[] {
    const techStacks = [
      ["React", "TypeScript", "Node.js"],
      ["Python", "Django", "PostgreSQL"],
      ["React", "Python", "AWS"],
      ["Vue", "Node.js", "MongoDB"],
      ["Next.js", "TypeScript", "Vercel"],
      ["React Native", "TypeScript", "Firebase"],
      ["Python", "FastAPI", "Docker"],
      ["Angular", "Java", "Spring Boot"],
    ];

    const stages: Array<"pre-seed" | "seed" | "series-a" | "series-b" | "growth"> = [
      "pre-seed",
      "seed",
      "seed",
      "series-a",
      "series-a",
      "series-b",
    ];

    const companyPrefixes = [
      "Tech", "Nova", "Quantum", "Smart", "Apex", "Stellar", "Nexus", "Forge",
      "Bright", "Swift", "Pulse", "Cloud", "Data", "Alpha", "Vertex", "Prism",
    ];

    const companySuffixes = [
      "AI", "Labs", "Tech", "Systems", "Solutions", "Works", "Hub", "io",
      "ly", "app", "dev", "soft", "ware", "tech", "base", "flow",
    ];

    const leads: StartupLead[] = [];

    for (let i = 0; i < 50; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const techStack = techStacks[Math.floor(Math.random() * techStacks.length)];
      const stage = stages[Math.floor(Math.random() * stages.length)];

      const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
      const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
      const name = `${prefix}${suffix}`;

      leads.push({
        id: crypto.randomUUID(),
        name,
        website: `https://${name.toLowerCase()}.com`,
        techStack,
        industry,
        stage,
        matchReason: `Looking for ${role} with ${techStack[0]} experience`,
        hiringFor: [role, roles[Math.floor(Math.random() * roles.length)]],
      });
    }

    return leads;
  }

  getAllLeads(): StartupLead[] {
    return this.state.generatedLeads;
  }

  getState(): LeadGenerationState {
    return this.state;
  }
}

export const leadGenerator = new LeadGenerator();

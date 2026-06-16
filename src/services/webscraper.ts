/**
 * Web Scraper Service
 * 
 * Analyzes company websites to extract:
 * - Company name
 * - Product/Purpose
 * - Industry
 * - Funding stage (best guess)
 * - Tech stack (if detectable)
 */

import { Startup } from "../types";

export interface ScrapedData {
  name: string;
  product: string;
  description: string;
  industry: string;
  stage: Startup["stage"];
  techStack: string[];
}

/**
 * Scrape a company website and extract relevant information.
 * In production, this would make an API call to a scraping service
 * or use a headless browser. For prototype, we simulate the extraction.
 */
export async function scrapeCompanyWebsite(url: string): Promise<ScrapedData> {
  // Validate URL
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    // In production, this would:
    // 1. Fetch the page content
    // 2. Parse HTML with Cheerio or similar
    // 3. Extract meta tags, headings, text content
    // 4. Use LLM to analyze and categorize the content
    
    // For prototype, simulate a realistic delay and extract from URL patterns
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract domain for pattern matching (prototype logic)
    const domain = new URL(url).hostname.replace("www.", "");
    const name = domain.split(".")[0];

    // Simulate scraped data (in production, this would be real extraction)
    const scrapedData: ScrapedData = {
      name: capitalizeWords(name),
      product: "Building innovative solutions in their space",
      description: "A growing startup focused on delivering value to their customers",
      industry: guessIndustry(domain),
      stage: guessStage(domain),
      techStack: guessTechStack(domain),
    };

    return scrapedData;
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Production implementation notes:
 * 
 * Real scraping would involve:
 * 1. Fetch page: await fetch(url) or use Puppeteer for JS-heavy sites
 * 2. Parse HTML: Use Cheerio to extract:
 *    - <title> and meta description
 *    - <h1> and main headings
 *    - About/Product pages
 *    - Footer tech badges (Powered by X)
 * 3. LLM Analysis: Send extracted text to GPT-4 with prompt:
 *    "Analyze this company website and extract:
 *     - Industry (fintech, healthtech, devtools, etc.)
 *     - Product description in one sentence
 *     - Funding stage (pre-seed, seed, series-a, series-b, growth)
 *     - Technologies mentioned (React, Python, AWS, etc.)"
 * 4. Return structured data
 */

// Helper: Capitalize first letter of each word
function capitalizeWords(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper: Guess industry from domain (prototype simulation)
function guessIndustry(domain: string): string {
  const industries = [
    { keywords: ["pay", "bank", "finance", "wallet", "card"], industry: "Fintech" },
    { keywords: ["health", "med", "care", "pharma"], industry: "HealthTech" },
    { keywords: ["dev", "code", "api", "cloud", "data"], industry: "Developer Tools" },
    { keywords: ["ai", "ml", "learn", "intelligence"], industry: "AI/ML" },
    { keywords: ["shop", "commerce", "retail", "store"], industry: "E-commerce" },
    { keywords: ["social", "community", "connect"], industry: "Social" },
    { keywords: ["edu", "learn", "teach", "school"], industry: "EdTech" },
    { keywords: ["food", "restaurant", "delivery"], industry: "Food & Beverage" },
  ];

  for (const { keywords, industry } of industries) {
    if (keywords.some((kw) => domain.includes(kw))) {
      return industry;
    }
  }
  return "Technology";
}

// Helper: Guess funding stage (prototype simulation)
function guessStage(domain: string): Startup["stage"] {
  // In production, this would analyze:
  // - Company size indicators
  // - Job postings count
  // - News mentions
  // - Crunchbase API data
  
  // For prototype, return random but realistic distribution
  const stages: Startup["stage"][] = ["pre-seed", "seed", "seed", "series-a", "series-b"];
  return stages[Math.floor(Math.random() * stages.length)];
}

// Helper: Guess tech stack (prototype simulation)
function guessTechStack(domain: string): string[] {
  // In production, analyze:
  // - Job postings for tech requirements
  // - Footer/about page mentions
  // - Wappalyzer-style detection
  // - Engineering blog posts
  
  const commonStacks = [
    ["React", "TypeScript", "Node.js"],
    ["Python", "Django", "PostgreSQL"],
    ["React", "Python", "AWS"],
    ["Vue", "Node.js", "MongoDB"],
    ["Next.js", "TypeScript", "Vercel"],
  ];
  return commonStacks[Math.floor(Math.random() * commonStacks.length)];
}

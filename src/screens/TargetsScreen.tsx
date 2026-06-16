import React, { useState } from "react";
import { Startup } from "../types";
import { scrapeCompanyWebsite, ScrapedData } from "../services/webscraper";

interface Props {
  startups: Startup[];
  onAdd: (startup: Startup) => void;
  onGenerate: (startup: Startup) => void;
  onBack: () => void;
}

/**
 * Target List — "Target list: add startups or import from a spreadsheet."
 * From the Miro spec How It Works step 2.
 * 
 * Now uses URL-based web scraping to auto-extract company details.
 */
export const TargetsScreen: React.FC<Props> = ({ startups, onAdd, onGenerate, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [founder, setFounder] = useState("");
  const [url, setUrl] = useState("");
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [scrapeError, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url) return;
    
    setIsScrapingLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      const data = await scrapeCompanyWebsite(url);
      setScrapedData(data);
      // Auto-fill name if empty
      if (!name) setName(data.name);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to scrape website");
    } finally {
      setIsScrapingLoading(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scrapedData) {
      setError("Please scrape the website first");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      name,
      founderName: founder,
      website: url,
      product: scrapedData.product,
      description: scrapedData.description,
      stage: scrapedData.stage,
      techStack: scrapedData.techStack,
      industry: scrapedData.industry,
      scrapedAt: new Date().toISOString(),
    });
    
    setShowForm(false);
    setName("");
    setFounder("");
    setUrl("");
    setScrapedData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="flex items-center gap-3 px-6 h-14 border-b border-gray-200 bg-white shadow-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900"><i className="fas fa-arrow-left" /></button>
        <i className="fas fa-bolt text-emerald-600" />
        <span className="text-gray-900 font-bold">Target Startups</span>
      </header>

      <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{startups.length} startup{startups.length !== 1 ? "s" : ""}</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="h-8 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500 shadow-sm"
          >
            <i className="fas fa-plus text-[10px]" /> Add Startup
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="rounded-xl bg-white border border-emerald-200 p-4 space-y-3 shadow-md">
            {/* Manual inputs */}
            <div className="grid grid-cols-2 gap-3">
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Startup name" 
                required 
                className="h-9 rounded-lg px-3 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
              />
              <input 
                value={founder} 
                onChange={(e) => setFounder(e.target.value)} 
                placeholder="Founder name" 
                required 
                className="h-9 rounded-lg px-3 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
              />
            </div>

            {/* URL input with scrape button */}
            <div>
              <div className="flex gap-2">
                <input 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Company website URL" 
                  required 
                  type="url"
                  className="flex-1 h-9 rounded-lg px-3 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                />
                <button
                  type="button"
                  onClick={handleScrape}
                  disabled={!url || isScrapingLoading}
                  className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                >
                  {isScrapingLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-[10px]" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search text-[10px]" />
                      Scrape
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                AI will analyze the website to extract industry, product, and stage
              </p>
            </div>

            {/* Error display */}
            {scrapeError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                <i className="fas fa-exclamation-circle text-red-600 text-sm mt-0.5" />
                <p className="text-xs text-red-700">{scrapeError}</p>
              </div>
            )}

            {/* Scraped data preview */}
            {scrapedData && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-check-circle text-emerald-600 text-sm" />
                  <p className="text-xs font-semibold text-emerald-700">Website analyzed successfully</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry:</span>
                    <span className="text-gray-900 font-medium">{scrapedData.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="text-gray-900 font-medium">{scrapedData.stage.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tech Stack:</span>
                    <span className="text-gray-900 font-medium">{scrapedData.techStack.join(", ")}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-600 block mb-1">Product:</span>
                    <span className="text-gray-700 text-[11px]">{scrapedData.product}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={!scrapedData}
              className="w-full h-9 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {scrapedData ? "Add to Target List" : "Scrape website first"}
            </button>
          </form>
        )}

        {startups.map((s) => (
          <div key={s.id} className="rounded-xl bg-white border border-gray-200 p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">{s.name}</h3>
                <p className="text-xs text-gray-600">{s.founderName} · {s.stage.replace("-", " ")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{s.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.techStack.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{t}</span>
              ))}
            </div>
            <button
              onClick={() => onGenerate(s)}
              className="w-full h-8 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-500 mt-1 shadow-sm"
            >
              <i className="fas fa-magic text-[10px]" /> Generate Outreach
            </button>
          </div>
        ))}

        {startups.length === 0 && !showForm && (
          <div className="rounded-xl bg-white border border-gray-200 p-8 text-center shadow-sm">
            <i className="fas fa-building text-3xl text-gray-300 mb-2" />
            <p className="text-sm text-gray-900 mb-1 font-medium">No startups yet</p>
            <p className="text-xs text-gray-600">Add startups you want to reach out to.</p>
          </div>
        )}
      </main>
    </div>
  );
};

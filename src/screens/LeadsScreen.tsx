import React, { useState } from "react";
import { StartupLead, UserProfile } from "../types";
import { leadGenerator } from "../services/leadGenerator";

interface Props {
  profile: UserProfile | null;
  onAddToTargets: (lead: StartupLead) => void;
  onBack: () => void;
}

/**
 * Generate Leads Screen
 * 
 * AI-powered startup discovery based on user profile and interests.
 * - Generates 10 leads at a time
 * - Rate limited to 3 generations per few hours
 * - Shows company name, tech stack, website link
 */
export const LeadsScreen: React.FC<Props> = ({ profile, onAddToTargets, onBack }) => {
  const [leads, setLeads] = useState<StartupLead[]>(leadGenerator.getAllLeads());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedLeads, setAddedLeads] = useState<Set<string>>(new Set());

  const generationsRemaining = leadGenerator.getGenerationsRemaining();
  const canGenerate = leadGenerator.canGenerate();
  const timeUntilReset = leadGenerator.getTimeUntilReset();

  const handleGenerate = async () => {
    if (!profile) {
      setError("Please complete your profile first");
      return;
    }

    if (!canGenerate) {
      setError(`Rate limit reached. Resets in ${timeUntilReset}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newLeads = await leadGenerator.generateLeads(profile);
      setLeads([...leadGenerator.getAllLeads()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate leads");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTargets = (lead: StartupLead) => {
    onAddToTargets(lead);
    setAddedLeads(new Set([...addedLeads, lead.id]));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="flex items-center gap-3 px-6 h-14 border-b border-gray-200 bg-white shadow-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900">
          <i className="fas fa-arrow-left" />
        </button>
        <i className="fas fa-bolt text-emerald-600" />
        <span className="text-gray-900 font-bold">Generate Leads</span>
      </header>

      <main className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full space-y-4">
        {/* Header with generate button */}
        <div className="rounded-xl bg-white border border-emerald-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                AI-Powered Startup Discovery
              </h2>
              <p className="text-sm text-gray-600">
                Get personalized startup leads based on your skills and interests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              className="h-10 px-6 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin text-xs" />
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic text-xs" />
                  Generate 10 Leads
                </>
              )}
            </button>

            <div className="text-sm">
              <span className="text-gray-600">Generations remaining: </span>
              <span className={`font-semibold ${generationsRemaining > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {generationsRemaining} / 3
              </span>
            </div>

            {!canGenerate && (
              <span className="text-xs text-gray-500">
                Resets in {timeUntilReset}
              </span>
            )}
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
              <i className="fas fa-exclamation-circle text-red-600 text-sm mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Leads list */}
        {leads.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {leads.length} startup{leads.length !== 1 ? "s" : ""} matched to your profile
            </p>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900">{lead.name}</h3>
                      <p className="text-xs text-gray-600">
                        {lead.industry} · {lead.stage.replace("-", " ")}
                      </p>
                    </div>
                    {addedLeads.has(lead.id) ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        <i className="fas fa-check text-[10px] mr-1" />
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToTargets(lead)}
                        className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 shadow-sm"
                      >
                        <i className="fas fa-plus text-[10px] mr-1" />
                        Add
                      </button>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-emerald-700 font-medium mb-1">
                      <i className="fas fa-bullseye text-xs mr-1" />
                      {lead.matchReason}
                    </p>
                    <p className="text-xs text-gray-600">
                      Hiring for: {lead.hiringFor.join(", ")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lead.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    {lead.website}
                    <i className="fas fa-external-link-alt text-[9px]" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gray-200 p-8 text-center shadow-sm">
            <i className="fas fa-lightbulb text-3xl text-gray-300 mb-2" />
            <p className="text-sm text-gray-900 mb-1 font-medium">No leads yet</p>
            <p className="text-xs text-gray-600">
              Click "Generate 10 Leads" to discover startups matching your profile
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

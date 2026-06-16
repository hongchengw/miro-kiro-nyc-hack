import React, { useState } from "react";
import { Startup, OutreachMessage } from "../types";

interface Props {
  startups: Startup[];
  onGenerate: (startup: Startup) => Promise<OutreachMessage>;
  onBack: () => void;
}

/**
 * Generate Screen — "Before vs. after: side-by-side of a generic cold email
 * and an InternAI-generated message for the same startup."
 *
 * "Brief generate: upload-once profile, select a startup, click Generate,
 * and display the crafted outreach with rationale highlights."
 * (from Demo Flow in Miro spec)
 */
export const GenerateScreen: React.FC<Props> = ({ startups, onGenerate, onBack }) => {
  const [selected, setSelected] = useState<Startup | null>(null);
  const [message, setMessage] = useState<OutreachMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    const msg = await onGenerate(selected);
    setMessage(msg);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="flex items-center gap-3 px-6 h-14 border-b border-gray-200 bg-white shadow-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900"><i className="fas fa-arrow-left" /></button>
        <i className="fas fa-bolt text-emerald-600" />
        <span className="text-gray-900 font-bold">Generate Outreach</span>
      </header>

      <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        {/* Startup picker */}
        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Select a startup</label>
          <select
            value={selected?.id || ""}
            onChange={(e) => {
              setSelected(startups.find((s) => s.id === e.target.value) || null);
              setMessage(null);
            }}
            className="w-full h-11 rounded-lg px-3 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Choose a startup...</option>
            {startups.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.founderName}</option>
            ))}
          </select>
        </div>

        {/* Generate button */}
        {selected && !message && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emerald-500 transition-colors shadow-md"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin text-xs" /> Researching & Generating...</>
            ) : (
              <><i className="fas fa-magic text-xs" /> Generate Personalized Message</>
            )}
          </button>
        )}

        {/* Before vs After — directly from Demo Flow */}
        {message && selected && (
          <div className="space-y-5">
            {/* BEFORE: Generic */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1 font-semibold">
                <i className="fas fa-times-circle" /> Generic cold email (what most people send)
              </p>
              <div className="rounded-xl bg-white border border-gray-200 p-4 text-sm text-gray-600 leading-relaxed shadow-sm">
                <p>Hi {selected.founderName},</p>
                <br />
                <p>I'm a student looking for an internship. I saw your company online and I think it's cool. I'm hardworking and a fast learner. Please let me know if you have any openings.</p>
                <br />
                <p>Thanks,<br />Student</p>
              </div>
            </div>

            {/* AFTER: InternAI */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1 font-semibold">
                <i className="fas fa-check-circle" /> InternAI-generated (personalized & researched)
              </p>
              <div className="rounded-xl bg-white border border-emerald-300 p-4 text-sm leading-relaxed shadow-md">
                <p className="text-gray-700 font-medium mb-2">Subject: {message.subject}</p>
                <hr className="border-gray-200 mb-3" />
                <div className="text-gray-900 whitespace-pre-line">{message.body}</div>
              </div>
            </div>

            {/* Rationale — "display the crafted outreach with rationale highlights" */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-widest text-emerald-700 mb-1 flex items-center gap-1 font-semibold">
                <i className="fas fa-lightbulb" /> Why this message works
              </p>
              <p className="text-sm text-gray-800">{message.rationale}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2">
                Match Score: {message.matchScore}%
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setMessage(null); setSelected(null); }}
                className="flex-1 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:text-gray-900 hover:bg-gray-50 hover:border-emerald-300 transition-colors"
              >
                Generate Another
              </button>
              <button
                onClick={onBack}
                className="flex-1 h-9 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {startups.length === 0 && (
          <div className="rounded-xl bg-white border border-gray-200 p-8 text-center shadow-sm">
            <i className="fas fa-exclamation-circle text-2xl text-amber-500 mb-2" />
            <p className="text-sm text-gray-900 font-medium">No startups in your target list yet.</p>
            <button onClick={onBack} className="text-sm text-emerald-600 mt-2 hover:text-emerald-700 font-medium">
              Add startups first →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

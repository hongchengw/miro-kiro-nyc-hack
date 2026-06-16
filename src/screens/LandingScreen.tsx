import React from "react";

interface Props {
  onGetStarted: () => void;
}

/**
 * Landing — InternAI hero.
 * Content directly from the Miro spec and pitch deck.
 */
export const LandingScreen: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="screen-container">
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-8 py-12 text-center">
        {/* Brand */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5 shadow-sm">
          <i className="fas fa-bolt text-2xl text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">InternAI</h1>
        <p className="text-lg text-gray-600 mt-2">Personalized startup outreach in your voice</p>

        {/* Problem / Solution / Impact — from pitch deck structure */}
        <div className="max-w-md w-full mt-10 space-y-3 text-left">
          <div className="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-red-600 mb-1 font-semibold">Problem</p>
            <p className="text-sm text-gray-700">
              Students blast ~100 cold emails and get ~2 replies. Founders ignore 98% because
              messages are generic, show no research, and don't signal genuine interest.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-emerald-600 mb-1 font-semibold">Solution</p>
            <p className="text-sm text-gray-700">
              AI-powered outreach that learns from your resume, LinkedIn, and GitHub. Tailors each
              message to the founder's priorities and adapts based on reply patterns and feedback.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-emerald-600 mb-1 font-semibold">Impact</p>
            <p className="text-sm text-gray-700">
              10× reply rates vs. traditional cold outreach — turn cold emails into warm
              introductions at scale.
            </p>
          </div>
        </div>

        {/* How It Works — 5 steps from pitch deck */}
        <div className="max-w-md w-full mt-10 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            How It Works
          </h2>
          <ol className="space-y-2">
            {[
              { n: "1", title: "Upload Once", desc: "Resume/cover letter + writing sample for style analysis" },
              { n: "2", title: "Target", desc: "Add startups or import from a spreadsheet" },
              { n: "3", title: "Research", desc: "AI scans your docs for relevant experience matching each startup" },
              { n: "4", title: "Generate", desc: "Crafts outreach in your voice, leading with matched experience" },
              { n: "5", title: "Learn", desc: "Tracks replies; updates tone and targeting automatically" },
            ].map((s) => (
              <li key={s.n} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.n}
                </span>
                <span className="text-sm">
                  <span className="text-gray-900 font-semibold">{s.title}</span>
                  <span className="text-gray-600"> — {s.desc}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Key Features — from spec */}
        <div className="max-w-md w-full mt-10 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Key Features
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-700"><span className="text-emerald-600 mr-2">●</span>Adaptive learning — improves message quality from reply data and user feedback</li>
            <li className="text-gray-700"><span className="text-emerald-600 mr-2">●</span>Founder preference detection — surfaces what matters to each recipient</li>
            <li className="text-gray-700"><span className="text-emerald-600 mr-2">●</span>Voice matching — preserves your authentic style while increasing specificity</li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onGetStarted}
          className="mt-10 mb-8 h-12 px-8 rounded-xl bg-emerald-600 text-white text-base font-semibold flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-md"
        >
          <i className="fas fa-rocket text-sm" />
          Get Started
        </button>
      </div>
    </div>
  );
};

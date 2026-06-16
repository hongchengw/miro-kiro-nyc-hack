import React from "react";
import { DashboardStats, OutreachMessage, Startup } from "../types";

interface Props {
  stats: DashboardStats;
  messages: OutreachMessage[];
  startups: Startup[];
  onGoToTargets: () => void;
  onGoToGenerate: () => void;
}

/**
 * Dashboard — "show reply rate lift, response time, positive-reply count,
 * and match quality scores per startup." (from Demo Flow in Miro spec)
 */
export const DashboardScreen: React.FC<Props> = ({
  stats,
  messages,
  startups,
  onGoToTargets,
  onGoToGenerate,
}) => {
  const getStartupName = (id: string) => startups.find((s) => s.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="flex items-center gap-2 px-6 h-14 border-b border-gray-200 bg-white shadow-sm">
        <i className="fas fa-bolt text-emerald-600" />
        <span className="text-gray-900 font-bold">InternAI</span>
      </header>

      <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        {/* Stats — from demo flow: reply rate lift, response time, positive-reply count, match quality */}
        <div className="grid grid-cols-2 gap-3">
          <Stat icon="fa-chart-line" color="text-emerald-600" label="Reply Rate" value={`${stats.replyRate.toFixed(0)}%`} />
          <Stat icon="fa-paper-plane" color="text-cyan-600" label="Sent" value={stats.totalSent} />
          <Stat icon="fa-thumbs-up" color="text-emerald-600" label="Positive Replies" value={stats.positiveReplies} />
          <Stat icon="fa-clock" color="text-amber-600" label="Avg Response" value={`${stats.avgResponseTime}h`} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onGoToTargets}
            className="flex-1 h-10 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-emerald-300 transition-colors shadow-sm"
          >
            <i className="fas fa-building text-gray-500 text-xs" />
            Manage Targets
          </button>
          <button
            onClick={onGoToGenerate}
            className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors shadow-md"
          >
            <i className="fas fa-magic text-xs" />
            Generate
          </button>
        </div>

        {/* Recent messages */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Recent Outreach</h2>
          {messages.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm">
              <i className="fas fa-inbox text-3xl text-gray-300 mb-2" />
              <p className="text-sm text-gray-600">No messages yet. Add startups and generate your first outreach!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.slice(0, 8).map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl bg-white border border-gray-200 p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getStartupName(msg.startupId)}</p>
                    <p className="text-xs text-gray-600">{msg.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-medium ${msg.status === "replied" ? "text-emerald-600" : msg.status === "sent" ? "text-cyan-600" : "text-gray-500"}`}>
                      {msg.status}
                    </span>
                    <p className="text-[11px] text-gray-500">Match: {msg.matchScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function Stat({ icon, color, label, value }: { icon: string; color: string; label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <i className={`fas ${icon} text-xs ${color}`} />
        <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

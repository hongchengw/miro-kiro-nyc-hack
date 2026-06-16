import React, { useState } from "react";
import { UserProfile, Startup, OutreachMessage, StartupLead } from "./types";
import { engine } from "./services/engine";
import { LandingScreen } from "./screens/LandingScreen";
import { ProfileSetupScreen } from "./screens/ProfileSetupScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TargetsScreen } from "./screens/TargetsScreen";
import { GenerateScreen } from "./screens/GenerateScreen";
import { LeadsScreen } from "./screens/LeadsScreen";

type Screen = "landing" | "profile" | "dashboard" | "targets" | "generate" | "leads";

/**
 * InternAI — Personalized startup outreach in your voice.
 * Generated from Miro board: https://miro.com/app/board/uXjVHEjL1q0=/
 *
 * Flow (from Miro flowchart):
 *   Landing → Upload Profile → Dashboard → Target List / Generate → Learn
 */
const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);

  const handleProfileComplete = (profile: UserProfile) => {
    engine.setProfile(profile);
    setScreen("dashboard");
  };

  const handleAddStartup = (startup: Startup) => {
    engine.addStartups([startup]);
    setStartups([...engine.getStartups()]);
  };

  const handleUpdateStartup = (id: string, updates: Partial<Startup>) => {
    const updated = startups.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setStartups(updated);
    // Update in engine as well
    engine.updateStartup(id, updates);
  };

  const handleAddLeadToTargets = (lead: StartupLead) => {
    const startup: Startup = {
      id: lead.id,
      name: lead.name,
      founderName: "Founder", // User will need to fill this when generating
      website: lead.website,
      product: lead.matchReason,
      description: `${lead.industry} startup looking for ${lead.hiringFor.join(", ")}`,
      stage: lead.stage,
      techStack: lead.techStack,
      industry: lead.industry,
      scrapedAt: new Date().toISOString(),
      outreachStatus: "not-sent",
      feedback: "",
      addedAt: new Date().toISOString(),
    };
    handleAddStartup(startup);
  };

  const handleGenerate = async (startup: Startup): Promise<OutreachMessage> => {
    const research = await engine.researchStartup(startup);
    const msg = await engine.generateMessage(startup, research);
    setMessages([...engine.getMessages()]);
    return msg;
  };

  const stats = engine.getStats();

  switch (screen) {
    case "landing":
      return <LandingScreen onGetStarted={() => setScreen("profile")} />;

    case "profile":
      return (
        <ProfileSetupScreen
          onComplete={handleProfileComplete}
          onBack={() => setScreen("landing")}
        />
      );

    case "dashboard":
      return (
        <DashboardScreen
          stats={stats}
          messages={messages}
          startups={startups}
          onGoToTargets={() => setScreen("targets")}
          onGoToGenerate={() => setScreen("generate")}
          onGoToLeads={() => setScreen("leads")}
        />
      );

    case "targets":
      return (
        <TargetsScreen
          startups={startups}
          onAdd={handleAddStartup}
          onUpdate={handleUpdateStartup}
          onGenerate={(s) => {
            handleGenerate(s);
            setScreen("generate");
          }}
          onBack={() => setScreen("dashboard")}
        />
      );

    case "leads":
      return (
        <LeadsScreen
          profile={engine.getProfile()}
          onAddToTargets={handleAddLeadToTargets}
          onBack={() => setScreen("dashboard")}
        />
      );

    case "generate":
      return (
        <GenerateScreen
          startups={startups}
          onGenerate={handleGenerate}
          onBack={() => setScreen("dashboard")}
        />
      );
  }
};

export default App;

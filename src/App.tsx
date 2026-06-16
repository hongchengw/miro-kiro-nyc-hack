import React, { useState } from "react";
import { UserProfile, Startup, OutreachMessage } from "./types";
import { engine } from "./services/engine";
import { LandingScreen } from "./screens/LandingScreen";
import { ProfileSetupScreen } from "./screens/ProfileSetupScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TargetsScreen } from "./screens/TargetsScreen";
import { GenerateScreen } from "./screens/GenerateScreen";

type Screen = "landing" | "profile" | "dashboard" | "targets" | "generate";

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
        />
      );

    case "targets":
      return (
        <TargetsScreen
          startups={startups}
          onAdd={handleAddStartup}
          onGenerate={(s) => {
            handleGenerate(s);
            setScreen("generate");
          }}
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

"use client";

import { createContext, useContext } from "react";
import type { Company, UserProfile, Tier } from "@vector/types";

interface DashboardContextValue {
  company: Company;
  userProfile: UserProfile;
  tier: Tier;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}

export function DashboardProvider({
  company,
  userProfile,
  tier,
  children,
}: {
  company: Company;
  userProfile: UserProfile;
  tier: Tier;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ company, userProfile, tier }}>
      {children}
    </DashboardContext.Provider>
  );
}

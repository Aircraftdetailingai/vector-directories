"use client";

import { createContext, useContext } from "react";
import type { Company, UserProfile, Tier } from "@vector/types";

interface DashboardContextValue {
  company: Company | null;
  userProfile: UserProfile | null;
  tier: Tier;
}

const DashboardContext = createContext<DashboardContextValue>({
  company: null,
  userProfile: null,
  tier: "basic",
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function DashboardProvider({
  company,
  userProfile,
  tier,
  children,
}: DashboardContextValue & { children: React.ReactNode }) {
  return (
    <DashboardContext.Provider value={{ company, userProfile, tier }}>
      {children}
    </DashboardContext.Provider>
  );
}

export { DashboardProvider };

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface DashboardContextType {
  refresh: number;
  triggerRefresh: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <DashboardContext.Provider
      value={{
        refresh,
        triggerRefresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
}
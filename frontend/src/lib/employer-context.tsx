"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setEmployerId as setApiEmployerId } from "./api";

interface EmployerContextValue {
  employerId: string | null;
  employerName: string;
  setEmployer: (id: string, name: string) => void;
}

const EmployerContext = createContext<EmployerContextValue>({
  employerId: null,
  employerName: "",
  setEmployer: () => {},
});

const EMPLOYERS = [
  { id: "1", name: "TechCorp" },
  { id: "2", name: "DataInc" },
] as const;

export function EmployerProvider({ children }: { children: React.ReactNode }) {
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [employerName, setEmployerName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("vonq_employer_id");
    const savedName = localStorage.getItem("vonq_employer_name");
    if (saved && savedName) {
      setEmployerId(saved);
      setEmployerName(savedName);
      setApiEmployerId(saved);
    } else {
      setEmployerId(EMPLOYERS[0].id);
      setEmployerName(EMPLOYERS[0].name);
      setApiEmployerId(EMPLOYERS[0].id);
    }
  }, []);

  const setEmployer = (id: string, name: string) => {
    setEmployerId(id);
    setEmployerName(name);
    setApiEmployerId(id);
    localStorage.setItem("vonq_employer_id", id);
    localStorage.setItem("vonq_employer_name", name);
  };

  return (
    <EmployerContext.Provider value={{ employerId, employerName, setEmployer }}>
      {children}
    </EmployerContext.Provider>
  );
}

export function useEmployer() {
  return useContext(EmployerContext);
}

export { EMPLOYERS };

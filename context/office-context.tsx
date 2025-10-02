'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface Office {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

interface OfficeContextValue {
  currentOffice: Office | null;
  setCurrentOffice: React.Dispatch<React.SetStateAction<Office | null>>;
}

const OfficeContext = createContext<OfficeContextValue | undefined>(undefined);

export function OfficeProvider({ children }: { children: ReactNode }) {
  const [currentOffice, setCurrentOffice] = useState<Office | null>(null);

  // Example: Load persisted office from localStorage or API when app starts
  useEffect(() => {
    const savedOffice = localStorage.getItem('currentOffice');
    if (savedOffice) {
      try {
        setCurrentOffice(JSON.parse(savedOffice));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  // Persist office on changes
  useEffect(() => {
    if (currentOffice) {
      localStorage.setItem('currentOffice', JSON.stringify(currentOffice));
    } else {
      localStorage.removeItem('currentOffice');
    }
  }, [currentOffice]);

  return (
    <OfficeContext.Provider value={{ currentOffice, setCurrentOffice }}>
      {children}
    </OfficeContext.Provider>
  );
}

/**
 * Hook to access current office state and updater
 */
export function useOffice() {
  const context = useContext(OfficeContext);
  if (!context) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
}

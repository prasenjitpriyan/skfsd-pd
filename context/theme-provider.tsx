'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: 'class' | 'data-theme';
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'skfsd-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (typeof window !== 'undefined'
        ? (localStorage.getItem(storageKey) as Theme)
        : defaultTheme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // disable transitions temporarily
    if (disableTransitionOnChange) {
      root.style.transition = 'none';
      window.setTimeout(() => {
        root.style.transition = '';
      }, 0);
    }

    // reset theme
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      if (attribute === 'class') {
        root.classList.add(systemTheme);
      } else {
        root.setAttribute('data-theme', systemTheme);
      }
      return;
    }

    if (attribute === 'class') {
      root.classList.add(theme);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

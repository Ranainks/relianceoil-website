import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ storageKey = 'ui_theme', children }) {
  const [dark, setDark] = useState(() => localStorage.getItem(storageKey) === 'dark');

  useEffect(() => {
    localStorage.setItem(storageKey, dark ? 'dark' : 'light');
  }, [dark, storageKey]);

  const toggle = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

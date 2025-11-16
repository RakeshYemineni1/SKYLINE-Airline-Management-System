import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      primary: '#00dd00',
      secondary: '#00bb00',
      background: '#000000',
      surface: '#111111',
      card: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      error: '#ff4444',
      success: '#00ff00',
      warning: '#ffaa00'
    } : {
      primary: '#009900',
      secondary: '#007700',
      background: '#ffffff',
      surface: '#f8f8f8',
      card: '#ffffff',
      text: '#000000',
      textSecondary: '#666666',
      border: '#dddddd',
      error: '#cc0000',
      success: '#00aa00',
      warning: '#cc8800'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
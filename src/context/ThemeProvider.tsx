import React, { useContext } from "react";

import { changeTheme } from "helpers";

export enum theme {
  THEME_DARK = "dark",
  THEME_LIGHT = "light",
}

const ThemeContext = React.createContext<{
  change: Function;
} | null>(null);

export const ThemeProvider = ({ children, ...props }) => {
  const change = (name) => {
    changeTheme(name);
  };

  return (
    <ThemeContext.Provider value={{ change }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);

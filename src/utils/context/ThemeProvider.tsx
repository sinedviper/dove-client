import React, { useContext } from "react";

import { changeCssColor, changeCssTransition } from "utils/helpers";

const ThemeContext = React.createContext<{
  changeTheme: Function;
  changeAnimation: Function;
} | null>(null);

export const ThemeProvider = ({ children, ...props }) => {
  const changeTheme = (name) => {
    changeCssColor(name);
  };

  const changeAnimation = (name) => {
    changeCssTransition(name);
  };

  return (
    <ThemeContext.Provider value={{ changeTheme, changeAnimation }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);

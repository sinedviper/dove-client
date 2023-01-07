import React, { useContext } from "react";

import { changeCssColor, changeCssTransition } from "utils/helpers";

const ThemeContext = React.createContext<{
  changeTheme: (val:string)=>void;
  changeAnimation: (val:string)=>void;
} | null>(null);


export const ThemeProvider = ({ children, ...props }:{children: React.ReactNode}) => {
  const changeTheme = (name:string) => {
    changeCssColor(name);
  };

  const changeAnimation = (name: string) => {
    changeCssTransition(name);
  };

  return (
    <ThemeContext.Provider value={{ changeTheme, changeAnimation }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

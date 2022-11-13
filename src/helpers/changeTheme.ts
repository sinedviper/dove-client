export const changeTheme = (theme) => {
  const root = document.querySelector(":root") as HTMLSelectElement;

  const cssVariable = [
    "white",
    "light",
    "dark",
    "gray",
    "gray-middle",
    "gray-dark",
    "gray-light",
    "primary",
    "primary-dark",
    "primary-light",
    "primary-middle",
    "primary-opacity",
  ];

  cssVariable.forEach((element) => {
    root.style.setProperty(`--${element}`, `var(--theme-${theme}-${element})`);
  });
};

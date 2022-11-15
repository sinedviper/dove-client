export const changeCssColor = (theme) => {
  const root = document.querySelector(":root") as HTMLSelectElement;

  const cssVariable = [
    "primary",
    "primary-dark",
    "primary-light",
    "primary-middle",
    "text-first",
    "text-second",
    "text-sixth",
    "text-third",
    "text-fourth",
    "text-fiveth",
    "text-seventh",
    "background-first",
    "background-second",
    "background-third",
    "icon-first",
    "icon-second",
    "border-first",
    "border-second",
    "opacity-box",
    "opacity-box-dark",
    "opacity-box-second",
    "primary-opacity",
  ];

  cssVariable.forEach((element) => {
    root.style.setProperty(`--${element}`, `var(--theme-${theme}-${element})`);
  });
};

export const changeCssTransition = (theme) => {
  const root = document.querySelector(":root") as HTMLSelectElement;

  const cssVariable = ["transition"];

  cssVariable.forEach((element) => {
    root.style.setProperty(`--${element}`, `var(--${element}-${theme})`);
  });
};

/*
  

*/

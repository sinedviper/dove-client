import React from "react";
import cn from "classnames";

import { HomeProps } from "./Home.props";

import styles from "./Home.module.css";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  return (
    <main className={cn(className, styles.main)} {...props}>
      Home
    </main>
  );
};

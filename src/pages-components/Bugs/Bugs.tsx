import React from "react";
import cn from "classnames";

import { FormBugs } from "components/forms";

import { BugsProps } from "./Bugs.props";
import styles from "./Bugs.module.css";

export const Bugs = ({ className, ...props }: BugsProps): JSX.Element => {
  return (
    <main className={cn(className, styles.main)} {...props}>
      <FormBugs />
    </main>
  );
};

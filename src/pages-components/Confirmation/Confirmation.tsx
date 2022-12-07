import React from "react";
import cn from "classnames";

import { FormConfirmation } from "components/forms";

import { ConfirmationProps } from "./Confirmation.props";
import styles from "./Confirmation.module.css";

export const Confirmation = ({
  className,
  ...props
}: ConfirmationProps): JSX.Element => {
  return (
    <main className={cn(className, styles.main)} {...props}>
      <FormConfirmation />
    </main>
  );
};

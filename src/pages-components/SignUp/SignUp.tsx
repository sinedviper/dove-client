import React from "react";
import cn from "classnames";

import { FormSignUp } from "components/forms";

import { SignUpProps } from "./SignUp.props";
import styles from "./SignUp.module.css";

export const SignUp = ({ className, ...props }: SignUpProps): JSX.Element => {
  return (
    <main className={cn(className, styles.main)} {...props}>
      <FormSignUp />
    </main>
  );
};

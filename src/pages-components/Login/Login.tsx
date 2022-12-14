import React from "react";
import cn from "classnames";

import { FormLogin } from "components/forms";

import { LoginProps } from "./Login.props";
import styles from "./Login.module.css";

export const Login = ({ className, ...props }: LoginProps): JSX.Element => {
  return (
    <main className={cn(className, styles.main)} {...props}>
      <FormLogin />
    </main>
  );
};

/* eslint-disable eqeqeq */
import React, { ForwardedRef, forwardRef, useState } from "react";
import cn from "classnames";

import styles from "./Input.module.css";
import { InputProps } from "./Input.props";

export const Input = forwardRef(
  (
    { error, placeholderName, className, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [type, setType] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    return (
      <div className={cn(styles.wrapper)}>
        <label
          className={cn(styles.placeholder, {
            [styles.labelOn]: type == true,
            [styles.errorLabel]: error == true,
          })}
        >
          {placeholderName}
        </label>
        <input
          className={cn(className, styles.input, {
            [styles.inputOn]: type == true,
            [styles.error]: error == true,
          })}
          ref={ref}
          onFocus={() => setType(true)}
          value={value}
          onBlurCapture={() => {
            if (value == "") {
              setType(false);
            }
          }}
          {...props}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    );
  }
);

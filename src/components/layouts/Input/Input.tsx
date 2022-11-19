import React, { ForwardedRef, forwardRef, useState } from "react";
import cn from "classnames";

import { EyeCloseIcon, EyeIcon } from "assets";

import { InputProps } from "./Input.props";
import styles from "./Input.module.css";

export const Input = forwardRef(
  (
    {
      password = false,
      error,
      text,
      setText,
      placeholderName,
      className,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [eye, setEye] = useState<boolean>(true);
    const [type, setType] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    return (
      <div className={cn(styles.wrapper)}>
        <label
          className={cn(styles.placeholder, {
            [styles.labelOn]: type === true,
            [styles.errorLabel]: error === true,
          })}
        >
          {placeholderName}
          {error && " Invalid"}
        </label>
        <input
          className={cn(className, styles.input, {
            [styles.inputOn]: type === true,
            [styles.error]: error === true,
            [styles.password]: password === true,
          })}
          ref={ref}
          onFocus={() => setType(true)}
          type={password && eye ? "password" : "text"}
          value={text ? text : value}
          onBlurCapture={() => setType(false)}
          {...props}
          onChange={(e) => {
            setText ? setText(e.target.value) : setValue(e.target.value);
          }}
        />
        <span className={styles.eyeWrapper}>
          {password === true ? (
            eye ? (
              <EyeIcon
                className={cn(styles.eye, {
                  [styles.eyeOn]: type === true,
                  [styles.errorOn]: error === true,
                })}
                onClick={() => setEye(false)}
              />
            ) : (
              <EyeCloseIcon
                className={cn(styles.eye, {
                  [styles.eyeOn]: type === true,
                  [styles.errorOn]: error === true,
                })}
                onClick={() => setEye(true)}
              />
            )
          ) : (
            ""
          )}
        </span>
      </div>
    );
  }
);

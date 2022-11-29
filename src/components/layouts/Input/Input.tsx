import React, { ForwardedRef, forwardRef, useState } from "react";
import cn from "classnames";

import { EyeCloseIcon, EyeIcon, InfoIcon } from "assets";

import { InputProps } from "./Input.props";
import styles from "./Input.module.css";

export const Input = forwardRef(
  (
    {
      password = false,
      check = false,
      error,
      text,
      setText,
      placeholderName,
      className,
      tabIndex,
      notification = false,
      notificationText = "Please enter correctly",
      textCheckPassNew,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [eye, setEye] = useState<boolean>(true);
    const [type, setType] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [notifica, setNotifica] = useState<boolean>(false);

    const handleCheckPass = (): number => {
      let check = 0;
      let flagOne = false;
      let flagTwo = false;
      let flagThree = false;
      if (
        flagOne === false &&
        ((text && text.search(/[A-Z]/g) >= 0) || value.search(/[A-Z]/g) >= 0)
      ) {
        check++;
        flagOne = true;
      } else if (
        flagOne &&
        ((text && text.search(/[A-Z]/g) < 0) || value.search(/[A-Z]/g) < 0)
      ) {
        check--;
        flagOne = false;
      }

      if (
        flagTwo === false &&
        ((text && text.search(/[0-9]/g) >= 0) || value.search(/[0-9]/g) >= 0)
      ) {
        check++;
        flagTwo = true;
      } else if (
        flagTwo &&
        ((text && text.search(/[0-9]/g) < 0) || value.search(/[0-9]/g) < 0)
      ) {
        check--;
        flagTwo = false;
      }

      if (
        flagThree === false &&
        ((text && text.length >= 8) || value.length >= 8)
      ) {
        check++;
        flagThree = true;
      } else if (flagThree && ((text && text.length < 8) || value.length < 8)) {
        check--;
        flagThree = false;
      }

      return check;
    };

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
          tabIndex={tabIndex}
          className={cn(className, styles.input, {
            [styles.inputOn]: type === true,
            [styles.error]: error === true,
            [styles.password]: password === true,
            [styles.checkPasswordNes]:
              (textCheckPassNew && textCheckPassNew !== value) ||
              (textCheckPassNew && textCheckPassNew !== text),
            [styles.checkPasswordNesOn]:
              (textCheckPassNew && textCheckPassNew === value) ||
              (textCheckPassNew && textCheckPassNew === text),
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
                tabIndex={tabIndex}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEye(false);
                  }
                }}
              />
            ) : (
              <EyeCloseIcon
                className={cn(styles.eye, {
                  [styles.eyeOn]: type === true,
                  [styles.errorOn]: error === true,
                })}
                onClick={() => setEye(true)}
                tabIndex={tabIndex}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEye(true);
                  }
                }}
              />
            )
          ) : (
            ""
          )}
        </span>
        {password === true ? (
          check === true ? (
            <span className={styles.checkWrapper}>
              <span
                className={cn(styles.checkOne, {
                  [styles.checkOn]:
                    (text && text.replaceAll(" ", "") !== "") ||
                    value.replaceAll(" ", "") !== "",
                  [styles.checkText]: handleCheckPass() >= 1,
                })}
              ></span>
              <span
                className={cn(styles.checkTwo, {
                  [styles.checkOn]:
                    (text && text.replaceAll(" ", "") !== "") ||
                    value.replaceAll(" ", "") !== "",
                  [styles.checkText]: handleCheckPass() >= 2,
                  [styles.checkTextBefore]:
                    handleCheckPass() < 2 && handleCheckPass() > 0,
                })}
              ></span>
              <span
                className={cn(styles.checkThree, {
                  [styles.checkOn]:
                    (text && text.replaceAll(" ", "") !== "") ||
                    value.replaceAll(" ", "") !== "",
                  [styles.checkText]: handleCheckPass() === 3,
                  [styles.checkTextBefore]:
                    handleCheckPass() < 3 && handleCheckPass() > 0,
                })}
              ></span>
            </span>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {!error && notification && (
          <>
            <span
              className={styles.infoIcon}
              onMouseMove={() => setNotifica(true)}
              onMouseLeave={() => setNotifica(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setNotifica(!notifica);
                }
              }}
              tabIndex={tabIndex}
            >
              <InfoIcon />
            </span>
            {notifica && (
              <span className={styles.notificaText}>{notificationText}</span>
            )}
          </>
        )}
      </div>
    );
  }
);

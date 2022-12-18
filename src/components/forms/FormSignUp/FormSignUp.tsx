import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import ReactGA from "react-ga";

import { signUp } from "resolvers/user";
import { Input } from "components/layouts";
import { DoveIcon, LoadingIcon } from "assets";
import { useError } from "utils/hooks";
import { useTheme } from "utils/context";

import { FormSignUpProps } from "./FormSignUp.props";
import styles from "./FormSignUp.module.css";

export const FormSignUp = ({
  className,
  ...props
}: FormSignUpProps): JSX.Element => {
  const navigate = useNavigate();
  const themeChange = useTheme();
  const error = useError();

  const [mutateFunction, { loading: loadingMutation }] = useMutation(signUp);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorName, setErrorName] = useState<boolean>(false);
  const [errorSurname, setErrorSurname] = useState<boolean>(false);
  const [errorUsername, setErrorUsername] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);

  const [passwordCheck, setPasswordCheck] = useState<number>(0);

  ReactGA.pageview("/signup");

  //send data in server when user sign up
  const onSubmit = async (): Promise<void> => {
    let checkFields: boolean = true;
    setErrorName(false);
    setErrorSurname(false);
    setErrorUsername(false);
    setErrorEmail(false);
    setErrorPassword(false);

    if (
      name.replaceAll(" ", "") === "" ||
      name.replace(/[A-Za-z]+/g, "").length !== 0 ||
      name.length < 1 ||
      name.length > 40
    ) {
      checkFields = false;
      setErrorName(true);
      error("Name not correct");
    }
    if (surname.replace(/[A-Za-z]+/g, "").length !== 0 || surname.length > 40) {
      checkFields = false;
      setErrorSurname(true);
      error("Surname not correct");
    }
    if (
      username.replaceAll(" ", "") === "" ||
      username.replace(/[A-Za-z0-9]+/g, "").length !== 0 ||
      username.length < 3 ||
      username.length > 40
    ) {
      checkFields = false;
      setErrorUsername(true);
      error("Username not correct");
    }
    if (
      email.replaceAll(" ", "") === "" ||
      // eslint-disable-next-line no-useless-escape
      email.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "").length !== 0 ||
      email.length < 3 ||
      email.length > 40
    ) {
      checkFields = false;
      setErrorEmail(true);
      error("Email not correct");
    }

    if (password.length < 8 || password.length > 40 || passwordCheck < 3) {
      checkFields = false;
      setErrorPassword(true);
      error("Password not correct");
    }

    if (checkFields) {
      await mutateFunction({
        variables: { input: { name, surname, username, email, password } },
      }).then((res) => {
        const data = res?.data.signupUser;
        if (data.status === "Invalid") {
          setErrorUsername(true);
          setErrorEmail(true);
          error(data.message);
        }
        if (data.status === "Success") {
          setErrorUsername(false);
          setErrorEmail(false);
          navigate("/confirmation");
        }
      });
    }
  };

  //keeps track of the theme of the system
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      themeChange?.changeTheme("dark");
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      themeChange?.changeTheme("light");
    }
  }, [themeChange]);

  return (
    <section className={cn(className, styles.form)} {...props}>
      <DoveIcon className={styles.svg} />
      <h2 className={styles.head}>Sign Up in Dove</h2>
      <p className={styles.text}>
        Please fill in all fields, if you don't want to then go fuck yourself
      </p>
      <div className={styles.login}>
        <Input
          placeholderName={"Name"}
          text={name}
          setText={setName}
          error={errorName}
          notification={true}
          notificationText={
            "Name must be between 1 and 40 characters and have a letters"
          }
        />
        <Input
          text={surname}
          setText={setSurname}
          placeholderName={"Surname(optional)"}
          error={errorSurname}
          notification={true}
          notificationText={
            "Surname must be between 1 and 40 characters and have a letters"
          }
        />
        <Input
          text={username}
          setText={setUsername}
          placeholderName={"Username"}
          error={errorUsername}
          notification={true}
          notificationText={
            "Username must be between 3 and 40 characters and have a letters and a numbers"
          }
        />
        <Input
          text={email}
          setText={setEmail}
          placeholderName={"Email"}
          error={errorEmail}
          notification={true}
          notificationText={
            "Email must be between 3 and 40 characters and have correctly email standart"
          }
        />
        <Input
          text={password}
          setText={setPassword}
          error={errorPassword}
          placeholderName={"Password"}
          setPassword={setPasswordCheck}
          notification={true}
          notificationText={
            "Password must be between 8 and 40 characters and have a capital letter and a number"
          }
          check={true}
          password={true}
        />
        <button onClick={onSubmit} className={styles.button}>
          <p>SIGN UP</p>
          <span className={styles.loading}>
            {loadingMutation ? <LoadingIcon /> : ""}
          </span>
        </button>
        <p className={styles.link}>
          <span
            className={styles.reg}
            onClick={() => navigate("/login")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate("/login");
              }
            }}
            tabIndex={0}
          >
            LOGIN
          </span>
        </p>
      </div>
    </section>
  );
};

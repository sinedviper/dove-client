import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { signUp } from "resolvers/user";
import { Input } from "components/layouts";
import { DoveIcon, LoadingIcon } from "assets";
import { useError } from "utils/hooks";

import { FormSignUpProps } from "./FormSignUp.props";
import styles from "./FormSignUp.module.css";
import { useTheme } from "utils/context";

interface IFormInput {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

export const FormSignUp = ({
  className,
  ...props
}: FormSignUpProps): JSX.Element => {
  const navigate = useNavigate();
  const themeChange = useTheme();
  const error = useError();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const [mutateFunction, { loading: loadingMutation }] = useMutation(signUp);

  const [password, setPassword] = useState<number>(0);

  const onSubmit = async (input: IFormInput): Promise<void> => {
    if (password < 3) {
      error("Password uncorrectly");
    }
    if (password === 3) {
      await mutateFunction({ variables: { input } }).then((res) => {
        const data = res?.data.signupUser;
        data.status === "Invalid" && error(data.message);
        data.status === "Success" && navigate("/login");
      });
    }
  };

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
      <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>
        <Input
          placeholderName={"Name"}
          error={Boolean(errors.name)}
          notification={true}
          notificationText={"Name must be between 1 and 40 characters"}
          {...register("name", {
            required: true,
            minLength: 1,
            maxLength: 40,
          })}
        />
        {errors.name && (
          <span className={styles.error}>
            Name must be between 1 and 40 characters
          </span>
        )}
        <Input
          placeholderName={"Surname(optional)"}
          error={Boolean(errors.surname)}
          notification={true}
          notificationText={"Surname must be between 1 and 40 characters"}
          {...register("surname", {
            required: false,
            minLength: 1,
            maxLength: 40,
          })}
        />
        {errors.surname && (
          <span className={styles.error}>
            Surname must be between 1 and 40 characters
          </span>
        )}
        <Input
          placeholderName={"Username"}
          error={Boolean(errors.username)}
          notification={true}
          notificationText={"Username must be between 3 and 40 characters"}
          {...register("username", {
            required: true,
            minLength: 3,
            maxLength: 40,
          })}
        />
        {errors.username && (
          <span className={styles.error}>
            Username must be between 3 and 40 characters
          </span>
        )}
        <Input
          placeholderName={"Email"}
          error={Boolean(errors.email)}
          notification={true}
          notificationText={"Email must be between 3 and 40 characters"}
          {...register("email", {
            required: true,
            minLength: 3,
            maxLength: 40,
          })}
        />
        {errors.email && (
          <span className={styles.error}>
            Email must be between 3 and 40 characters
          </span>
        )}
        <Input
          error={Boolean(errors.password)}
          placeholderName={"Password"}
          setPassword={setPassword}
          notification={true}
          notificationText={
            "Password must be between 8 and 40 characters and have a capital letter and a number"
          }
          {...register("password", {
            required: true,
            minLength: 8,
            maxLength: 40,
          })}
          check={true}
          password={true}
        />
        {errors.password && (
          <span className={styles.error}>
            Password must be between 8 and 40 characters and have a capital
            letter and a number
          </span>
        )}
        <button type='submit' className={styles.button}>
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
      </form>
    </section>
  );
};

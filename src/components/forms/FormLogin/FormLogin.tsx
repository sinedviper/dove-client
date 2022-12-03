import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { useAuthorization, useError } from "utils/hooks";
import { useTheme } from "utils/context";
import { getMe, loginUser } from "resolvers/user";
import { Input } from "components/layouts";
import { actionAddUser } from "store";
import { DoveIcon, LoadingIcon } from "assets";

import { FormLoginProps } from "./FormLogin.props";
import styles from "./FormLogin.module.css";

interface IFormInput {
  email: string;
  password: string;
}

export const FormLogin = ({
  className,
  ...props
}: FormLoginProps): JSX.Element => {
  const navigate = useNavigate();
  const themeChange = useTheme();
  const error = useError();
  const autorization = useAuthorization();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const [queryFunctionUser, { loading: loadingQueryUser }] = useLazyQuery(
    getMe,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorization({ data: data.getMe, actionAdd: actionAddUser });
        navigate("/");
      },
      onError(errorData) {
        error(errorData.message);
      },
    }
  );

  const [mutateFunction, { loading: loadingMutation }] = useMutation(
    loginUser,
    { fetchPolicy: "network-only" }
  );
  //when a user logs in sends data and receives a user token
  const onSubmit = async (input: IFormInput): Promise<void> => {
    await mutateFunction({ variables: { input } }).then(async (res) => {
      const data = res?.data.loginUser;
      data.status === "Invalid" && error(data.message);
      if (data.status === "Success") {
        localStorage.setItem("token", data.access_token);
        await queryFunctionUser();
      }
    });
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
    <>
      <section className={cn(className, styles.form)} {...props}>
        <DoveIcon className={styles.svg} />
        <h2 className={styles.head}>Login in Dove</h2>
        <p className={styles.text}>
          Please enter your full email and enter your full password.
        </p>
        <p className={styles.text}>
          Note that you need an existing account to log in to Dove. To sign up
          for Dove, use the link down.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>
          <Input
            placeholderName={"Email"}
            error={Boolean(errors.email)}
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
            {...register("password", {
              required: true,
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
          />
          {errors.password && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          <button type='submit' className={styles.button}>
            <p>NEXT</p>
            <span className={styles.loading}>
              {loadingMutation || loadingQueryUser ? <LoadingIcon /> : ""}
            </span>
          </button>
          <p className={styles.link}>
            <span
              className={styles.reg}
              onClick={() => navigate("/sigup")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("/sigup");
                }
              }}
              tabIndex={0}
            >
              SIGN UP
            </span>
          </p>
        </form>
      </section>
    </>
  );
};

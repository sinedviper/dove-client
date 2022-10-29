import React from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormLoginProps } from "./FormLogin.props";
import { TelegramIcon } from "assets";
import { Input } from "components";

import styles from "./FormLogin.module.css";
import { client } from "index";
import { loginUser } from "mutation";
import { loadUser } from "store";
import { useAppDispatch } from "hooks";

interface IFormInput {
  email: string;
  password: string;
}

export const FormLogin = ({
  className,
  ...props
}: FormLoginProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit = async (input: IFormInput): Promise<void> => {
    const data = await client
      .mutate({ mutation: loginUser, variables: { input } })
      .catch((err) => console.log(err));
    localStorage.setItem("token", data?.data.loginUser.access_token);

    dispatch(loadUser());
    navigate("/");
  };

  return (
    <section className={cn(className, styles.form)} {...props}>
      <TelegramIcon className={styles.svg} />
      <h2 className={styles.head}>Login in Telegram</h2>
      <p className={styles.text}>
        Please enter your full email and enter your full password.
      </p>
      <p className={styles.text}>
        Note that you need an existing account to log in to Telegram. To sign up
        for Telegram, use the link down.
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
        />
        {errors.password && (
          <span className={styles.error}>
            Password must be between 8 and 40 characters
          </span>
        )}
        <input type='submit' value={"NEXT"} className={styles.button} />
        <p className={styles.link}>
          <span className={styles.reg} onClick={() => navigate("/sigup")}>
            HERE REGISTRATION
          </span>
        </p>
      </form>
    </section>
  );
};

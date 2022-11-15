/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";

import { FormLoginProps } from "./FormLogin.props";
import { LoadingIcon, TelegramIcon } from "assets";
import { Input } from "components";
import { getChats, getContact, getMe, loginUser } from "mutation";
import { actionAddUser } from "store";
import { useAppDispatch } from "hooks";

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
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const [queryFunctionUser, { loading: loadingQueryUser }] =
    useLazyQuery(getMe);

  const [mutateFunction, { loading: loadingMutation }] = useMutation(loginUser);

  const onSubmit = async (input: IFormInput): Promise<void> => {
    await mutateFunction({ variables: { input } })
      .then(async (res) => {
        const data = res?.data.loginUser;
        if (data.status === "Invalid") {
          toast.error(data.message);
        }
        if (data.status === "Success") {
          localStorage.setItem("token", data.access_token);
          await queryFunctionUser().then(async (res) => {
            const user = res.data.getMe;
            if (user.status === "Invalid") {
              toast.error(user.message);
            }
            if (user.status === "Success") {
              toast.success("Data confirmed");
              dispatch(actionAddUser(user.data));
            }
          });
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };

  return (
    <>
      <section className={cn(className, styles.form)} {...props}>
        <TelegramIcon className={styles.svg} />
        <h2 className={styles.head}>Login in Telegram</h2>
        <p className={styles.text}>
          Please enter your full email and enter your full password.
        </p>
        <p className={styles.text}>
          Note that you need an existing account to log in to Telegram. To sign
          up for Telegram, use the link down.
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
            <span className={styles.reg} onClick={() => navigate("/sigup")}>
              SIGN UP
            </span>
          </p>
        </form>
      </section>
    </>
  );
};

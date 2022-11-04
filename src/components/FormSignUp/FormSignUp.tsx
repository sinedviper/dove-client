import React from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormSignUpProps } from "./FormSignUp.props";
import { TelegramIcon } from "assets";
import { Input } from "components";
import { client } from "index";
import { signUp } from "mutation";

import styles from "./FormSignUp.module.css";
import { toast } from "react-toastify";

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
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit = async (input: IFormInput): Promise<void> => {
    const data = await client
      .mutate({ mutation: signUp, variables: { input } })
      .catch((err) => console.log(err));

    if (data?.data.signupUser.status === "Invalid") {
      toast.error(data?.data.signupUser.message);
    }
    if (data?.data.signupUser.status === "Success") {
      toast.success("Account created");
      navigate("/login");
    }
  };

  return (
    <section className={cn(className, styles.form)} {...props}>
      <TelegramIcon className={styles.svg} />
      <h2 className={styles.head}>Sign Up in Telegram</h2>
      <p className={styles.text}>Please fill in all fields.</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>
        <Input
          placeholderName={"Name"}
          error={Boolean(errors.name)}
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
          placeholderName={"Surname"}
          error={Boolean(errors.surname)}
          {...register("surname", {
            required: true,
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
        <input type='submit' value={"Sign Up"} className={styles.button} />
        <p className={styles.link}>
          <span className={styles.reg} onClick={() => navigate("/login")}>
            LOGIN
          </span>
        </p>
      </form>
    </section>
  );
};

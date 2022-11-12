/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import { EditsProps } from "./Edits.props";
import { BackIcon, SupheedIcon } from "assets";
import { Input } from "components";
import { colorCard } from "helpers";
import { updateUser } from "mutation";
import { useAppDispatch } from "hooks";
import { actionUserAdd } from "store";

import styles from "./Edits.module.css";

interface IFormInput {
  name: string;
  surname: string;
  username: string;
  email: string;
  mainPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export const Edits = ({
  className,
  edit,
  setEdit,
  user,
  ...props
}: EditsProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const dispatch = useAppDispatch();
  //res in db
  const [mutateFunction] = useMutation(updateUser);

  const [swiper, setSwiper] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(
    user?.username ? user.username : ""
  );
  const [name, setName] = useState<string>(user?.name ? user?.name : "");
  const [surname, setSurname] = useState<string>(
    user?.surname ? user?.surname : ""
  );
  const [email, setEmail] = useState<string>(user?.email ? user?.email : "");
  const [password, setPassword] = useState<string>("");
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [passwordReapeat, setPasswordReapeat] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorPasswordNew, setErrorPasswordNew] = useState<string>("");
  const [errorPasswordReapeat, setErrorPasswordReapeat] = useState<string>("");

  const color = colorCard(String(user?.name.toUpperCase().slice()[0]));

  const onSubmit = async (input: IFormInput): Promise<void> => {
    let obj = {};
    //Check main input on value
    if (user?.username !== username) {
      obj = { username: input.username };
    }
    if (user?.name !== name) {
      obj = { ...obj, name: input.name };
    }
    if (user?.surname !== surname) {
      obj = { ...obj, surname: input.surname };
    }
    if (user?.email !== email) {
      obj = { ...obj, email: input.email };
    }
    //Check password on value
    if (input.mainPassword && input.newPassword && input.repeatPassword) {
      if (input.newPassword === input.repeatPassword) {
        setErrorPassword("");
        setErrorPasswordNew("");
        setErrorPasswordReapeat("");
        obj = {
          ...obj,
          password: input.mainPassword,
          passwordNew: input.newPassword,
        };
      }

      if (input.newPassword !== input.repeatPassword) {
        setErrorPassword("");
        setErrorPasswordNew("");
        setErrorPasswordReapeat("Please correct repeat password");
      }
    }
    if (!input.mainPassword && input.newPassword && input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("");
      setErrorPasswordReapeat("");
    }
    if (input.mainPassword && !input.newPassword && input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("");
    }
    if (input.mainPassword && input.newPassword && !input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    if (input.mainPassword && !input.newPassword && !input.repeatPassword) {
      setErrorPassword("");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    if (!input.mainPassword && !input.newPassword && input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("");
    }
    if (!input.mainPassword && input.newPassword && !input.repeatPassword) {
      setErrorPassword("Please enter your main password");
      setErrorPasswordNew("Please enter your new password");
      setErrorPasswordReapeat("Please enter your repeat password");
    }
    //Update user
    await mutateFunction({ variables: { input: obj } }).then(async (res) => {
      const data = res.data.updateUser;
      if (data.status === "Invalid") {
        toast.error(data.message);
      }
      if (data.status === "Success") {
        dispatch(actionUserAdd(data.data));
        setPassword("");
        setPasswordNew("");
        setPasswordReapeat("");
        setSubmit(false);
        setEdit(false);
        toast.success("Account update");
      }
    });
  };
  //Check values in input, changed or not, when changed button has see
  useEffect(() => {
    if (
      user?.username !== username ||
      user?.name !== name ||
      user?.surname !== surname ||
      user?.email !== email ||
      passwordReapeat !== "" ||
      password !== "" ||
      passwordNew !== ""
    ) {
      setSubmit(true);
    } else if (
      user?.username === username ||
      user?.name === name ||
      user?.surname === surname ||
      user?.email === email ||
      passwordReapeat === "" ||
      password === "" ||
      passwordNew === ""
    ) {
      setSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, passwordReapeat, passwordNew, username, name, surname, email]);

  return (
    <section
      className={cn(className, styles.editWrapper, {
        [styles.editWrapperOpen]: edit === true,
      })}
      {...props}
    >
      <div className={styles.editHead}>
        <div>
          <BackIcon className={styles.back} onClick={() => setEdit(false)} />
          <h2>Edit Profile</h2>
        </div>
      </div>
      <form
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
        onMouseLeave={() => setSwiper(false)}
        onMouseOut={() => setSwiper(true)}
      >
        <div className={styles.editUser}>
          <div
            className={styles.editPhoto}
            style={{
              background: `linear-gradient(${color?.color1}, ${color?.color2})`,
            }}
          >
            {user?.surname.toUpperCase().slice()[0]}
            {user?.name.toUpperCase().slice()[0]}
          </div>
          <Input
            error={Boolean(errors.name)}
            placeholderName='Name'
            {...register("name", {
              minLength: 1,
              maxLength: 40,
            })}
            text={name}
            setText={setName}
          />
          {errors.name && (
            <span className={styles.error}>
              Name must be between 1 and 40 characters
            </span>
          )}
          <Input
            error={Boolean(errors.surname)}
            placeholderName='Surname(optional)'
            {...register("surname", {
              minLength: 1,
              maxLength: 40,
            })}
            text={surname}
            setText={setSurname}
          />
          {errors.surname && (
            <span className={styles.error}>
              Surname must be between 1 and 40 characters
            </span>
          )}
          <Input placeholderName='Bio(optional)' />
        </div>
        <div className={styles.editInfo}>
          <p>Any details such as age, occupation or city.</p>
          <p>Example: 23 y.o. designer from San Francisco</p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Email</h2>
          <Input
            error={Boolean(errors.email)}
            placeholderName='Email'
            {...register("email", {
              minLength: 3,
              maxLength: 40,
            })}
            text={email}
            setText={setEmail}
          />
          {errors.email && (
            <span className={styles.error}>
              Email must be between 3 and 40 characters
            </span>
          )}
        </div>
        <div className={styles.editInfo}>
          <p>You can change the your email on Telegram.</p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Username</h2>
          <Input
            error={Boolean(errors.username)}
            placeholderName='Username'
            {...register("username", {
              minLength: 3,
              maxLength: 40,
            })}
            text={username}
            setText={setUsername}
          />
          {errors.username && (
            <span className={styles.error}>
              Username must be between 3 and 40 characters
            </span>
          )}
        </div>
        <div className={styles.editInfo}>
          <p>
            You can choose a username on Telegram. If you do people will be able
            to find you by this username.
          </p>
        </div>
        <div className={styles.editUser}>
          <h2 className={styles.usernameEdit}>Password</h2>
          <Input
            error={Boolean(errorPassword ? errorPassword : errors.mainPassword)}
            placeholderName='Main password'
            {...register("mainPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={password}
            setText={setPassword}
          />
          {errors.mainPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPassword && (
            <span className={styles.error}>{errorPassword}</span>
          )}
          <Input
            error={Boolean(
              errorPasswordNew ? errorPasswordNew : errors.newPassword
            )}
            placeholderName='New password'
            {...register("newPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={passwordNew}
            setText={setPasswordNew}
          />
          {errors.newPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPasswordNew && (
            <span className={styles.error}>{errorPasswordNew}</span>
          )}
          <Input
            error={Boolean(
              errorPasswordReapeat
                ? errorPasswordReapeat
                : errors.repeatPassword
            )}
            placeholderName='Repeat password'
            {...register("repeatPassword", {
              minLength: 8,
              maxLength: 40,
            })}
            password={true}
            text={passwordReapeat}
            setText={setPasswordReapeat}
          />
          {errors.repeatPassword && (
            <span className={styles.error}>
              Password must be between 8 and 40 characters
            </span>
          )}
          {errorPasswordReapeat && (
            <span className={styles.error}>{errorPasswordReapeat}</span>
          )}
        </div>
        <div className={cn(styles.editInfo, styles.info)}>
          <p>You can change the your password on Telegram.</p>
        </div>
        <button
          className={cn(styles.supheed, {
            [styles.submit]: submit === true,
          })}
          onClick={handleSubmit(onSubmit)}
        >
          <SupheedIcon />
        </button>
      </form>
    </section>
  );
};

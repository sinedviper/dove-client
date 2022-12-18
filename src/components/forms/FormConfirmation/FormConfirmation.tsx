import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { useAuthorization, useError } from "utils/hooks";
import { useTheme } from "utils/context";
import { confirmationAccount, getMe } from "resolvers/user";
import { Input } from "components/layouts";
import { actionAddUser } from "store/slice";
import { DoveIcon, LoadingIcon } from "assets";

import { FormConfirmationProps } from "./FormConfirmation.props";
import styles from "./FormConfirmation.module.css";

export const FormConfirmation = ({
  className,
  ...props
}: FormConfirmationProps): JSX.Element => {
  const navigate = useNavigate();
  const themeChange = useTheme();
  const error = useError();
  const autorization = useAuthorization();

  const [code, setCode] = useState<string>("");

  const [errorCode, setErrorCode] = useState<boolean>(false);

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
    confirmationAccount,
    { fetchPolicy: "network-only" }
  );

  //when a user logs in sends data and receives a user token
  const onSubmit = async (): Promise<void> => {
    await mutateFunction({ variables: { token: code } }).then(async (res) => {
      const data = res?.data.confirmationUser;
      if (data.status === "Invalid") {
        setErrorCode(true);
        error(data.message);
      }
      if (data.status === "Success") {
        setErrorCode(false);
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
        <h2 className={styles.head}>Confirmation account in Dove</h2>
        <p className={styles.text}>Please enter your code in this field.</p>
        <div className={styles.login}>
          <Input
            text={code}
            setText={setCode}
            placeholderName={"Code"}
            error={errorCode}
          />
          <button onClick={onSubmit} className={styles.button}>
            <p>NEXT</p>
            <span className={styles.loading}>
              {loadingMutation || loadingQueryUser ? <LoadingIcon /> : ""}
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
    </>
  );
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { DoveIcon, LoadingIcon } from "assets";

import { FormBugsProps } from "./FormBugs.props";
import styles from "./FormBugs.module.css";
import ReactTextareaAutosize from "react-textarea-autosize";
import { IImage, IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { actionMenuBugs, getImageUser, getUser } from "store";
import { SERVER_LINK } from "utils/constants";
import { useMutation } from "@apollo/client";
import { sendReportBugs } from "resolvers/user";
import { useTheme } from "utils/context";

export const FormBugs = ({
  className,
  ...props
}: FormBugsProps): JSX.Element => {
  const navigate = useNavigate();
  const error = useError();
  const dispatch = useAppDispatch();
  const autorizationData = useAuthorizationSearch();
  const themeChange = useTheme();

  const [sendReportBugsMutation, { loading: loadingSendBugs }] = useMutation(
    sendReportBugs,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorizationData({ data: data.sendReport });
        dispatch(actionMenuBugs(false));
        navigate("/");
      },
      onError(errorData) {
        error(errorData.message);
      },
    }
  );

  const user: IUser | undefined = useAppSelector(getUser);
  const image: IImage | undefined = useAppSelector(getImageUser)?.[0];

  const [bugs, setBugs] = useState<string>("");

  //need send bugs in email
  const onSubmit = async (): Promise<void> => {
    if (bugs.replaceAll(" ", "") === "" || bugs.length < 20) {
      error("Please at least 20 characters");
    } else {
      await sendReportBugsMutation({ variables: { text: bugs } });
    }
  };

  useEffect(() => {
    if (user?.theme) {
      themeChange?.changeTheme("dark");
    }

    if (!user?.theme) {
      themeChange?.changeTheme("light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeChange]);

  return (
    <>
      <section className={cn(className, styles.form)} {...props}>
        <DoveIcon className={styles.svg} />
        <h2 className={styles.head}>Submit your bug in the Dove system</h2>
        <p className={styles.text}>
          Please indicate your bug in the field below
        </p>
        <div className={styles.informationUser}>
          <img src={`${SERVER_LINK}/images/${image?.file}`} alt='user' />
          <div>
            <span>
              Username: <p>{user?.username}</p>
            </span>
            <span>
              Email:<p>{user?.email}</p>
            </span>
          </div>
        </div>
        <div className={styles.login}>
          <ReactTextareaAutosize
            value={bugs}
            onChange={(e) => setBugs(e.target.value)}
            minRows={15}
            maxRows={30}
            className={styles.input}
            maxLength={1000}
          />
          <button onClick={onSubmit} className={styles.button}>
            <p>SEND</p>
            <span className={styles.loading}>
              {loadingSendBugs ? <LoadingIcon /> : ""}
            </span>
          </button>
          <p className={styles.link}>
            <span
              className={styles.reg}
              onClick={() => {
                dispatch(actionMenuBugs(false));
                navigate("/");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch(actionMenuBugs(false));
                  navigate("/");
                }
              }}
              tabIndex={0}
            >
              BACK
            </span>
          </p>
        </div>
      </section>
    </>
  );
};

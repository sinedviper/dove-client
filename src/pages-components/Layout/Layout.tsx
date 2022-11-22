import React, { useRef, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import cn from "classnames";

import { checkAuthorization, minutesFormat, outLogin } from "utils/helpers";
import { useAppDispatch, useAppSelector, useDebounce } from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { IUser } from "utils/interface";
import { getContact } from "resolvers/contacts";
import { updateUserOnline } from "resolvers/user";
import { getChats } from "resolvers/chats";
import { Contacts } from "components/contacts";
import { Edits } from "components/forms";
import { Chats } from "components/chats";
import { Settings } from "components";
import {
  actionAddChats,
  actionAddContact,
  actionAddError,
  actionAddLoading,
  actionAddUser,
  actionDeleteError,
  getCopy,
  getErrors,
  getLoading,
  getUser,
} from "store";
import { CopyIcon, InfoIcon, LoadingIcon } from "assets";

import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const [mutationUserOnlineFunction, { error: errorMutationUserOnline }] =
    useMutation(updateUserOnline, {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          themeChange,
          data: data.updateUserOnline,
          actionAdd: actionAddUser,
        });
      },
    });

  const debouncedMutation = useDebounce(() => {
    mutationUserOnlineFunction({
      variables: { input: { online: "ping" } },
    });
  }, 300000);

  const debouncedCheck = useDebounce(() => {
    mutationUserOnlineFunction({
      variables: { input: { online: "ping" } },
    });
  }, 1000);

  const { loading: loadQueryContact, error: errorQueryContact } = useQuery(
    getContact,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.getContacts,
          actionAdd: actionAddContact,
          themeChange,
        });
      },
    }
  );
  const { loading: loadQueryChat, error: errorQueryChats } = useQuery(
    getChats,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.getChats,
          actionAdd: actionAddChats,
          themeChange,
        });
      },
    }
  );

  let searchContact = useRef<HTMLInputElement>(null);

  const errors: string[] = useAppSelector(getErrors);
  const loading: boolean = useAppSelector(getLoading);
  const copy: boolean = useAppSelector(getCopy);
  const user: IUser | undefined = useAppSelector(getUser);
  const token: string | null = localStorage.getItem("token");

  useEffect(() => {
    //loading
    if (loadQueryContact || loadQueryChat) dispatch(actionAddLoading(true));
    if (!loadQueryContact && !loadQueryChat) dispatch(actionAddLoading(false));
    //error
    if (errorQueryContact) dispatch(actionAddError(errorQueryContact.message));
    if (errorQueryChats) dispatch(actionAddError(errorQueryChats.message));
    if (errorMutationUserOnline)
      dispatch(actionAddError(errorMutationUserOnline.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadQueryChat,
    loadQueryContact,
    errorQueryContact,
    errorQueryChats,
    errorMutationUserOnline,
  ]);

  useEffect(() => {
    themeChange?.changeTheme(
      user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT
    );
    themeChange?.changeAnimation(
      user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.animation, user?.theme]);

  if (!token) {
    outLogin(dispatch, themeChange);
    return <Navigate to='/login' />;
  }

  return (
    <main
      className={cn(className, styles.main)}
      onMouseMove={
        user?.online && minutesFormat(new Date(), new Date(user?.online)) > 4
          ? debouncedCheck
          : debouncedMutation
      }
      {...props}
    >
      <div className={styles.loadingWrapper}>
        {copy && (
          <div className={styles.loading}>
            <span className={styles.copyIcon}>
              <CopyIcon />
            </span>
            <p>Copy</p>
          </div>
        )}
        {loading && (
          <div className={styles.loading}>
            <span className={styles.loadingIcon}>
              <LoadingIcon />
            </span>
            <p>loading...</p>
          </div>
        )}
        {errors !== null &&
          errors.map((error, index) => {
            setTimeout(() => {
              dispatch(actionDeleteError(index));
            }, 3000);
            return (
              <div key={index} className={styles.error}>
                <span className={styles.errorIcon}>
                  <InfoIcon />
                </span>
                <p>Error: {error}</p>
              </div>
            );
          })}
      </div>
      <section className={styles.chatWrapper}>
        <Chats searchContact={searchContact} />
        <Contacts searchContact={searchContact} />
        <Settings />
        <Edits />
      </section>
      <Outlet />
    </main>
  );
};

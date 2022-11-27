import React, { useRef, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import cn from "classnames";

import { minutesFormat } from "utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useDebounce,
  useError,
  useExit,
} from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { IUser } from "utils/interface";
import { getContact } from "resolvers/contacts";
import { updateUserOnline } from "resolvers/user";
import { getChats } from "resolvers/chats";
import { Contacts } from "components/contacts";
import { Edits } from "components/forms";
import { Chats } from "components/chats";
import { Settings, Notification } from "components";
import {
  actionAddChats,
  actionAddContact,
  actionAddFetch,
  actionAddImageUser,
  actionAddLoading,
  actionAddUser,
  actionMenuMain,
  getMenuMain,
  getUser,
} from "store";

import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";
import { getUploads } from "resolvers/upload";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const themeChange = useTheme();
  const exit = useExit();
  const autorization = useAuthorization();
  const error = useError();

  const [mutationUserOnlineFunction, { error: errorMutationUserOnline }] =
    useMutation(updateUserOnline, {
      fetchPolicy: "no-cache",
      onCompleted(data) {
        autorization({ data: data.updateUserOnline, actionAdd: actionAddUser });
      },
      onError(errorData) {
        error(errorData.message);
      },
    });

  const { loading: loadQueryImage, error: errorQueryImage } = useQuery(
    getUploads,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorization({ data: data.getUpload, actionAdd: actionAddImageUser });
      },
      onError(errorData) {
        error(errorData.message);
      },
      pollInterval: 5000,
    }
  );

  const { loading: loadQueryContact, error: errorQueryContact } = useQuery(
    getContact,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorization({ data: data.getContacts, actionAdd: actionAddContact });
      },
      onError(errorData) {
        error(errorData.message);
      },
    }
  );

  const { loading: loadQueryChat, error: errorQueryChats } = useQuery(
    getChats,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        autorization({ data: data.getChats, actionAdd: actionAddChats });
      },
      onError(errorData) {
        error(errorData.message);
      },
      pollInterval: 500,
    }
  );

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUser | undefined = useAppSelector(getUser);
  const token: string | null = localStorage.getItem("token");
  const main: boolean = useAppSelector(getMenuMain);

  const debouncedMutation = useDebounce(() => {
    mutationUserOnlineFunction({ variables: { input: { online: "ping" } } });
  }, 300000);

  useEffect(() => {
    if (
      !errorQueryContact &&
      !errorQueryChats &&
      !errorMutationUserOnline &&
      !errorQueryImage
    ) {
      dispatch(actionAddFetch(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    errorQueryContact,
    errorQueryChats,
    errorMutationUserOnline,
    errorQueryImage,
  ]);

  useEffect(() => {
    //loading
    if (loadQueryContact || loadQueryChat || loadQueryImage)
      dispatch(actionAddLoading(true));
    if (!loadQueryContact && !loadQueryChat && !loadQueryImage)
      dispatch(actionAddLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQueryChat, loadQueryContact]);

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
    exit();
    return <Navigate to='/login' />;
  }

  return (
    <main
      className={cn(className, styles.main)}
      onMouseMove={(e: any) => {
        if (e.view.innerWidth > 900) {
          dispatch(actionMenuMain(true));
        }
        return user?.online &&
          minutesFormat(new Date(), new Date(user?.online)) > 4
          ? mutationUserOnlineFunction({
              variables: { input: { online: "ping" } },
            })
          : debouncedMutation;
      }}
      {...props}
    >
      <Notification />
      <section
        className={styles.chatWrapper}
        style={{ width: main ? "800px" : "0px" }}
      >
        <Chats searchContact={searchContact} />
        <Contacts searchContact={searchContact} />
        <Settings />
        <Edits />
      </section>
      <Outlet />
    </main>
  );
};

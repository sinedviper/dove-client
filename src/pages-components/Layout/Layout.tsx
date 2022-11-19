import React, { useRef, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { toast } from "react-toastify";
import cn from "classnames";

import { checkAuthorization, minutesFormat, outLogin } from "utils/helpers";
import { useAppDispatch, useAppSelector, useDebounce } from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { IUser } from "utils/interface";
import { getContact, subscribeContacts } from "resolvers/contacts";
import { updateUserOnline, subscribeUser } from "resolvers/user";
import { getChats, subscribeChats } from "resolvers/chats";
import { subscribeMessages } from "resolvers/messages";
import { Contacts } from "components/contacts";
import { Edits } from "components/forms";
import { Chats } from "components/chats";
import { Settings } from "components";
import {
  actionAddChats,
  actionAddContact,
  actionAddMessages,
  actionAddUser,
  getUser,
} from "store";

import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const [mutationUserOnlineFunction] = useMutation(updateUserOnline, {
    fetchPolicy: "network-only",
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

  const { loading: loadQueryContact } = useQuery(getContact, {
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
  });
  const { loading: loadQueryChat } = useQuery(getChats, {
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
  });

  const {
    data: dataUser,
    loading: lodingUser,
    error: errorUser,
  } = useSubscription(subscribeUser, { fetchPolicy: "network-only" });
  const {
    data: dataChats,
    loading: loadingChats,
    error: errorChats,
  } = useSubscription(subscribeChats, { fetchPolicy: "network-only" });
  const {
    data: dataMessage,
    loading: loadingMessage,
    error: errorMessage,
  } = useSubscription(subscribeMessages, { fetchPolicy: "network-only" });

  const {
    data: dataContact,
    loading: loadingContact,
    error: errorContact,
  } = useSubscription(subscribeContacts, {
    fetchPolicy: "network-only",
  });

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUser | undefined = useAppSelector(getUser);
  const token: string | null = localStorage.getItem("token");

  if (errorUser) toast.error(errorUser.message);
  if (errorChats) toast.error(errorChats.message);
  if (errorMessage) toast.error(errorMessage.message);
  if (errorContact) toast.error(errorContact.message);

  useEffect(() => {
    if (!loadingChats) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataChats?.chatSubscription,
        actionAdd: actionAddChats,
        themeChange,
      });
    }
    if (!loadingMessage) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataMessage?.messageSubscription,
        actionAdd: actionAddMessages,
        themeChange,
      });
    }
    if (!loadingContact) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataContact?.contactSubscription,
        actionAdd: actionAddContact,
        themeChange,
      });
    }
    if (!lodingUser) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataUser?.userSubscription,
        actionAdd: actionAddUser,
        themeChange,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingChats,
    dataChats,
    loadingMessage,
    dataMessage,
    lodingUser,
    dataUser,
    loadingContact,
    dataContact,
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

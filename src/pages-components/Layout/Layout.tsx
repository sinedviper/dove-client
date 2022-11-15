import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  actionAddChats,
  actionAddContact,
  actionAddMessages,
  actionAddUser,
  getChat,
  getContacts,
  getUser,
} from "store";
import { IChat, IUser } from "interface";
import { Chats, Contacts, Settings, Edits } from "components";
import { useTheme, theme, animation } from "context";
import {
  getChats,
  getContact,
  subscribeChats,
  subscribeContacts,
  subscribeMessages,
  subscribeUser,
  updateUserOnline,
} from "mutation";
import { checkAuthorization, outLogin } from "helpers";

import styles from "./Layout.module.css";
import { toast } from "react-toastify";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const [mutationUserOnlineFunction] = useMutation(updateUserOnline);

  const { loading: loadQueryContact } = useQuery(getContact, {
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
  } = useSubscription(subscribeUser);
  const {
    data: dataChats,
    loading: loadingChats,
    error: errorChats,
  } = useSubscription(subscribeChats);
  const {
    data: dataMessage,
    loading: loadingMessage,
    error: errorMessage,
  } = useSubscription(subscribeMessages);

  const {
    data: dataContact,
    loading: loadingContact,
    error: errorContact,
  } = useSubscription(subscribeContacts);

  const [contact, setContact] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUser | null = useAppSelector(getUser);
  const chats: IChat[] | null = useAppSelector(getChat);
  const contacts: IUser[] | null = useAppSelector(getContacts);
  const token: string | null = localStorage.getItem("token");

  useEffect(() => {
    if (errorUser) toast.error(errorUser.message);
    if (errorChats) toast.error(errorChats.message);
    if (errorMessage) toast.error(errorMessage.message);
    if (errorContact) toast.error(errorContact.message);
  }, [
    loadQueryContact,
    loadQueryChat,
    errorUser,
    errorChats,
    errorMessage,
    errorContact,
  ]);

  useEffect(() => {
    if (!loadingChats) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataMessage.chatSubscription,
        actionAdd: actionAddChats,
        themeChange,
      });
    }
    if (!loadingMessage) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataMessage.messageSubscription,
        actionAdd: actionAddMessages,
        themeChange,
      });
    }
    if (!loadingContact) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataContact.contactSubscription,
        actionAdd: actionAddContact,
        themeChange,
      });
    }
    if (!lodingUser) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataUser.userSubscription,
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
  }, [themeChange, user?.animation, user?.theme]);

  if (!token) {
    outLogin(dispatch, themeChange);
    return <Navigate to='/login' />;
  }

  return (
    <main
      className={cn(className, styles.main)}
      onMouseMove={() =>
        setInterval(
          async () =>
            await mutationUserOnlineFunction({
              variables: { input: { online: "ping" } },
            }),
          300000
        )
      }
      {...props}
    >
      <section className={styles.chatWrapper}>
        <Chats
          chats={chats}
          searchContact={searchContact}
          setContact={setContact}
          setSettings={setSettings}
        />
        <Contacts
          contacts={contacts}
          searchContact={searchContact}
          setContact={setContact}
          contact={contact}
        />
        <Settings
          settings={settings}
          setSettings={setSettings}
          setEdit={setEdit}
          user={user}
        />
        <Edits edit={edit} setEdit={setEdit} user={user} />
      </section>
      <Outlet />
    </main>
  );
};

import React, { useState, useRef } from "react";
import cn from "classnames";
import { Navigate, Outlet } from "react-router-dom";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  actionClearChats,
  actionClearContact,
  actionClearMessages,
  actionClearUser,
  getChat,
  getContacts,
  getUser,
} from "store";
import { IChat, IUser } from "interface";
import { Chats, Contacts, Settings, Edits } from "components";

import styles from "./Layout.module.css";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const [valueAll, setValueAll] = useState<string>("");
  const [contact, setContact] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUser | null = useAppSelector(getUser);
  const chats: IChat[] | null = useAppSelector(getChat);
  const contacts: IUser[] | null = useAppSelector(getContacts);
  const token: string | null = localStorage.getItem("token");

  if (!token) {
    localStorage.removeItem("token");
    dispatch(actionClearUser());
    dispatch(actionClearChats());
    dispatch(actionClearContact());
    dispatch(actionClearMessages());
    return <Navigate to='/login' />;
  }

  return (
    <main className={cn(className, styles.main)} {...props}>
      <section className={styles.chatWrapper}>
        <Chats
          chats={chats}
          searchContact={searchContact}
          setContact={setContact}
          setSettings={setSettings}
          valueAll={valueAll}
          setValueAll={setValueAll}
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

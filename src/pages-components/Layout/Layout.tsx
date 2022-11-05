/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import cn from "classnames";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import { getChat, getContacts, getUser, loadChats, loadContacts } from "store";
import { IChatResponse, IContactResponse, IUserResponse } from "interface";
import { Chats, Contacts, Settings, Edits } from "components";

import styles from "./Layout.module.css";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [valueAll, setValueAll] = useState<string>("");
  const [contact, setContact] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUserResponse | null = useAppSelector(getUser);
  const chats: IChatResponse | null = useAppSelector(getChat);
  const contacts: IContactResponse | null = useAppSelector(getContacts);
  const token: string | null = localStorage.getItem("token");

  useEffect(() => {
    if (user != null) {
      navigate(`${user.data.username}`);
    }
  }, [user]);

  useEffect(() => {
    dispatch(loadContacts());
    dispatch(loadChats());
  }, []);

  if (!token) {
    localStorage.removeItem("token");
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

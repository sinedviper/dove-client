/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import { getChat, getContacts, getUser, loadChats, loadContacts } from "store";
import { RemoveIcon, SearchIcon } from "assets";
import { IChat, IChatResponse, IUser } from "interface";

import styles from "./Layout.module.css";
import { formateDate } from "helpers";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const [focus, setFocus] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(getUser);
  const chats: IChatResponse | null = useAppSelector(getChat);
  const token: string | null = localStorage.getItem("token");

  const handleFocus = () => {
    setClick(!click);
  };

  useEffect(() => {
    if (user != null) {
      navigate(`${user.data.username}`);
    }
  }, [user]);

  useEffect(() => {
    dispatch(loadContacts());
    dispatch(loadChats());
    if (chats)
      if (chats.status === "Invalid") {
        toast.error(chats.message);
      }
  }, []);

  if (!token) {
    return <Navigate to='login' />;
  }

  return (
    <main className={cn(className, styles.main)} {...props}>
      <section className={styles.chatWrapper}>
        <nav className={styles.menuWrapper}>
          <button className={styles.menu}>
            <span className={styles.line}></span>
          </button>
          <div className={styles.serchWrapper}>
            <input
              type='text'
              className={styles.search}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholder='Search'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <SearchIcon
              className={cn(styles.iconSearch, {
                [styles.focusSearch]: focus === true,
              })}
            />
            <button
              onClick={() => setValue("")}
              className={cn(styles.buttonRemove, {
                [styles.focusRemove]: focus === true,
              })}
            >
              <RemoveIcon className={styles.iconRemove} />
            </button>
          </div>
        </nav>
        <ul className={styles.contactsList}>
          {chats?.data.map((contact: IChat) => (
            <li
              key={contact.id}
              className={cn(styles.contacts, {
                [styles.contactActive]: click === true,
              })}
              onClick={handleFocus}
            >
              <div className={styles.contactsPhoto}>
                <span>
                  {contact.user.name.toUpperCase().split("")[0] +
                    contact.user.surname.toUpperCase().split("")[0]}
                </span>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactName}>
                  {contact.user.name} {contact.user.surname}
                </span>
                <span className={styles.contactMessage}>
                  {contact.lastMessage.text}
                </span>
                <span className={styles.contactDate}>
                  {formateDate(new Date(contact.lastMessage.createdAt))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <Outlet />
    </main>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import { getContacts, getUser, loadContacts } from "store";
import { RemoveIcon, SearchIcon } from "assets";
import { IUser } from "interface";

import styles from "./Layout.module.css";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const [focus, setFocus] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(getUser);
  const { data, message, status } = useAppSelector(getContacts);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user != null) {
      navigate(`${user.data.username}`);
    }
  }, [user]);

  useEffect(() => {
    dispatch(loadContacts());
    if (status === "Invallid") {
      toast.error(message);
    }
  }, [data]);

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
          {data.map((contact: IUser) => (
            <li key={contact.id} className={styles.contacts} onFocus={() => {}}>
              <div className={styles.contactsPhoto}>
                <span>
                  {contact.name.toUpperCase().split("")[0] +
                    contact.surname.toUpperCase().split("")[0]}
                </span>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactName}>
                  {contact.name} {contact.surname}
                </span>
                <span className={styles.contactMessage}>...</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <Outlet />
    </main>
  );
};

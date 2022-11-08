import React, { useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";

import { ChatsProps } from "./Chats.props";
import { ContactsIcon, LogoutIcon, SettingsIcon } from "assets";
import { CardChat, Search } from "components";
import { IChat } from "interface";
import { actionClearChats, actionClearContact, actionClearUser } from "store";
import { useAppDispatch } from "hooks";

import styles from "./Chats.module.css";

export const Chats = ({
  chats,
  searchContact,
  setContact,
  setSettings,
  className,
  valueAll,
  setValueAll,
  ...props
}: ChatsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);

  const handleContact = () => {
    setContact(true);
    setMenu(false);
    setTimeout(() => searchContact.current?.focus(), 300);
  };

  const handleSettings = () => {
    setSettings(true);
    setMenu(false);
  };

  const handleLeavMouseInBlockChats = () => {
    if (menu) {
      setMenu(false);
    }
    setSwiper(false);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(actionClearUser());
    dispatch(actionClearChats());
    dispatch(actionClearContact());
    navigate("/login");
  };

  return (
    <section
      className={className}
      onMouseLeave={handleLeavMouseInBlockChats}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <nav className={styles.menuWrapper}>
        <button className={styles.menu} onClick={() => setMenu(!menu)}>
          <span className={styles.line}></span>
        </button>
        <div
          className={cn(styles.menuClose, {
            [styles.menuOpen]: menu === true,
          })}
        >
          <button className={styles.menuCard} onClick={handleContact}>
            <ContactsIcon className={cn(styles.cardIcon, styles.contact)} />
            <span>Contacts</span>
          </button>
          <button className={styles.menuCard} onClick={handleSettings}>
            <SettingsIcon className={styles.cardIcon} />
            <span>Settings</span>
          </button>
          <button className={styles.menuCard} onClick={handleLogOut}>
            <LogoutIcon className={cn(styles.cardIcon, styles.logout)} />
            <span>Log Out</span>
          </button>
          <a
            rel='noreferrer'
            href='https://github.com/sinedviper'
            target='_blank'
            className={styles.creator}
          >
            github repyev denis
          </a>
        </div>
        <Search value={valueAll} setValue={setValueAll} />
      </nav>
      <section
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
      >
        <ul>
          {chats &&
            chats.map((contact: IChat) => (
              <CardChat contact={contact} key={contact.id} />
            ))}
        </ul>
      </section>
    </section>
  );
};

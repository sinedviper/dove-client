/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-func-assign */
import React, { useState } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";

import { ChatsProps } from "./Chats.props";
import { ContactsIcon, LogoutIcon, SettingsIcon } from "assets";
import { CardChat, Search } from "components";
import { IChat, IUser } from "interface";
import {
  actionAddChats,
  actionClearChats,
  actionClearContact,
  actionClearUser,
  getContacts,
  getUser,
} from "store";
import { useAppDispatch, useAppSelector } from "hooks";

import styles from "./Chats.module.css";
import { colorCard } from "helpers";
import { useMutation } from "@apollo/client";
import { addChat } from "mutation";

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
  const { username } = useParams();
  const [mutationFunction] = useMutation(addChat);

  const [click, setClick] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);

  const user: IUser | null = useAppSelector(getUser);
  const contacts: IUser[] | null = useAppSelector(getContacts);

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

  const handleFocus = async (contact: IUser) => {
    setSearchUser(false);
    await mutationFunction({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(contact.id) },
      },
    }).then((res) => {
      const data = res.data.addChat;
      if (data.status === "Success") {
        dispatch(actionAddChats(data.data));
        navigate(`${contact.username}`);
      }
    });
  };

  return (
    <section
      className={className}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <nav
        className={styles.menuWrapper}
        onMouseLeave={handleLeavMouseInBlockChats}
      >
        <button
          className={styles.menu}
          onClick={() => {
            if (searchUser) {
              setSearchUser(false);
            }
            if (!searchUser) setMenu(!menu);
          }}
        >
          <span
            className={cn(styles.line, {
              [styles.lineBack]: searchUser === true,
            })}
          ></span>
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
        <Search
          value={valueAll}
          setValue={setValueAll}
          onFocus={() => {
            setSearchUser(true);
            setMenu(false);
          }}
        />
      </nav>
      <section
        className={cn(styles.searchWrapperUsers, {
          [styles.searchWrapperUsersOn]: searchUser === true,
        })}
      >
        <div className={styles.contactListWrapper}>
          {contacts &&
            valueAll === "" &&
            contacts.map((contact) => {
              const { color1, color2 } = colorCard(
                contact.name.toUpperCase()[0]
              );
              return (
                <div
                  key={contact.id}
                  className={cn(styles.contactWrapper, {
                    [styles.contactWrapperOn]: username === contact.username,
                    [styles.contactWrapperClick]: click === true,
                  })}
                  onClick={() => handleFocus(contact)}
                  onMouseDown={() => setClick(true)}
                  onMouseUp={() => setClick(false)}
                >
                  <div
                    className={styles.contactPhoto}
                    style={{
                      background: `linear-gradient(${color1}, ${color2})`,
                    }}
                  >
                    <span>{contact.name.toUpperCase()[0]}</span>
                  </div>
                  <p>{contact.name}</p>
                </div>
              );
            })}
        </div>
      </section>
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

/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import cn from "classnames";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { LayoutProps } from "./Layout.props";
import { useAppDispatch, useAppSelector } from "hooks";
import { getChat, getContacts, getUser, loadChats, loadContacts } from "store";
import {
  BackIcon,
  ContactsIcon,
  EditIcon,
  LogoutIcon,
  MailIcon,
  SettingsIcon,
  UsernameIcon,
} from "assets";
import { IChat, IChatResponse, IContactResponse, IUser } from "interface";
import { CardChat, Search, CardContact, Input } from "components";

import styles from "./Layout.module.css";
import { toast } from "react-toastify";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const [valueContact, setValueContact] = useState<string>("");
  const [valueAll, setValueAll] = useState<string>("");
  const [menu, setMenu] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [contact, setContact] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  let searchContact = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(getUser);
  const chats: IChatResponse | null = useAppSelector(getChat);
  const contacts: IContactResponse | null = useAppSelector(getContacts);
  const token: string | null = localStorage.getItem("token");

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copy!");
  };

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
    navigate("/login");
  };

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
        <section
          onMouseLeave={handleLeavMouseInBlockChats}
          onMouseOut={() => setSwiper(true)}
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
              {chats?.data &&
                chats?.data.map((contact: IChat) => (
                  <CardChat contact={contact} key={contact.id} />
                ))}
            </ul>
          </section>
        </section>
        <section
          className={cn(styles.contactsWrapper, {
            [styles.contactWrapperOpen]: contact === true,
          })}
        >
          <div className={styles.contactSearch}>
            <BackIcon
              className={styles.back}
              onClick={() => setContact(false)}
            />
            <Search
              value={valueContact}
              setValue={setValueContact}
              ref={searchContact}
            />
          </div>
          <section className={styles.contactsList}>
            <ul>
              {contacts?.data &&
                contacts?.data
                  .map((contact: IUser) => (
                    <CardContact contact={contact} key={contact.id} />
                  ))
                  .filter((val) => {
                    if (valueContact.replaceAll(" ", "") === "") {
                      return true;
                    } else if (valueContact !== "") {
                      const contact: IUser = val?.props?.contact;
                      if (
                        contact.name
                          .toLowerCase()
                          .includes(valueContact.toLowerCase()) ||
                        contact.surname
                          .toLowerCase()
                          .includes(valueContact.toLowerCase())
                      ) {
                        return true;
                      }
                    }
                  })}
            </ul>
          </section>
        </section>
        <section
          className={cn(styles.settingsWrapper, {
            [styles.settingsWrapperOpen]: settings === true,
          })}
        >
          <div className={styles.settingsHead}>
            <div>
              <BackIcon
                className={styles.back}
                onClick={() => setSettings(false)}
              />
              <h2>Settings</h2>
            </div>
            <EditIcon className={styles.edit} onClick={() => setEdit(true)} />
          </div>
          <div className={styles.infoUser}>
            <div className={styles.userPhoto}>
              {user?.data.surname.toUpperCase().slice()[0]}
              {user?.data.name.toUpperCase().slice()[0]}
              <div className={styles.photoFIO}>
                <p>{user?.data.name}</p>
                <p>{user?.data.surname}</p>
              </div>
            </div>
            <div className={styles.infoLast}>
              <div
                className={styles.info}
                onClick={() => handleCopy(String(user?.data.email))}
              >
                <MailIcon className={styles.iconInfo} />
                <span>
                  <p className={styles.firstInfo}>{user?.data.email}</p>
                  <p className={styles.secondInfo}>Email</p>
                </span>
              </div>
              <div
                className={styles.info}
                onClick={() => handleCopy(String(user?.data.username))}
              >
                <UsernameIcon className={styles.iconInfo} />
                <span>
                  <p className={styles.firstInfo}>{user?.data.username}</p>
                  <p className={styles.secondInfo}>Username</p>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section
          className={cn(styles.editWrapper, {
            [styles.editWrapperOpen]: edit === true,
          })}
        >
          <div className={styles.editHead}>
            <div>
              <BackIcon
                className={styles.back}
                onClick={() => setEdit(false)}
              />
              <h2>Edit Profile</h2>
            </div>
          </div>
          <div className={styles.editUser}>
            <div className={styles.editPhoto}>
              {user?.data.surname.toUpperCase().slice()[0]}
              {user?.data.name.toUpperCase().slice()[0]}
            </div>
            <Input placeholderName='Name' />
            <Input placeholderName='Surname(optional)' />
            <Input placeholderName='Bio(optional)' />
          </div>
          <div className={styles.editInfo}>
            <p>Any details such as age, occupation or city.</p>
            <p>Example: 23 y.o. designer from San Francisco</p>
          </div>
          <div className={styles.editUser}>
            <h2 className={styles.usernameEdit}>Email</h2>
            <Input placeholderName='Email' />
          </div>
          <div className={styles.editInfo}>
            <p>You can change the your email on Telegram.</p>
          </div>
          <div className={styles.editUser}>
            <h2 className={styles.usernameEdit}>Username</h2>
            <Input placeholderName='Username' />
          </div>
          <div className={styles.editInfo}>
            <p>
              You can choose a username on Telegram. If you do people will be
              able to find you by this username.
            </p>
          </div>
          <div className={styles.editUser}>
            <h2 className={styles.usernameEdit}>Password</h2>
            <Input placeholderName='Main password' />
            <Input placeholderName='New password' />
            <Input placeholderName='Repeat password' />
          </div>
          <div className={styles.editInfo}>
            <p>You can change the your password on Telegram.</p>
          </div>
          <div className={styles.editInfo}>
            <p>
              You can use a-z, 0-9 and underscores. Minimum length is 5
              characters.
            </p>
          </div>
        </section>
      </section>
      <Outlet />
    </main>
  );
};

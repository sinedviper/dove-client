import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import cn from "classnames";

import { ChatsHeaderProps } from "./ChatsHeader.props";
import {
  ContactsIcon,
  LogoutIcon,
  MeteorIcon,
  MoonIcon,
  SettingsIcon,
} from "assets";
import { outLogin } from "helpers";
import { Search } from "components";
import { getUser } from "store";
import { updateUser } from "mutation";
import { useAppDispatch, useAppSelector } from "hooks";
import { IUser } from "interface";
import { useTheme, theme, animation } from "context";

import styles from "./ChatsHeader.module.css";

export const ChatsHeader = ({
  searchContact,
  setSwiper,
  setContact,
  setSearchUser,
  setSettings,
  searchUser,
  valueAll,
  setValueAll,
  className,
  ...props
}: ChatsHeaderProps): JSX.Element => {
  const user: IUser | null = useAppSelector(getUser);

  const dispatch = useAppDispatch();
  const themeChange = useTheme();

  const [mutationFunctionUser] = useMutation(updateUser, {
    onCompleted() {
      themeChange?.changeAnimation(
        user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF
      );
      themeChange?.changeTheme(
        user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT
      );
    },
  });

  //please dont look at this :)
  const [menu, setMenu] = useState<boolean>(false);
  const [click1, setClick1] = useState<boolean>(false);
  const [click2, setClick2] = useState<boolean>(false);
  const [click3, setClick3] = useState<boolean>(false);
  const [click4, setClick4] = useState<boolean>(false);
  const [click5, setClick5] = useState<boolean>(false);

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

  const handleTheme = async () =>
    await mutationFunctionUser({
      variables: { input: { theme: !user?.theme } },
    });

  const handleAnimation = async () =>
    await mutationFunctionUser({
      variables: { input: { animation: !user?.animation } },
    });

  return (
    <nav
      className={cn(className, styles.menuWrapper)}
      onMouseLeave={handleLeavMouseInBlockChats}
      {...props}
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
        <button
          className={cn(styles.menuCard, {
            [styles.menuClick]: click1 === true,
          })}
          onClick={handleContact}
          onMouseDown={() => setClick1(true)}
          onMouseUp={() => setClick1(false)}
        >
          <ContactsIcon className={cn(styles.cardIcon, styles.contact)} />
          <span>Contacts</span>
        </button>
        <button
          className={cn(styles.menuCard, {
            [styles.menuClick]: click2 === true,
          })}
          onClick={handleSettings}
          onMouseDown={() => setClick2(true)}
          onMouseUp={() => setClick2(false)}
        >
          <SettingsIcon className={styles.cardIcon} />
          <span>Settings</span>
        </button>
        <button
          className={cn(styles.menuCard, styles.menuCardCheck, {
            [styles.menuClick]: click3 === true,
          })}
          onClick={handleTheme}
          onMouseDown={() => setClick3(true)}
          onMouseUp={() => setClick3(false)}
        >
          <div>
            <MoonIcon className={cn(styles.cardIcon)} />
            <span>Dark mode</span>
          </div>
          <div
            className={cn(styles.checkBox, {
              [styles.checkBoxClick]: user?.theme === true,
            })}
          >
            <input type='checkbox' checked={user?.theme} onChange={() => {}} />
            <label />
          </div>
        </button>
        <button
          className={cn(styles.menuCard, styles.menuCardCheck, {
            [styles.menuClick]: click4 === true,
          })}
          onClick={handleAnimation}
          onMouseDown={() => setClick4(true)}
          onMouseUp={() => setClick4(false)}
        >
          <div>
            <MeteorIcon className={cn(styles.cardIcon)} />
            <span>Animations</span>
          </div>
          <div
            className={cn(styles.checkBox, {
              [styles.checkBoxClick]: user?.animation === true,
            })}
          >
            <input
              type='checkbox'
              checked={user?.animation}
              onChange={() => {}}
            />
            <label />
          </div>
        </button>
        <button
          className={cn(styles.menuCard, {
            [styles.menuClick]: click5 === true,
          })}
          onClick={() => outLogin(dispatch, themeChange)}
          onMouseDown={() => setClick5(true)}
          onMouseUp={() => setClick5(false)}
        >
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
  );
};

import React, { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { checkAuthorization, outLogin } from "utils/helpers";
import { IUser } from "utils/interface";
import { useAppDispatch, useAppSelector } from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { updateUser } from "resolvers/user";
import { ButtonMenuMain, Search } from "components/layouts";
import {
  actionAddContact,
  actionAddError,
  actionAddUser,
  actionMenuContact,
  actionMenuSetting,
  getUser,
} from "store";

import { ChatsHeaderProps } from "./ChatsHeader.props";
import styles from "./ChatsHeader.module.css";
import { getContact } from "resolvers/contacts";
import { useEffect } from "react";

export const ChatsHeader = ({
  searchContact,
  setSwiper,
  setSearchUser,
  searchUser,
  valueAll,
  setValueAll,
  className,
  ...props
}: ChatsHeaderProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const user: IUser | undefined = useAppSelector(getUser);

  const [mutationFunctionUser, { error: errorUpdateUser }] = useMutation(
    updateUser,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.updateUser,
          actionAdd: actionAddUser,
          themeChange,
        });
        themeChange?.changeAnimation(
          user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF
        );
        themeChange?.changeTheme(
          user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT
        );
      },
    }
  );
  const [queryFunctionContactGet, { error: errorQueryContact }] = useLazyQuery(
    getContact,
    {
      fetchPolicy: "network-only",
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          themeChange,
          data: data.getContact,
          actionAdd: actionAddContact,
        });
      },
    }
  );

  const [menu, setMenu] = useState<boolean>(false);

  const handleContact = async () => {
    await queryFunctionContactGet();
    dispatch(actionMenuContact(true));
    setMenu(false);
    setTimeout(() => searchContact?.current?.focus(), 300);
  };

  const handleSettings = () => {
    dispatch(actionMenuSetting(true));
    setMenu(false);
  };

  const handleLeavMouseInBlockChats = () => {
    menu && setMenu(false);
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

  useEffect(() => {
    if (errorUpdateUser) dispatch(actionAddError(errorUpdateUser.message));
    if (errorQueryContact) dispatch(actionAddError(errorQueryContact.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorUpdateUser, errorQueryContact]);

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
            setValueAll("");
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
        <ButtonMenuMain
          text={"Contacts"}
          handleAction={handleContact}
          action={"contact"}
        />
        <ButtonMenuMain
          text={"Settings"}
          handleAction={handleSettings}
          action={"setting"}
        />
        <ButtonMenuMain
          text={"Dark mode"}
          handleAction={handleTheme}
          action={"theme"}
          theme={user?.theme}
        />
        <ButtonMenuMain
          text={"Animations"}
          handleAction={handleAnimation}
          action={"animation"}
          theme={user?.animation}
        />
        <ButtonMenuMain
          text={"Log Out"}
          handleAction={() => outLogin(dispatch, themeChange)}
          action={"out"}
        />
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
        setSearchUser={setSearchUser}
        setMenu={setMenu}
      />
    </nav>
  );
};

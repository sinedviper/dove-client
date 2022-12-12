import React, { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import cn from "classnames";
import ReactGA from "react-ga";

import { IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
  useExit,
  useWindowSize,
} from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { updateUser } from "resolvers/user";
import { getContact } from "resolvers/contacts";
import { ButtonMenuMain, Search } from "components/layouts";
import {
  actionAddContact,
  actionAddImageUser,
  actionAddTabIndexFirst,
  actionAddTabIndexFourth,
  actionAddTabIndexSecond,
  actionAddTabIndexSixth,
  actionAddTabIndexThree,
  actionAddUser,
  actionMenuBugs,
  actionMenuContact,
  actionMenuSetting,
  getTabIndexFirst,
  getTabIndexFiveth,
  getTabIndexFourth,
  getTabIndexSixth,
  getTabIndexThree,
  getUser,
} from "store";

import { ChatsHeaderProps } from "./ChatsHeader.props";
import styles from "./ChatsHeader.module.css";
import { getUploads } from "resolvers/upload";
import { useNavigate } from "react-router-dom";

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
  const error = useError();
  const exit = useExit();
  const autorization = useAuthorization();
  const windowSize = useWindowSize();
  //store
  const user: IUser | undefined = useAppSelector(getUser);
  const tabIndexFirst: number = useAppSelector(getTabIndexFirst);
  const tabIndexThree: number = useAppSelector(getTabIndexThree);
  const tabIndexFourth: number = useAppSelector(getTabIndexFourth);
  const tabIndexFiveth: number = useAppSelector(getTabIndexFiveth);
  const tabIndexSixth: number = useAppSelector(getTabIndexSixth);

  const [mutationFunctionUser] = useMutation(updateUser, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      autorization({ data: data.updateUser, actionAdd: actionAddUser });
      themeChange?.changeAnimation(
        user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF
      );
      themeChange?.changeTheme(
        user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT
      );
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [queryFunctionContactGet] = useLazyQuery(getContact, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      autorization({ data: data.getContact, actionAdd: actionAddContact });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [queryFunctionImageGet] = useLazyQuery(getUploads, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      autorization({ data: data.getUpload, actionAdd: actionAddImageUser });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [menu, setMenu] = useState<boolean>(false);
  //the function of obtaining contacts when opened in the menu
  const handleContact = async () => {
    ReactGA.pageview("/contact");
    await queryFunctionContactGet();
    dispatch(actionMenuContact(true));
    setMenu(false);
    setTimeout(() => searchContact?.current?.focus(), 300);
    dispatch(actionAddTabIndexFirst(-1));
    dispatch(actionAddTabIndexThree(0));
  };
  //the function of opening settings, and downloading data to the store
  const handleSettings = async () => {
    ReactGA.pageview("/setting");
    await queryFunctionImageGet();
    dispatch(actionMenuSetting(true));
    setMenu(false);
    dispatch(actionAddTabIndexFirst(-1));
    dispatch(actionAddTabIndexFourth(0));
    dispatch(actionAddTabIndexSixth(-1));
  };
  //the function for mouse
  const handleLeavMouseInBlockChats = () => {
    menu && setMenu(false);
    setSwiper(false);
  };
  //them function for change theme
  const handleTheme = async () => {
    await mutationFunctionUser({
      variables: { input: { theme: !user?.theme } },
    });
  };
  //the function for change animation
  const handleAnimation = async () =>
    await mutationFunctionUser({
      variables: { input: { animation: !user?.animation } },
    });

  const handleSavedMessage = () => {
    ReactGA.pageview("/savemessage");
    setMenu(false);
    dispatch(actionAddTabIndexFirst(windowSize[0] < 1000 ? -1 : 0));
    dispatch(actionAddTabIndexSixth(0));
    navigate(`${user?.username}`);
  };

  const handleBugs = () => {
    ReactGA.pageview("/bugs");
    dispatch(actionMenuBugs(true));
    setMenu(false);
    navigate(`/bugs`);
  };

  return (
    <nav
      className={cn(className, styles.menuWrapper)}
      onMouseLeave={handleLeavMouseInBlockChats}
      {...props}
    >
      <button
        className={styles.menu}
        tabIndex={
          tabIndexThree === 0 || tabIndexFourth === 0 || tabIndexFiveth === 0
            ? -1
            : 0
        }
        onClick={() => {
          if (searchUser) {
            setSearchUser(false);
            setValueAll("");
            dispatch(actionAddTabIndexFirst(0));
            dispatch(actionAddTabIndexSecond(-1));
            dispatch(actionAddTabIndexSixth(0));
            if (windowSize[0] < 1000) {
              dispatch(actionAddTabIndexSixth(-1));
            }
          }
          if (searchUser === false) {
            setMenu(!menu);
            dispatch(actionAddTabIndexFirst(tabIndexFirst === 0 ? -1 : 0));
            dispatch(actionAddTabIndexSixth(tabIndexSixth === 0 ? -1 : 0));
            if (windowSize[0] < 1000) {
              dispatch(actionAddTabIndexSixth(-1));
            }
          }
        }}
      >
        <span
          className={cn(styles.line, {
            [styles.lineBack]: searchUser === true,
          })}
        ></span>
      </button>
      <Search
        value={valueAll}
        setValue={setValueAll}
        setSearchUser={setSearchUser}
        setMenu={setMenu}
        tabIndex={
          menu === true
            ? -1
            : tabIndexSixth === 0
            ? -1
            : tabIndexThree === 0 ||
              tabIndexFourth === 0 ||
              tabIndexFiveth === 0
            ? -1
            : 0
        }
      />
      <div
        className={cn(styles.menuClose, {
          [styles.menuOpen]: menu === true,
        })}
        style={{ display: menu ? "block" : "none" }}
      >
        <ButtonMenuMain
          text={"Saved Message"}
          handleAction={handleSavedMessage}
          action={"saved"}
        />
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
          text={"Bugs report"}
          handleAction={handleBugs}
          action={"bugs"}
        />
        <ButtonMenuMain
          text={"Log Out"}
          handleAction={() => exit()}
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
    </nav>
  );
};

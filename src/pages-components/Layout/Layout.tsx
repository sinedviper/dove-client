import React, { useRef, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import cn from "classnames";

import { minutesFormat } from "utils/helpers";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useDebounce,
  useExit,
  useWindowSize,
} from "utils/hooks";
import { useTheme, theme, animation } from "utils/context";
import { IUser } from "utils/interface";
import { getContact } from "resolvers/contacts";
import { updateUserOnline } from "resolvers/user";
import { getChats } from "resolvers/chats";
import { Contacts } from "components/contacts";
import { Edits } from "components/forms";
import { Chats } from "components/chats";
import { Settings, Notification } from "components";
import {
  actionAddChats,
  actionAddContact,
  actionAddFetch,
  actionAddLoading,
  actionAddTabIndexSixth,
  actionAddUser,
  actionMenuMain,
  getMenuMain,
  getTabIndexFourth,
  getUser,
} from "store";

import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.css";

// that left block in dispaly, here all function what update data in store
export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const themeChange = useTheme();
  const exit = useExit();
  const autorization = useAuthorization();
  const sizeWindow = useWindowSize();

  const [pollIntervalOne, setPollIntervalOne] = useState<number>(200);

  const [mutationUserOnlineFunction] = useMutation(updateUserOnline, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      autorization({ data: data.updateUserOnline, actionAdd: actionAddUser });
    },
  });

  const { loading: loadQueryContact } = useQuery(getContact, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      autorization({ data: data.getContacts, actionAdd: actionAddContact });
      dispatch(actionAddFetch(false));
    },
  });

  const { loading: loadQueryChat } = useQuery(getChats, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      autorization({ data: data.getChats, actionAdd: actionAddChats });
      setPollIntervalOne(200);
      dispatch(actionAddFetch(false));
    },
    onError() {
      setPollIntervalOne(10000);
    },
    pollInterval: pollIntervalOne,
  });

  let searchContact = useRef<HTMLInputElement>(null);

  const user: IUser | undefined = useAppSelector(getUser);
  const token: string | null = localStorage.getItem("token");
  const main: boolean = useAppSelector(getMenuMain);
  const getIndexFourth: number = useAppSelector(getTabIndexFourth);

  const debouncedMutation = useDebounce(() => {
    mutationUserOnlineFunction({ variables: { input: { online: "ping" } } });
  }, 300000);

  //here if size many 1000 to block left have show in display
  useEffect(() => {
    if (sizeWindow[0] > 1000) {
      dispatch(actionMenuMain(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeWindow[0]]);

  //here we push in store true when data loading
  useEffect(() => {
    //loading
    if (loadQueryContact || loadQueryChat) dispatch(actionAddLoading(true));
    if (!loadQueryContact && !loadQueryChat) dispatch(actionAddLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQueryChat, loadQueryContact]);

  //here change theme when user change theme in menu in left block
  useEffect(() => {
    themeChange?.changeTheme(
      user?.theme ? theme.THEME_DARK : theme.THEME_LIGHT
    );
    themeChange?.changeAnimation(
      user?.animation ? animation.ANIMATION_ON : animation.ANIMATION_OFF
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.animation, user?.theme]);

  //when user open site first that dispatch in store what meny show and right block not tab because in right block not have chat
  useEffect(() => {
    if (sizeWindow[0] < 1000) {
      dispatch(actionMenuMain(true));
      dispatch(actionAddTabIndexSixth(-1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    exit();
    return <Navigate to='/login' />;
  }

  return (
    <main
      className={cn(className, styles.main)}
      onMouseMove={() => {
        return user?.online &&
          minutesFormat(new Date(), new Date(user?.online)) > 4
          ? mutationUserOnlineFunction({
              variables: { input: { online: "ping" } },
            })
          : debouncedMutation;
      }}
      onKeyDown={() => {
        return user?.online &&
          minutesFormat(new Date(), new Date(user?.online)) > 4
          ? mutationUserOnlineFunction({
              variables: { input: { online: "ping" } },
            })
          : debouncedMutation;
      }}
      onMouseDown={() => {
        return user?.online &&
          minutesFormat(new Date(), new Date(user?.online)) > 4
          ? mutationUserOnlineFunction({
              variables: { input: { online: "ping" } },
            })
          : debouncedMutation;
      }}
      {...props}
    >
      <Notification />
      <section
        className={cn(styles.chatWrapper, {
          [styles.chatWrapperOn]: main === true,
        })}
      >
        <Chats searchContact={searchContact} />
        <Contacts searchContact={searchContact} />
        <Settings tabIndex={getIndexFourth} />
        <Edits />
      </section>
      <Outlet />
    </main>
  );
};

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import cn from "classnames";
import ReactGA from "react-ga";

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { IChat, IMessage, IUser } from "utils/interface";
import { getHaveMessages, getMessage } from "resolvers/messages";
import { getUserSender } from "resolvers/user";
import { MessageHeader, MessageInput, MessageList } from "components/message";
import { Settings } from "components";
import {
  actionAddFetch,
  actionAddLoading,
  actionAddMessages,
  actionAddRecipient,
  actionHaveMessage,
  getChat,
  getFetch,
  getMenuMain,
  getMessages,
  getMessagesBefore,
  getRecipient,
  getTabIndexSeventh,
  getUser,
} from "store";

import { SideRightProps } from "./SideRight.props";
import styles from "./SideRight.module.css";

export const SideRight = ({
  className,
  ...props
}: SideRightProps): JSX.Element => {
  const { username } = useParams();
  const error = useError();
  const dispatch = useAppDispatch();
  const authorization = useAuthorization();
  const authorizationHave = useAuthorizationSearch();

  //store
  const fetch: boolean = useAppSelector(getFetch);
  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);
  const messagesBegore: IMessage[] | undefined =
    useAppSelector(getMessagesBefore);
  const main: boolean = useAppSelector(getMenuMain);
  const tabIndexSeventh: number = useAppSelector(getTabIndexSeventh);

  const [pollIntervalOne, setPollIntervalOne] = useState<number>(200);

  ReactGA.pageview("/chattingwithuser");

  const { loading: loadingHaveMessage } = useQuery(getHaveMessages, {
    variables: {
      message: {
        id: Number(
          messagesBegore !== undefined
            ? messagesBegore?.[0]?.id
            : messages?.[0]?.id
        ),
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted(data) {
      dispatch(
        actionHaveMessage(authorizationHave({ data: data.haveMessageFind }))
      );
    },
    onError(errorData) {
      chat !== undefined && error(errorData.message);
    },
  });

  const { loading: loadingMessage } = useQuery(getMessage, {
    variables: {
      message: {
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      authorization({
        data: data.getMessages,
        actionAdd: actionAddMessages,
      });
      setPollIntervalOne(200);
      fetch && dispatch(actionAddFetch(false));
    },
    onError() {
      setPollIntervalOne(10000);
    },
    pollInterval: pollIntervalOne,
  });

  const { loading: loadingSender } = useQuery(getUserSender, {
    variables: { input: { username } },
    onCompleted(data) {
      authorization({ data: data.getUser, actionAdd: actionAddRecipient });
      fetch && dispatch(actionAddFetch(false));
    },
    fetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const [settings, setSettings] = useState<boolean>(false);

  useEffect(() => {
    if (loadingMessage || loadingSender || loadingHaveMessage) {
      dispatch(actionAddLoading(true));
    }
    if ((!loadingMessage && !loadingSender) || !loadingHaveMessage) {
      dispatch(actionAddLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessage, loadingSender]);

  return (
    <section
      className={cn(className, styles.wrapper, {
        [styles.wrapperMainOn]: main === true,
      })}
      {...props}
    >
      {user?.theme ? (
        <section className={styles.backgroundDark}></section>
      ) : (
        <section className={styles.backgroundLight}></section>
      )}
      <section className={styles.chatWrapper}>
        <MessageHeader setSettings={setSettings} settings={settings} />
        <MessageList
          chat={chat}
          user={user}
          messagesBegore={messagesBegore}
          messages={messages}
        />
        <div className={styles.inputWrap}>
          <MessageInput main={main} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings
          setSettings={setSettings}
          sender={sender}
          profile={true}
          tabIndex={tabIndexSeventh}
        />
      </section>
    </section>
  );
};

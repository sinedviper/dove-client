import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import cn from "classnames";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import { checkAuthorization, formatDay } from "utils/helpers";
import { IChat, IMessage, IUser } from "utils/interface";
import { useTheme } from "utils/context";
import { getMessage, subscribeMessages } from "resolvers/messages";
import { MessageCard, MessageHeader, MessageInput } from "components/message";
import { Settings } from "components";
import {
  actionAddError,
  actionAddLoading,
  actionAddMessages,
  actionAddRecipient,
  getChat,
  getMessages,
  getRecipient,
  getUser,
} from "store";

import { HomeProps } from "./Home.props";
import styles from "./Home.module.css";
import { getUserSender } from "resolvers/user";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);

  const [
    queryFunction,
    { loading: loadingQueryMessage, error: errorQueryMessage },
  ] = useLazyQuery(getMessage, {
    onCompleted(data) {
      checkAuthorization({
        dispatch,
        navigate,
        data: data.getMessages,
        actionAdd: actionAddMessages,
        themeChange,
      });
    },
  });

  const {
    data: dataMessage,
    loading: loadingMessage,
    error: errorMessage,
  } = useSubscription(subscribeMessages, { fetchPolicy: "network-only" });

  const { loading: loadingSender, error: errorSender } = useQuery(
    getUserSender,
    {
      variables: { input: { userId: Number(user?.id), username } },
      onCompleted(data) {
        checkAuthorization({
          dispatch,
          navigate,
          data: data.getUserSender,
          actionAdd: actionAddRecipient,
          themeChange,
        });
      },
      fetchPolicy: "network-only",
    }
  );

  const [settings, setSettings] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (loadingQueryMessage || loadingSender) dispatch(actionAddLoading(true));
    if (!loadingSender && !loadingQueryMessage)
      dispatch(actionAddLoading(false));

    if (errorQueryMessage) dispatch(actionAddError(errorQueryMessage.message));
    if (errorMessage) dispatch(actionAddError(errorMessage.message));
    if (errorSender) dispatch(actionAddError(errorSender.message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingSender,
    loadingQueryMessage,
    errorQueryMessage,
    errorSender,
    errorMessage,
  ]);

  useEffect(() => {
    if (!loadingMessage) {
      checkAuthorization({
        dispatch,
        navigate,
        data: dataMessage?.messageSubscription,
        actionAdd: actionAddMessages,
        themeChange,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMessage, dataMessage]);

  useEffect(() => {
    if (messages) scrollToBottom();
    if (chat && !messages) {
      queryFunction({
        variables: {
          message: {
            chatId: Number(chat?.id),
            senderMessage: Number(user?.id),
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, chat, user]);

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      <section className={styles.chatWrapper}>
        <MessageHeader receipt={sender} setSettings={setSettings} />
        <section className={styles.chatsWrapper}>
          <ul className={cn(styles.messageWrapper)}>
            {messages &&
              chat &&
              messages?.map((message, index) => {
                if (messages[index + 1]?.createdAt)
                  if (
                    new Date(message?.createdAt).getDate() !==
                    new Date(messages[index + 1]?.createdAt).getDate()
                  ) {
                    return (
                      <div key={message.id} className={styles.wrapperWithDate}>
                        <MessageCard
                          chat={chat}
                          message={message}
                          index={index}
                          user={user}
                          messages={messages}
                          username={String(username)}
                        />
                        <p className={styles.dateMessage}>
                          {formatDay(new Date(messages[index + 1].createdAt))}
                        </p>
                      </div>
                    );
                  }
                return (
                  <MessageCard
                    chat={chat}
                    message={message}
                    index={index}
                    user={user}
                    messages={messages}
                    key={message.id}
                    username={String(username)}
                  />
                );
              })}
            <li ref={messagesEndRef}></li>
          </ul>
        </section>
        <div className={styles.inputWrap}>
          <MessageInput chat={chat} user={user} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings setSettings={setSettings} sender={sender} profile={true} />
      </section>
    </section>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import cn from "classnames";

import { useAppSelector, useAuthorization, useError } from "utils/hooks";
import { IChat, IMessage, IUser } from "utils/interface";
import { getMessage } from "resolvers/messages";
import { getUserSender } from "resolvers/user";
import { MessageCard, MessageHeader, MessageInput } from "components/message";
import { Settings } from "components";
import {
  actionAddMessages,
  actionAddRecipient,
  getChat,
  getMessages,
  getRecipient,
  getUser,
} from "store";

import { HomeProps } from "./Home.props";
import styles from "./Home.module.css";
import { formatDay } from "utils/helpers";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const { username } = useParams();
  const error = useError();
  const authorization = useAuthorization();

  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);

  const { error: errorQueryMessage } = useQuery(getMessage, {
    variables: {
      message: {
        chatId: Number(chat?.id),
        senderMessage: Number(user?.id),
      },
    },
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({ data: data.getMessages, actionAdd: actionAddMessages });
    },
    pollInterval: chat && 500,
  });

  const { error: errorSender } = useQuery(getUserSender, {
    variables: { input: { userId: Number(user?.id), username } },
    onCompleted(data) {
      authorization({ data: data.getUser, actionAdd: actionAddRecipient });
    },
    fetchPolicy: "network-only",
    pollInterval: 500,
  });

  const [settings, setSettings] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (errorQueryMessage && chat) error(errorQueryMessage.message);
    if (errorSender) error(errorSender.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorQueryMessage, errorSender]);

  useEffect(() => {
    if (messages) scrollToBottom();
  }, [messages]);

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      {user?.theme ? (
        <section className={styles.backgroundDark}></section>
      ) : (
        <section className={styles.backgroundLight}></section>
      )}
      <section className={styles.chatWrapper}>
        <MessageHeader setSettings={setSettings} />
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

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import cn from "classnames";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import {
  checkAuthorization,
  checkAuthorizationSearch,
  formatDay,
} from "utils/helpers";
import { IChat, IMessage, IUser } from "utils/interface";
import { useTheme } from "utils/context";
import { getMessage } from "resolvers/messages";
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
import { getUserSender, subscribeUser } from "resolvers/user";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeChange = useTheme();

  const [queryFunction] = useLazyQuery(getMessage, {
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

  const { loading: lodingUser, error: errorUser } = useSubscription(
    subscribeUser,
    {
      fetchPolicy: "network-only",
    }
  );

  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const {} = useQuery(getUserSender, {
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
  });

  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const messages: IMessage[] | undefined = useAppSelector(getMessages);

  const [settings, setSettings] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    messages && scrollToBottom();
    chat &&
      !messages &&
      queryFunction({
        variables: {
          message: {
            chatId: Number(chat?.id),
            senderMessage: Number(user?.id),
          },
        },
      });
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

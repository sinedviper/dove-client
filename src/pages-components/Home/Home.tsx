import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import { HomeProps } from "./Home.props";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  actionAddMessages,
  getChat,
  getMessages,
  getReceipt,
  getUser,
} from "store";
import { IChat, IMessage, IUser } from "interface";
import { MessageCard, MessageHeader, MessageInput, Settings } from "components";

import styles from "./Home.module.css";
import { checkAuthorization, formatDay } from "helpers";
import { useLazyQuery } from "@apollo/client";
import { getMessage } from "mutation";
import { useTheme } from "context";

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

  const chats: IChat[] | null = useAppSelector(getChat);
  const sender: IUser | null = useAppSelector(getReceipt);
  const user: IUser | null = useAppSelector(getUser);
  const messages: IMessage[] | null = useAppSelector(getMessages);

  const [settings, setSettings] = useState<boolean>(false);

  const haveChatOrNot: IChat | null =
    chats && chats.filter((chat) => chat.user.id === sender?.id)[0];

  const messagesEndRef = useRef<HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    messages && scrollToBottom();
    if (haveChatOrNot && !messages) {
      queryFunction({
        variables: {
          message: {
            chatId: Number(haveChatOrNot?.id),
            senderMessage: Number(user?.id),
          },
        },
      });
    }
  }, [messages, haveChatOrNot, user?.id]);

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      <section className={styles.chatWrapper}>
        <MessageHeader receipt={sender} setSettings={setSettings} />
        <section className={styles.chatsWrapper}>
          <ul className={cn(styles.messageWrapper)}>
            {messages &&
              haveChatOrNot &&
              messages?.map((message, index) => {
                if (messages[index + 1]?.createdAt)
                  if (
                    new Date(message?.createdAt).getDate() !==
                    new Date(messages[index + 1]?.createdAt).getDate()
                  ) {
                    return (
                      <div key={message.id} className={styles.wrapperWithDate}>
                        <MessageCard
                          chat={haveChatOrNot}
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
                    chat={haveChatOrNot}
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
          <MessageInput chat={haveChatOrNot} user={user} />
        </div>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings setSettings={setSettings} user={sender} profile={true} />
      </section>
    </section>
  );
};

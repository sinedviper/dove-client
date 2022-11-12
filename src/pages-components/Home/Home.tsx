import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";

import { HomeProps } from "./Home.props";
import { useAppSelector } from "hooks";
import { getChat, getMessages, getUser } from "store";
import { IChat, IUser } from "interface";
import { MessageCard, MessageHeader, MessageInput, Settings } from "components";

import styles from "./Home.module.css";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const MessageHeaderMemo = React.memo(MessageHeader);
  const [settings, setSettings] = useState<boolean>(false);
  const { username } = useParams();

  let chat: IChat | null = null;
  const receipt: IUser | undefined = useAppSelector(getChat)
    ?.filter((obj) => obj.user.username === username)
    .map((obj) => {
      chat = obj;
      return obj.user;
    })[0];
  const user: IUser | null = useAppSelector(getUser);
  const messages = useAppSelector(getMessages);

  const messagesEndRef = useRef<HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      <section className={styles.chatWrapper}>
        <MessageHeaderMemo receipt={receipt} setSettings={setSettings} />
        <section className={styles.chatsWrapper}>
          <ul className={cn(styles.messageWrapper)}>
            {messages &&
              messages?.map((message, index) => (
                <MessageCard
                  chat={chat}
                  message={message}
                  index={index}
                  user={user}
                  messages={messages}
                  key={message.id}
                  username={String(username)}
                />
              ))}
            <li ref={messagesEndRef}></li>
          </ul>
          <div className={styles.inputWrap}>
            <MessageInput chat={chat} user={user} />
          </div>
        </section>
      </section>
      <section
        className={cn(styles.profileWrap, {
          [styles.profileOn]: settings === true,
        })}
      >
        <Settings setSettings={setSettings} user={receipt} profile={true} />
      </section>
    </section>
  );
};

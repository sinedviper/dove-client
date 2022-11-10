/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";
import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";

import { HomeProps } from "./Home.props";
import { useAppDispatch, useAppSelector } from "hooks";
import { actionAddMessages, getChat, getMessages, getUser } from "store";
import { IChat, IUser } from "interface";
import { colorCard, formateDate, formatHours } from "helpers";
import { MessageEdit, Settings } from "components";
import { SmileIcon } from "assets";

import styles from "./Home.module.css";
import { useMutation } from "@apollo/client";
import { addMessages } from "mutation";
import { toast } from "react-toastify";

export const Home = ({ className, ...props }: HomeProps): JSX.Element => {
  const [client, setClient] = useState<{
    clientX: number;
    clientY: number;
    id: number;
    chatId: number;
    senderMessage: number;
    text: string;
    user: number;
  }>({
    clientX: 0,
    clientY: 0,
    id: 0,
    chatId: 0,
    senderMessage: 0,
    text: "",
    user: 0,
  });
  const [editMessage, setEditMessage] = useState<boolean>(false);

  const [emoji, setEmoji] = useState<boolean>(false);
  const [send, setSend] = useState<string>("");
  const [settings, setSettings] = useState<boolean>(false);

  const [metationFunction] = useMutation(addMessages);
  const { username } = useParams();
  const dispatch = useAppDispatch();

  let chat: IChat;
  let receipt: IUser | undefined = useAppSelector(getChat)
    ?.filter((obj) => obj.user.username === username)
    .map((obj) => {
      chat = obj;
      return obj.user;
    })[0];
  const user = useAppSelector(getUser);
  const messages = useAppSelector(getMessages);

  //Color for photo
  let color = colorCard();
  if (receipt?.name) {
    color = colorCard(receipt?.name && receipt?.name.toUpperCase()[0]);
  }

  const handleEmoji = (emojiData: EmojiClickData) => {
    setSend(send + String(emojiData.emoji));
  };

  const handleSend = async (e) => {
    if (chat)
      if (e.code === "Enter") {
        setSend("");
        await metationFunction({
          variables: {
            message: {
              text: send,
              senderMessage: Number(user?.id),
              chatId: chat.id,
            },
          },
        }).then((res) => {
          const data = res?.data.addMessage;
          if (data.status === "Invalid") {
            toast.error(data.message);
          }
          if (data.status === "Success") {
            dispatch(actionAddMessages(data.data));
          }
        });
      }
  };

  return (
    <section className={cn(className, styles.wrapper)} {...props}>
      <section className={styles.chatWrapper}>
        <section
          className={styles.headerReceiptWrapper}
          onClick={() => setSettings(true)}
        >
          <div className={styles.headerReceiptPhoto}>
            <span
              className={styles.receiptNamePhoto}
              style={{
                background: `linear-gradient(${color?.color1}, ${color?.color2})`,
              }}
            >
              {receipt?.name && receipt?.name.toUpperCase()[0]}
              {receipt?.surname && receipt?.surname.toUpperCase()[0]}
            </span>
          </div>
          <div className={styles.headerReceiptInfo}>
            <p className={styles.infoName}>
              {receipt?.name && receipt?.name}{" "}
              {receipt?.surname && receipt?.surname}
            </p>
            <p className={styles.infoDate}>
              last seen{" "}
              {receipt?.createdAt &&
                formateDate(new Date(receipt?.createdAt)).toLowerCase()}
            </p>
          </div>
        </section>
        <section
          className={styles.chatsWrapper}
          onMouseMove={(e) => {
            !editMessage &&
              setClient({
                ...client,
                clientX: e.nativeEvent.clientX,
                clientY: e.nativeEvent.clientY,
              });
          }}
        >
          <ul className={styles.messageWrapper}>
            {messages &&
              messages?.map((message, index) => {
                return (
                  <li
                    className={cn(styles.message, {
                      [styles.messageUser]:
                        username === message.senderMessage.username,
                      [styles.messageDown]:
                        messages[Number(index + 1)]?.senderMessage.username !==
                          message.senderMessage.username &&
                        messages[Number(index + 1)]?.senderMessage.username !==
                          undefined,
                    })}
                    key={message.id}
                    onMouseDown={(e) => {
                      if (e.nativeEvent?.which === 3) {
                        setEditMessage(true);
                        setClient({
                          clientX: e.nativeEvent.clientX,
                          clientY: e.nativeEvent.clientY,
                          id: message.id,
                          chatId: chat.id,
                          senderMessage: message.senderMessage.id,
                          user: Number(user?.id),
                          text: message.text,
                        });
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <span className={styles.messageText}>{message.text}</span>
                    <span className={styles.messageEdit}>
                      {message.createdAt === message.updatedAt
                        ? null
                        : "edited"}
                    </span>
                    <span className={styles.messageDate}>
                      {formatHours(new Date(message.createdAt))}
                    </span>
                    <span
                      className={cn(
                        messages[Number(index + 1)]?.senderMessage.username !==
                          user?.username &&
                          user?.username === message.senderMessage.username
                          ? styles.messageStyleLeft
                          : null,
                        messages[Number(index + 1)]?.senderMessage.username ===
                          user?.username &&
                          user?.username !== message.senderMessage.username
                          ? styles.messageStyleRight
                          : null,
                        messages[Number(index + 1)]?.senderMessage.username ===
                          undefined
                          ? message.senderMessage.username === user?.username
                            ? styles.messageStyleLeft
                            : styles.messageStyleRight
                          : null
                      )}
                    ></span>
                  </li>
                );
              })}
          </ul>
          <div className={styles.inputWrapper}>
            <input
              value={String(send)}
              className={styles.input}
              onChange={(e) => {
                setSend(e.target.value);
                setEmoji(false);
              }}
              onFocus={() => setEmoji(false)}
              onKeyDown={(e) => handleSend(e)}
            />
            <SmileIcon
              className={cn(styles.smileIcon, {
                [styles.emojiIconOn]: emoji === true,
              })}
              onClick={() => setEmoji(!emoji)}
            />
            <div
              className={cn(styles.emojiWrapper, {
                [styles.emojiWrapperOn]: emoji === true,
              })}
            >
              <EmojiPicker
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
                theme={Theme.LIGHT}
              />
            </div>
            <span className={styles.inputStyles}></span>
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
      <MessageEdit
        editMessage={editMessage}
        client={client}
        setEditMessage={setEditMessage}
      />
    </section>
  );
};

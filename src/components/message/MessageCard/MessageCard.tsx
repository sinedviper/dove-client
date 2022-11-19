import React, { useState } from "react";
import cn from "classnames";

import { formatHours } from "utils/helpers";
import { IMessage } from "utils/interface";
import { MessageEdit } from "components/message";

import { MessageCardProps } from "./MessageCard.props";
import styles from "./MessageCard.module.css";

export const MessageCard = ({
  chat,
  message,
  index,
  username,
  messages,
  user,
  className,
  ...props
}: MessageCardProps): JSX.Element => {
  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);
  const [position, setPosition] = useState<boolean>(false);
  const [client, setClient] = useState<{
    id: number;
    chatId: number;
    senderMessage: number;
    text: string;
    user: number;
  }>({
    id: 0,
    chatId: 0,
    senderMessage: 0,
    text: "",
    user: 0,
  });

  const handleMouseDown = (e, message: IMessage) => {
    if (e.nativeEvent?.which === 3) {
      setEditMessage(true);
      setClientX(e.nativeEvent.layerX);
      setClientY(e.nativeEvent.layerY);
      if (e.nativeEvent.screenY > 400) {
        setPosition(true);
      }
      setClient({
        id: message?.id,
        chatId: chat?.id ? chat.id : 0,
        senderMessage: message?.senderMessage.id,
        user: Number(user?.id),
        text: message?.text,
      });
    }
  };

  return (
    <li
      className={cn(className, styles.message, {
        [styles.messageUser]: username === message?.senderMessage.username,
        [styles.messageDown]:
          messages[Number(index + 1)]?.senderMessage.username !==
            message?.senderMessage.username &&
          messages[Number(index + 1)]?.senderMessage.username !== undefined,
        [styles.wrapperReply]: message?.reply !== null,
      })}
      onMouseMove={(e: any) => {
        if (!editMessage) {
          setClientX(e.nativeEvent.layerX);
          if (e.nativeEvent.screenY > 400)
            setClientY(
              message?.senderMessage.id === user?.id
                ? e.nativeEvent.layerY - 120
                : e.nativeEvent.layerY - 65
            );
        }
      }}
      onMouseLeave={() => setEditMessage(false)}
      onMouseDown={(e) => message && handleMouseDown(e, message)}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      {...props}
    >
      {message?.reply ? (
        <div className={styles.messageReply}>
          <div className={cn(styles.textWrapper)}>
            <p
              className={cn(styles.messageWrapperEdit, {
                [styles.messageWrapperUser]:
                  user?.username === message?.senderMessage.username,
              })}
            >
              {message?.reply.senderMessage.name}
            </p>
            <p
              className={cn(styles.textMessage, {
                [styles.messageWrapperUser]:
                  user?.username === message?.senderMessage.username,
              })}
            >
              {message?.reply.text}
            </p>
          </div>
        </div>
      ) : null}
      <div
        className={cn(styles.textMessageWrap, {
          [styles.messageTextWrap]: message?.text.length < 45,
        })}
      >
        <span className={cn(styles.messageText)}>{message?.text}</span>
        <div
          className={cn(styles.bottoMessage, {
            [styles.messageTextLen]: message?.text.length < 45,
          })}
        >
          <span className={styles.messageEdit}>
            {message?.createdAt !== message?.updatedAt ? "edited" : null}
          </span>
          <span className={styles.messageDate}>
            {formatHours(new Date(message?.createdAt))}
          </span>
        </div>
      </div>
      <span
        className={cn(
          messages[Number(index + 1)]?.senderMessage.username !==
            user?.username && user?.username === message?.senderMessage.username
            ? styles.messageStyleLeft
            : null,
          messages[Number(index + 1)]?.senderMessage.username ===
            user?.username && user?.username !== message?.senderMessage.username
            ? styles.messageStyleRight
            : null,
          messages[Number(index + 1)]?.senderMessage.username === undefined
            ? message?.senderMessage.username === user?.username
              ? styles.messageStyleLeft
              : styles.messageStyleRight
            : null,
          new Date(message?.createdAt).getDate() !==
            new Date(messages[index + 1]?.createdAt).getDate()
            ? message?.senderMessage.username === user?.username
              ? styles.messageStyleLeft
              : styles.messageStyleRight
            : null
        )}
      ></span>
      <MessageEdit
        editMessage={editMessage}
        client={client}
        clientX={clientX}
        clientY={clientY}
        position={position}
        setEditMessage={setEditMessage}
      />
    </li>
  );
};

import React, { useState } from "react";
import cn from "classnames";

import { MessageCardProps } from "./MessageCard.props";

import styles from "./MessageCard.module.css";
import { formatHours } from "helpers";
import { MessageEdit } from "components";
import { IMessage } from "interface";

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

  const handleMouseDown = (e: any, message: IMessage) => {
    if (e.nativeEvent?.which === 3) {
      setEditMessage(true);
      setClientX(e.nativeEvent.layerX);
      setClientY(e.nativeEvent.layerY);
      setClient({
        id: message.id,
        chatId: chat?.id ? chat.id : 0,
        senderMessage: message.senderMessage.id,
        user: Number(user?.id),
        text: message.text,
      });
    }
  };

  return (
    <li
      className={cn(className, styles.message, {
        [styles.messageUser]: username === message.senderMessage.username,
        [styles.messageDown]:
          messages[Number(index + 1)]?.senderMessage.username !==
            message.senderMessage.username &&
          messages[Number(index + 1)]?.senderMessage.username !== undefined,
      })}
      onMouseMove={(e: any) => {
        if (!editMessage) {
          setClientX(e.nativeEvent.layerX);
          setClientY(e.nativeEvent.layerY);
        }
      }}
      onMouseLeave={() => setEditMessage(false)}
      onMouseDown={(e) => handleMouseDown(e, message)}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      {...props}
    >
      <span className={styles.messageText}>{message.text}</span>
      <span className={styles.messageEdit}>
        {message.createdAt === message.updatedAt ? null : "edited"}
      </span>
      <span className={styles.messageDate}>
        {formatHours(new Date(message.createdAt))}
      </span>
      <span
        className={cn(
          messages[Number(index + 1)]?.senderMessage.username !==
            user?.username && user?.username === message.senderMessage.username
            ? styles.messageStyleLeft
            : null,
          messages[Number(index + 1)]?.senderMessage.username ===
            user?.username && user?.username !== message.senderMessage.username
            ? styles.messageStyleRight
            : null,
          messages[Number(index + 1)]?.senderMessage.username === undefined
            ? message.senderMessage.username === user?.username
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
        setEditMessage={setEditMessage}
      />
    </li>
  );
};

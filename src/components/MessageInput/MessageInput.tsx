import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import cn from "classnames";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useMutation } from "@apollo/client";

import { MessageInputProps } from "./MessageInput.props";
import { addMessages, updateMessages } from "mutation";
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from "assets";

import styles from "./MessageInput.module.css";
import { actionClearMessageEdit, getMessageEdit } from "store";
import { useAppDispatch, useAppSelector } from "hooks";

export const MessageInput = forwardRef(
  (
    { chat, user, className, ...props }: MessageInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [metationFunction] = useMutation(addMessages);
    const [mutationFunctionUpdate] = useMutation(updateMessages);
    const {
      message: { message, edit },
    } = useAppSelector(getMessageEdit);
    const dispatch = useAppDispatch();

    const [emoji, setEmoji] = useState<boolean>(false);
    const [send, setSend] = useState<string>(message ? message.text : "");

    const handleEmoji = (emoji) => {
      setSend(send + String(emoji.native));
    };

    const handleSend = async (e) => {
      if (chat)
        if (message) {
          if (e.code === "Enter") {
            if (edit) {
              setSend("");
              dispatch(actionClearMessageEdit());
              await mutationFunctionUpdate({
                variables: {
                  message: {
                    id: Number(message.id),
                    chatId: Number(message.chatId),
                    text: send,
                    senderMessage: Number(user?.id),
                  },
                },
              });
            }
            if (!edit) {
              setSend("");
              dispatch(actionClearMessageEdit());
              await metationFunction({
                variables: {
                  message: {
                    chatId: Number(message.chatId),
                    text: send,
                    reply: Number(message.id),
                    senderMessage: Number(user?.id),
                  },
                },
              });
            }
          }
        } else {
          if (send.replaceAll(" ", "") !== "") {
            if (e.code === "Enter") {
              setSend("");
              await metationFunction({
                variables: {
                  message: {
                    text: send,
                    senderMessage: Number(user?.id),
                    chatId: Number(chat?.id),
                  },
                },
              });
            }
          }
        }
    };

    const handleSendClick = async () => {
      if (chat) {
        if (message) {
          if (edit) {
            setSend("");
            dispatch(actionClearMessageEdit());
            await mutationFunctionUpdate({
              variables: {
                message: {
                  id: Number(message.id),
                  chatId: Number(message.chatId),
                  text: send,
                  senderMessage: Number(user?.id),
                },
              },
            });
          }
          if (!edit) {
            setSend("");
            dispatch(actionClearMessageEdit());
            await metationFunction({
              variables: {
                message: {
                  chatId: Number(message.chatId),
                  text: send,
                  reply: Number(message.id),
                  senderMessage: Number(user?.id),
                },
              },
            });
          }
        } else {
          if (send.replaceAll(" ", "") !== "") {
            setSend("");
            await metationFunction({
              variables: {
                message: {
                  text: send,
                  senderMessage: Number(user?.id),
                  chatId: chat.id,
                },
              },
            });
          }
        }
      }
    };

    const handleRemoveEditMessage = () => {
      dispatch(actionClearMessageEdit());
    };

    useEffect(() => {
      if (message) {
        if (edit) setSend(message.text);
        if (!edit) setSend("");
      } else {
        setSend("");
      }
    }, [message, edit]);

    return (
      <div className={styles.inputWrapper}>
        {chat ? (
          message ? (
            Number(message.chatId) === Number(chat?.id) ? (
              <div className={styles.messageReply}>
                {edit ? (
                  <EditIcon className={styles.iconEditMessage} />
                ) : (
                  <ReplyIcon className={styles.iconEditMessage} />
                )}
                <div className={styles.textWrapper}>
                  <p className={styles.messageWrapperEdit}>
                    {edit ? "Editing" : "Reply"}
                  </p>
                  <p className={styles.textMessage}>{message.text}</p>
                </div>
                <RemoveIcon
                  className={styles.iconRemoveEdit}
                  onClick={handleRemoveEditMessage}
                />
              </div>
            ) : null
          ) : null
        ) : null}
        <input
          value={String(send)}
          placeholder='Message'
          className={cn(className, styles.input, {
            [styles.inputEdit]:
              message !== null && Number(message.chatId) === Number(chat?.id),
          })}
          onChange={(e) => {
            setSend(e.target.value);
            setEmoji(false);
          }}
          onFocus={() => setEmoji(false)}
          onKeyDown={(e) => handleSend(e)}
          ref={ref}
          {...props}
        />
        <SmileIcon
          className={cn(styles.smileIcon, {
            [styles.emojiIconOn]: emoji === true,
          })}
          onClick={() => setEmoji(!emoji)}
        />
        <span className={cn(styles.send)} onClick={handleSendClick}>
          <SendIcon className={cn(styles.sendIcon)} />
        </span>
        <div
          className={cn(styles.emojiWrapper, {
            [styles.emojiWrapperOn]: emoji === true,
          })}
        >
          <Picker
            theme={user?.theme ? "dark" : "light"}
            data={data}
            onEmojiSelect={handleEmoji}
          />
        </div>
        <span className={styles.inputStyles}></span>
      </div>
    );
  }
);

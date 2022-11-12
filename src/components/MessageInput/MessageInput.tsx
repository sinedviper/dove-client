/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */
import React, { ForwardedRef, forwardRef, useState } from "react";
import cn from "classnames";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";

import { MessageInputProps } from "./MessageInput.props";
import { useAppDispatch } from "hooks";
import { addMessages } from "mutation";
import { actionAddMessages } from "store";
import { SendIcon, SmileIcon } from "assets";

import styles from "./MessageInput.module.css";

export const MessageInput = forwardRef(
  (
    { chat, user, className, ...props }: MessageInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [emoji, setEmoji] = useState<boolean>(false);
    const [send, setSend] = useState<string>("");

    const dispatch = useAppDispatch();
    const [metationFunction] = useMutation(addMessages);

    const handleEmoji = (emoji) => {
      setSend(send + String(emoji.native));
    };

    const handleSend = async (e) => {
      if (chat)
        if (send.replaceAll(" ", "") !== "") {
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
        }
    };

    const handleSendClick = async () => {
      if (chat) {
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
      }
    };

    return (
      <div className={styles.inputWrapper}>
        <input
          value={String(send)}
          className={cn(className, styles.input)}
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
          <Picker theme={"light"} data={data} onEmojiSelect={handleEmoji} />
        </div>
        <span className={styles.inputStyles}></span>
      </div>
    );
  }
);

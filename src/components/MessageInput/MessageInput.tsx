import React, { ForwardedRef, forwardRef, useState } from "react";
import cn from "classnames";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useMutation } from "@apollo/client";

import { MessageInputProps } from "./MessageInput.props";
import { addMessages } from "mutation";
import { SendIcon, SmileIcon } from "assets";

import styles from "./MessageInput.module.css";

export const MessageInput = forwardRef(
  (
    { chat, user, className, ...props }: MessageInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [metationFunction] = useMutation(addMessages);

    const [emoji, setEmoji] = useState<boolean>(false);
    const [send, setSend] = useState<string>("");

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
                  chatId: Number(chat?.id),
                },
              },
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
          });
        }
      }
    };

    return (
      <div className={styles.inputWrapper}>
        <input
          value={String(send)}
          placeholder='Message'
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

import React, { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import cn from "classnames";
import TextareaAutosize from "react-textarea-autosize";

import { useAppDispatch, useAppSelector, useWindowSize } from "utils/hooks";
import { IChat, IUser } from "utils/interface";
import {
  actionAddTabIndexEighth,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  getChat,
  getMessageEdit,
  getRecipient,
  getTabIndexEighth,
  getTabIndexFirst,
  getTabIndexSixth,
  getUser,
} from "store";
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from "assets";

import { useMessageInput } from "./useMessageInput";
import { MessageInputProps } from "./MessageInput.props";
import styles from "./MessageInput.module.css";

export const MessageInput = ({
  className,
  main,
  ...props
}: MessageInputProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const windowSize = useWindowSize();

  const textarea = useRef<HTMLTextAreaElement>(null);

  const {
    message: { message, edit },
  } = useAppSelector(getMessageEdit);
  const user: IUser | undefined = useAppSelector(getUser);
  const sender: IUser | undefined = useAppSelector(getRecipient);
  const chat: IChat | undefined = useAppSelector(getChat)?.filter(
    (chat) => chat?.user?.id === sender?.id
  )[0];
  const tabIndexEighth: number = useAppSelector(getTabIndexEighth);
  const tabIndexSixth: number = useAppSelector(getTabIndexSixth);
  const tabIndexFirst: number = useAppSelector(getTabIndexFirst);

  const [emoji, setEmoji] = useState<boolean>(false);
  const [send, setSend] = useState<string>(
    message !== undefined ? message.text : ""
  );
  //all functional what need work for input message
  const { handleEmoji, handleSend, handleSendClick, handleRemoveEditMessage } =
    useMessageInput(chat, send, sender, setSend, message, user, Boolean(edit));

  //makes sure that in editing, if editing is true, then it adds text to the field, if not, it makes it empty
  useEffect(() => {
    if (message) {
      if (edit) setSend(message.text);
      if (!edit) setSend("");
    }
  }, [message, edit]);

  useEffect(() => {
    setSend("");
  }, []);

  useEffect(() => {
    if (main === false) {
      setSend(" ");
    }
  }, [main]);

  return (
    <div className={cn(styles.inputWrapper)}>
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
      <TextareaAutosize
        tabIndex={tabIndexSixth}
        value={send}
        placeholder='Message'
        className={cn(className, styles.input, {
          [styles.textareaOff]: send === "",
        })}
        onChange={(e) => {
          setSend(e.target.value);
          setEmoji(false);
        }}
        onFocus={() => setEmoji(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend(e);
          }
        }}
        maxLength={1000}
        style={{ overflow: send.length === 0 ? "hidden" : "" }}
        minRows={1}
        maxRows={21}
        ref={textarea}
      />
      <button
        className={cn(styles.smileIconWrapper)}
        tabIndex={tabIndexEighth === -1 ? (tabIndexSixth === 0 ? 0 : -1) : 0}
        onClick={() => {
          setEmoji(!emoji);
          dispatch(actionAddTabIndexEighth(tabIndexEighth === 0 ? -1 : 0));
          dispatch(actionAddTabIndexFirst(tabIndexFirst === 0 ? -1 : 0));
          dispatch(actionAddTabIndexSixth(tabIndexSixth === 0 ? -1 : 0));
          if (windowSize[0] < 1000) {
            dispatch(actionAddTabIndexFirst(-1));
          }
        }}
      >
        <SmileIcon
          className={cn(styles.smileIcon, {
            [styles.emojiIconOn]: emoji === true,
          })}
        />
      </button>
      <button
        className={cn(styles.send)}
        onClick={handleSendClick}
        tabIndex={tabIndexSixth}
      >
        <SendIcon className={cn(styles.sendIcon)} />
      </button>
      <div
        className={cn(styles.emojiWrapper, {
          [styles.emojiWrapperOn]: emoji === true,
        })}
        tabIndex={tabIndexEighth}
      >
        <Picker
          theme={user?.theme ? "dark" : "light"}
          data={data}
          onEmojiSelect={handleEmoji}
          tabIndex={tabIndexEighth}
        />
      </div>
    </div>
  );
};

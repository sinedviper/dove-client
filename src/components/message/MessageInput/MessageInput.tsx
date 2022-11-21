import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import cn from "classnames";

import { useAppDispatch, useAppSelector } from "utils/hooks";
import { IUser } from "utils/interface";
import { addChat } from "resolvers/chats";
import { addMessages, updateMessages } from "resolvers/messages";
import {
  actionAddChats,
  actionAddError,
  actionClearMessageEdit,
  getMessageEdit,
  getRecipient,
} from "store";
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from "assets";

import { MessageInputProps } from "./MessageInput.props";
import styles from "./MessageInput.module.css";
import { checkAuthorization } from "utils/helpers";
import { useNavigate } from "react-router-dom";
import { useTheme } from "utils/context";

export const MessageInput = forwardRef(
  (
    { chat, user, className, ...props }: MessageInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const themeChange = useTheme();

    const {
      message: { message, edit },
    } = useAppSelector(getMessageEdit);
    const sender: IUser | undefined = useAppSelector(getRecipient);

    const [mutationFunctionAddChat, { error: errorMutationChat }] = useMutation(
      addChat,
      {
        fetchPolicy: "network-only",
        onCompleted(data) {
          checkAuthorization({
            dispatch,
            navigate,
            data: data.addChat,
            actionAdd: actionAddChats,
            themeChange,
          });
        },
      }
    );
    const [mutationFunctionAddMessage, { error: errorMutationMessageAdd }] =
      useMutation(addMessages);
    const [
      mutationFunctionUpdateMessage,
      { error: errorMutationMessageUpdate },
    ] = useMutation(updateMessages);

    const [emoji, setEmoji] = useState<boolean>(false);
    const [send, setSend] = useState<string>(message ? message.text : "");

    const handleEmoji = (emoji) => {
      setSend(send + String(emoji.native));
    };

    const handleAddChat = async () => {
      await mutationFunctionAddChat({
        variables: {
          chat: { sender: Number(user?.id), recipient: Number(sender?.id) },
        },
      });
    };

    const handleMessageUpdate = async () => {
      setSend("");
      await mutationFunctionUpdateMessage({
        variables: {
          message: {
            id: Number(message?.id),
            chatId: Number(chat?.id),
            text: send,
            senderMessage: Number(user?.id),
          },
        },
      });
      dispatch(actionClearMessageEdit());
    };

    const handleMessageAdd = async () => {
      setSend("");
      await mutationFunctionAddMessage({
        variables: {
          message: {
            text: send,
            senderMessage: Number(user?.id),
            chatId: Number(chat?.id),
            reply: message && Number(message?.id),
          },
        },
      });
      dispatch(actionClearMessageEdit());
    };

    const handleSend = async (e) => {
      if (chat) {
        if (message) {
          if (e.code === "Enter") {
            edit && (await handleMessageUpdate());
            !edit && (await handleMessageAdd());
          }
        } else {
          send.replaceAll(" ", "") !== "" &&
            e.code === "Enter" &&
            (await handleMessageAdd());
        }
      } else {
        handleAddChat();
      }
    };

    const handleSendClick = async () => {
      if (chat) {
        if (message) {
          edit && (await handleMessageUpdate());
          !edit && (await handleMessageAdd());
        } else {
          if (send.replaceAll(" ", "") !== "") {
            await handleMessageAdd();
          }
        }
      } else {
        handleAddChat();
      }
    };

    const handleRemoveEditMessage = () => {
      dispatch(actionClearMessageEdit());
    };

    useEffect(() => {
      if (errorMutationChat)
        dispatch(actionAddError(errorMutationChat.message));
      if (errorMutationMessageAdd)
        dispatch(actionAddError(errorMutationMessageAdd.message));
      if (errorMutationMessageUpdate)
        dispatch(actionAddError(errorMutationMessageUpdate.message));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      errorMutationChat,
      errorMutationMessageAdd,
      errorMutationMessageUpdate,
    ]);

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
              message !== null && Number(message?.chatId) === Number(chat?.id),
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

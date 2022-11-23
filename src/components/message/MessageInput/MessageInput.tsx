import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import cn from "classnames";

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useError,
} from "utils/hooks";
import { IUser } from "utils/interface";
import { addChat, getChats } from "resolvers/chats";
import { addMessages, updateMessages } from "resolvers/messages";
import {
  actionAddChats,
  actionAddMessages,
  actionClearMessageEdit,
  getMessageEdit,
  getRecipient,
} from "store";
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from "assets";

import { MessageInputProps } from "./MessageInput.props";
import styles from "./MessageInput.module.css";

export const MessageInput = forwardRef(
  (
    { chat, user, className, ...props }: MessageInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const dispatch = useAppDispatch();
    const error = useError();
    const authorization = useAuthorization();

    const {
      message: { message, edit },
    } = useAppSelector(getMessageEdit);
    const sender: IUser | undefined = useAppSelector(getRecipient);

    const [queryFunctionChat, { error: errorQueryChat }] = useLazyQuery(
      getChats,
      {
        fetchPolicy: "network-only",
        onCompleted(data) {
          authorization({ data: data.getChats, actionAdd: actionAddChats });
        },
      }
    );

    const [mutationFunctionAddChat, { error: errorMutationChat }] = useMutation(
      addChat,
      {
        fetchPolicy: "network-only",
        onCompleted(data) {
          authorization({ data: data.addChat, actionAdd: actionAddChats });
        },
      }
    );
    const [mutationFunctionAddMessage, { error: errorMutationMessageAdd }] =
      useMutation(addMessages, {
        fetchPolicy: "network-only",
        onCompleted(data) {
          authorization({
            data: data.addMessage,
            actionAdd: actionAddMessages,
          });
        },
      });

    const [
      mutationFunctionUpdateMessage,
      { error: errorMutationMessageUpdate },
    ] = useMutation(updateMessages, {
      fetchPolicy: "network-only",
      onCompleted(data) {
        authorization({
          data: data.updateMessages,
          actionAdd: actionAddMessages,
        });
      },
    });

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
        onCompleted: async () => {
          if (send.replaceAll(" ", "") !== "") await handleMessageAdd();
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
      await queryFunctionChat();
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
        if (send.replaceAll(" ", "") !== "" && e.code === "Enter") {
          await handleAddChat();
        }
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
        if (send.replaceAll(" ", "") !== "") {
          await handleAddChat();
        }
      }
    };

    const handleRemoveEditMessage = () => {
      dispatch(actionClearMessageEdit());
    };

    useEffect(() => {
      if (errorMutationChat) error(errorMutationChat.message);
      if (errorMutationMessageAdd) error(errorMutationMessageAdd.message);
      if (errorMutationMessageUpdate) error(errorMutationMessageUpdate.message);
      if (errorQueryChat) error(errorQueryChat.message);
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

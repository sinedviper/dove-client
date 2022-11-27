import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import cn from "classnames";
import TextareaAutosize from "react-textarea-autosize";

import {
  useAppDispatch,
  useAppSelector,
  useAuthorization,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { IChat, IUser } from "utils/interface";
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

export const MessageInput = ({
  chat,
  user,
  className,
  ...props
}: MessageInputProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const error = useError();
  const authorization = useAuthorization();
  const atorizationSearch = useAuthorizationSearch();

  const {
    message: { message, edit },
  } = useAppSelector(getMessageEdit);
  const sender: IUser | undefined = useAppSelector(getRecipient);

  const [queryFunctionChat] = useLazyQuery(getChats, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({ data: data.getChats, actionAdd: actionAddChats });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [mutationFunctionAddMessage] = useMutation(addMessages, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({
        data: data.addMessage,
        actionAdd: actionAddMessages,
      });
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [mutationFunctionAddChat] = useMutation(addChat, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      authorization({ data: data.addChat, actionAdd: actionAddChats });
      const chat: IChat | undefined = atorizationSearch({
        data: data.addChat,
      })?.filter((chat) => chat?.user?.id === sender?.id)[0];
      if (send.replaceAll(" ", "") !== "") await handleMessageAdd(chat);
    },
    onError(errorData) {
      error(errorData.message);
    },
  });

  const [mutationFunctionUpdateMessage] = useMutation(updateMessages, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({
        data: data.updateMessages,
        actionAdd: actionAddMessages,
      });
    },
    onError(errorData) {
      error(errorData.message);
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
    });
  };

  const handleMessageUpdate = async () => {
    if (chat) {
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
    }
  };

  const handleMessageAdd = async (chat) => {
    if (chat) {
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
    }
  };

  const handleSend = async (e) => {
    if (chat) {
      if (message) {
        if (e.code === "Enter") {
          e.preventDefault();
          edit && (await handleMessageUpdate());
          !edit && (await handleMessageAdd(chat));
        }
      } else {
        if (send.replaceAll(" ", "") !== "")
          if (e.code === "Enter") {
            e.preventDefault();
            await handleMessageAdd(chat);
          }
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
        !edit && (await handleMessageAdd(chat));
      } else {
        if (send.replaceAll(" ", "") !== "") {
          await handleMessageAdd(chat);
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
      <TextareaAutosize
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
        onKeyDown={(e) => {
          handleSend(e);
          if (e.keyCode === 13 && !e.shiftKey) {
            // prevent default behavior
          }
        }}
        maxLength={1000}
        style={{ overflow: send.length === 0 ? "hidden" : "" }}
        minRows={1}
        maxRows={21}
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
};

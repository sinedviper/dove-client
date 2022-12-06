import React, { useEffect, useRef, useState } from "react";
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
  useWindowSize,
} from "utils/hooks";
import { IChat, IUser } from "utils/interface";
import { addChat, getChats } from "resolvers/chats";
import { addMessages, updateMessages } from "resolvers/messages";
import {
  actionAddChats,
  actionAddMessages,
  actionAddTabIndexEighth,
  actionAddTabIndexFirst,
  actionAddTabIndexSixth,
  actionClearMessageEdit,
  getChat,
  getMessageEdit,
  getRecipient,
  getTabIndexEighth,
  getTabIndexFirst,
  getTabIndexSixth,
  getUser,
} from "store";
import { EditIcon, RemoveIcon, ReplyIcon, SendIcon, SmileIcon } from "assets";

import { MessageInputProps } from "./MessageInput.props";
import styles from "./MessageInput.module.css";

export const MessageInput = ({
  className,
  main,
  ...props
}: MessageInputProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const error = useError();
  const authorization = useAuthorization();
  const atorizationSearch = useAuthorizationSearch();
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

  const [queryFunctionChat] = useLazyQuery(getChats, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      authorization({ data: data.getChats, actionAdd: actionAddChats });
    },
    onError(errorData) {
      error(errorData.message + " getChats");
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
  const [send, setSend] = useState<string>(
    message !== undefined ? message.text : ""
  );
  //add emoji in text function
  const handleEmoji = (emoji) => {
    setSend(send + String(emoji.native));
  };
  //add chat with user
  const handleAddChat = async () => {
    await mutationFunctionAddChat({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(sender?.id) },
      },
    });
  };
  //function edit message
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
  //function add message
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
  //send processing function
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
  //send processing function for click
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
  //when have edit message but wont delete and not edit message
  const handleRemoveEditMessage = () => {
    dispatch(actionClearMessageEdit());
  };

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
      textarea?.current?.focus();
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

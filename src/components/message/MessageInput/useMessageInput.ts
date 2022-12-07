import { IUser } from "./../../../utils/interface/IUser";
import { useMutation } from "@apollo/client";

import { addChat } from "resolvers/chats";
import { addMessages, updateMessages } from "resolvers/messages";
import {
  actionAddChats,
  actionAddMessages,
  actionClearMessageEdit,
} from "store";
import {
  useAppDispatch,
  useAuthorization,
  useAuthorizationSearch,
  useError,
} from "utils/hooks";
import { IChat, IMessage } from "utils/interface";

export const useMessageInput = (
  chat: IChat | undefined,
  send: string,
  sender: IUser | undefined,
  setSend: (send: string) => void,
  message: IMessage | undefined,
  user: IUser | undefined,
  edit: boolean
) => {
  const dispatch = useAppDispatch();
  const error = useError();
  const authorization = useAuthorization();
  const atorizationSearch = useAuthorizationSearch();

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

  return {
    handleEmoji,
    handleSend,
    handleSendClick,
    handleRemoveEditMessage,
  };
};

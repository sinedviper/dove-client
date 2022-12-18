import { useMutation } from "@apollo/client";

import { addChat } from "resolvers/chats";
import { addMessages, updateMessages } from "resolvers/messages";
import {
  actionAddChats,
  actionAddMessages,
  actionClearMessageEdit,
} from "store/slice";
import {
  useAppDispatch,
  useAuthorization,
  useAuthorizationData,
  useError,
} from "utils/hooks";
import { IChat, IMessage, IUser } from "utils/interface";

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
  const autorizationData = useAuthorizationData();

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
      const chat: IChat = autorizationData({
        data: data.addChat,
      })?.filter((chat: IChat) => chat?.user?.id === sender?.id)[0];
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
  const handleEmoji = (emoji): void => {
    setSend(send + String(emoji.native));
  };
  //add chat with user
  const handleAddChat = async (): Promise<void> => {
    await mutationFunctionAddChat({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(sender?.id) },
      },
    });
  };
  //function edit message
  const handleMessageUpdate = async (): Promise<void> => {
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
  const handleMessageAdd = async (chat: IChat): Promise<void> => {
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
  const handleSend = async (e): Promise<void> => {
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
  const handleSendClick = async (): Promise<void> => {
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

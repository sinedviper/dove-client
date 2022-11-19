import { gql } from "@apollo/client";

export const addChat = gql`
  mutation Mutation($chat: ChatInput!) {
    addChat(chat: $chat)
  }
`;

export const removeChat = gql`
  mutation Mutation($idChat: Float!) {
    deleteChat(idChat: $idChat)
  }
`;

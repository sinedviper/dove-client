import { gql } from "@apollo/client";

export const getChats = gql`
  query Query {
    getChats {
      status
      message
      data {
        id
        user {
          id
          username
          email
          name
          surname
        }
        lastMessage {
          id
          senderMessage {
            id
            name
            surname
            username
            email
          }
          text
          createdAt
        }
      }
    }
  }
`;

export const addChat = gql`
  mutation Mutation($chat: ChatInput!) {
    addChat(chat: $chat) {
      status
      message
    }
  }
`;

export const removeChat = gql`
  mutation Mutation($idChat: Float!) {
    deleteChat(idChat: $idChat) {
      status
      message
    }
  }
`;

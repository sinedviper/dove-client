import { gql } from "@apollo/client";

export const subscribeChats = gql`
  subscription Subscription {
    chatSubscription {
      status
      code
      data {
        id
        user {
          id
          username
          email
          name
          surname
          online
        }
        lastMessage {
          id
          text
          createdAt
        }
      }
      message
    }
  }
`;

export const getChats = gql`
  query Query {
    getChats {
      status
      code
      data {
        id
        user {
          id
          username
          email
          name
          surname
          online
        }
        lastMessage {
          id
          text
          createdAt
        }
      }
      message
    }
  }
`;

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

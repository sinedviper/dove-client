import { gql } from "@apollo/client";

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
          senderMessage {
            id
            username
            email
            name
            surname
          }
        }
      }
    }
  }
`;

export const addChat = gql`
  mutation Mutation($chat: ChatInput!) {
    addChat(chat: $chat) {
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
          senderMessage {
            id
            username
            email
            name
            surname
          }
        }
      }
    }
  }
`;

export const removeChat = gql`
  mutation Mutation($idChat: Float!) {
    deleteChat(idChat: $idChat) {
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
          senderMessage {
            id
            username
            email
            name
            surname
          }
        }
      }
    }
  }
`;

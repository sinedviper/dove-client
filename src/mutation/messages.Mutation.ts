import { gql } from "@apollo/client";

export const getMessage = gql`
  query GetMessages($message: MessageInput!) {
    getMessages(message: $message) {
      data {
        text
        senderMessage {
          id
          name
          surname
          username
        }
        reply {
          text
          id
          createdAt
        }
        id
        chatId {
          id
        }
        createdAt
      }
      message
      status
    }
  }
`;

export const addMessages = gql`
  mutation Mutation($message: MessageInput!) {
    addMessage(message: $message) {
      data {
        text
        senderMessage {
          id
          name
          surname
          username
        }
        reply {
          text
          id
          createdAt
        }
        id
        chatId {
          id
        }
        createdAt
      }
      message
      status
    }
  }
`;

export const deleteMessages = gql`
  mutation Mutation($message: MessageInput!) {
    deleteMessage(message: $message) {
      data {
        text
        senderMessage {
          id
          name
          surname
          username
        }
        reply {
          text
          id
          createdAt
        }
        id
        chatId {
          id
        }
        createdAt
      }
      message
      status
    }
  }
`;

export const updateMessages = gql`
  mutation Mutation($message: MessageInput!) {
    updateMessage(message: $message) {
      data {
        text
        senderMessage {
          id
          name
          surname
          username
        }
        reply {
          text
          id
          createdAt
        }
        id
        chatId {
          id
        }
        createdAt
      }
      message
      status
    }
  }
`;

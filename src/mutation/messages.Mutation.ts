import { gql } from "@apollo/client";

export const getMessage = gql`
  query GetMessages($message: MessageFindInput!) {
    getMessages(message: $message) {
      data {
        id
        senderMessage {
          createdAt
          email
          id
          name
          surname
          username
        }
        text
        updatedAt
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
      status
      message
      data {
        id
        createdAt
        text
        updatedAt
        senderMessage {
          createdAt
          email
          id
          name
          surname
          updatedAt
          username
        }
      }
    }
  }
`;

export const deleteMessages = gql`
  mutation Mutation($message: MessageDeleteInput!) {
    deleteMessage(message: $message) {
      message
      status
      data {
        id
        createdAt
        text
        updatedAt
        senderMessage {
          createdAt
          email
          id
          name
          surname
          updatedAt
          username
        }
      }
    }
  }
`;

export const updateMessages = gql`
  mutation Mutation($message: MessageUpdateInput!) {
    updateMessage(message: $message) {
      message
      status
    }
  }
`;

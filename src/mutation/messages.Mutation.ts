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

export const deleteMessages = gql`
  mutation Mutation($message: MessageDeleteInput!) {
    deleteMessage(message: $message) {
      message
      status
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

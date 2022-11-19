import { gql } from "@apollo/client";

export const addMessages = gql`
  mutation Mutation($message: MessageInput!) {
    addMessage(message: $message)
  }
`;

export const deleteMessages = gql`
  mutation Mutation($message: MessageInput!) {
    deleteMessage(message: $message)
  }
`;

export const updateMessages = gql`
  mutation Mutation($message: MessageInput!) {
    updateMessage(message: $message)
  }
`;

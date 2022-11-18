import { gql } from "@apollo/client";

export const subscribeMessages = gql`
  subscription Subscription {
    messageSubscription {
      status
      code
      data {
        id
        senderMessage {
          id
          username
          email
          name
          surname
        }
        text
        reply {
          id
          senderMessage {
            id
            username
            email
            name
            surname
          }
          text
          createdAt
        }
        updatedAt
        createdAt
      }
      message
    }
  }
`;

export const getMessage = gql`
  query Query($message: MessageInput!) {
    getMessages(message: $message) {
      status
      code
      data {
        id
        senderMessage {
          id
          username
          email
          name
          surname
        }
        text
        reply {
          id
          senderMessage {
            id
            username
            email
            name
            surname
          }
          text
          createdAt
        }
        updatedAt
        createdAt
      }
      message
    }
  }
`;

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

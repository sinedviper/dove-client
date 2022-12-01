import { gql } from "@apollo/client";

export const addMessages = gql`
  mutation Mutation($message: MessageInput!) {
    addMessage(message: $message) {
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
        read
        dateUpdate
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

export const deleteMessages = gql`
  mutation Mutation($message: MessageInput!) {
    deleteMessage(message: $message) {
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
        read
        dateUpdate
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

export const updateMessages = gql`
  mutation Mutation($message: MessageInput!) {
    updateMessage(message: $message) {
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

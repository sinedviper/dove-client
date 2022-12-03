import { gql } from "@apollo/client";

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

export const getHaveMessages = gql`
  query Query($message: MessageInput!) {
    haveMessageFind(message: $message) {
      status
      code
      data
      message
    }
  }
`;

export const getfindMessageDate = gql`
  query GetUploadUser($message: MessageInput!) {
    findMessageDate(message: $message) {
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

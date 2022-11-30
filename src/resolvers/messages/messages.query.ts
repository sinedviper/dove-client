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

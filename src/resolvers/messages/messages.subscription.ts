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

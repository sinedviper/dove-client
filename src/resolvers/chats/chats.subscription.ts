import { gql } from "@apollo/client";

export const subscribeChats = gql`
  subscription Subscription {
    chatSubscription {
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
          bio
        }
        lastMessage {
          id
          text
          createdAt
        }
      }
      message
    }
  }
`;

import { gql } from "@apollo/client";

export const subscribeUser = gql`
  subscription Subscription {
    userSubscription {
      status
      code
      data {
        id
        username
        email
        name
        surname
        online
        bio
        theme
        animation
        createdAt
        updatedAt
      }
      message
    }
  }
`;

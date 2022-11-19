import { gql } from "@apollo/client";

export const subscribeContacts = gql`
  subscription Subscription {
    contactSubscription {
      status
      code
      message
      data {
        id
        username
        email
        name
        surname
        online
        bio
        createdAt
        updatedAt
      }
    }
  }
`;

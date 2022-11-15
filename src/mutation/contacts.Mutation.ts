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

export const getContact = gql`
  query Query {
    getContacts {
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
        createdAt
        updatedAt
      }
      message
    }
  }
`;

export const addContact = gql`
  mutation Mutation($contact: ContactInput!) {
    addContact(contact: $contact)
  }
`;

export const deleteContact = gql`
  mutation Mutation($contact: ContactInput!) {
    deleteContact(contact: $contact)
  }
`;

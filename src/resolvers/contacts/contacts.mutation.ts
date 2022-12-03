import { gql } from "@apollo/client";

export const addContact = gql`
  mutation Mutation($contact: ContactInput!) {
    addContact(contact: $contact) {
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
        file
        createdAt
        updatedAt
      }
      message
    }
  }
`;

export const deleteContact = gql`
  mutation Mutation($contact: ContactInput!) {
    deleteContact(contact: $contact) {
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
        file
        createdAt
        updatedAt
      }
      message
    }
  }
`;

import { gql } from "@apollo/client";

export const getContact = gql`
  query GetContacts {
    getContacts {
      status
      message
      data {
        id
        username
        email
        name
        surname
      }
    }
  }
`;

export const addContact = gql`
  mutation Mutation($contact: ContactInput!) {
    addContact(contact: $contact) {
      status
      data {
        id
        username
        email
        name
        surname
      }
      message
    }
  }
`;

export const removeContact = gql`
  mutation Mutation($contact: ContactInput!) {
    deleteContact(contact: $contact) {
      status
      message
    }
  }
`;

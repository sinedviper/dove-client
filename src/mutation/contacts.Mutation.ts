import { gql } from "@apollo/client";

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
        createdAt
      }
      message
    }
  }
`;

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
        createdAt
      }
      message
    }
  }
`;

export const removeContact = gql`
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
        createdAt
      }
      message
    }
  }
`;

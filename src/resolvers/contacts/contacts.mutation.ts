import { gql } from "@apollo/client";

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

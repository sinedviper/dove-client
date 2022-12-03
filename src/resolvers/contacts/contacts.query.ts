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

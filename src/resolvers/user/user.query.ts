import { gql } from "@apollo/client";

export const getMe = gql`
  query Query {
    getMe {
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

export const getUserSender = gql`
  query Query($input: UserSearchInput!) {
    getUser(input: $input) {
      status
      code
      data {
        id
        username
        email
        name
        file
        surname
        online
        bio
      }
      message
    }
  }
`;

export const getUsersSearch = gql`
  query Query($input: UserSearchInput!) {
    searchUsers(input: $input) {
      status
      code
      data {
        id
        username
        email
        name
        file
        surname
        online
        bio
      }
      message
    }
  }
`;

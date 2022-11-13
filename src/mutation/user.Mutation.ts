import { gql } from "@apollo/client";

export const getMe = gql`
  query Query {
    getMe {
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
        theme
        animation
        createdAt
        updatedAt
      }
    }
  }
`;

export const signUp = gql`
  mutation Mutation($input: SignUpInput!) {
    signupUser(input: $input) {
      status
      code
      message
    }
  }
`;

export const loginUser = gql`
  mutation Mutation($input: LoginInput!) {
    loginUser(input: $input) {
      status
      code
      message
      access_token
    }
  }
`;

export const deleteUser = gql`
  mutation Mutation {
    deleteUser {
      status
      code
      message
    }
  }
`;
export const updateUser = gql`
  mutation Mutation($input: UpdateInput!) {
    updateUser(input: $input) {
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

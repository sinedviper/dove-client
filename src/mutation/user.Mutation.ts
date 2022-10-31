import { gql } from "@apollo/client";

export const getMe = gql`
  query Query {
    getMe {
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

export const signUp = gql`
  mutation signUp($input: SignUpInput!) {
    signupUser(input: $input) {
      status
      message
    }
  }
`;

export const loginUser = gql`
  mutation loginUser($input: LoginInput!) {
    loginUser(input: $input) {
      status
      message
      access_token
    }
  }
`;

export const deleteUser = gql`
  mutation deleteUser {
    deleteUser {
      status
      message
    }
  }
`;
export const updateUser = gql`
  mutation updateUser($input: UpdateInput!) {
    updateUser(input: $input) {
      status
      message
    }
  }
`;

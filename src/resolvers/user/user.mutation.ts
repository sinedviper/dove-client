import { gql } from "@apollo/client";

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
    updateUser(input: $input)
  }
`;

export const updateUserOnline = gql`
  mutation Mutation($input: UpdateInputOnline!) {
    updateUserOnline(input: $input)
  }
`;

import { gql } from "@apollo/client";

export const getChats = gql`
  query Query {
    getChats {
      status
      code
      data {
        id
        user {
          id
          username
          email
          name
          surname
          online
          bio
        }
        lastMessage {
          id
          text
          createdAt
        }
        image {
          id
          userUploadId
          file
          createdAt
        }
      }
      message
    }
  }
`;

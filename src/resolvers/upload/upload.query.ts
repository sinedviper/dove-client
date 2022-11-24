import { gql } from "@apollo/client";

export const getUploads = gql`
  query Query {
    getUpload {
      status
      code
      data {
        id
        userUploadId
        file
        createdAt
      }
      message
    }
  }
`;

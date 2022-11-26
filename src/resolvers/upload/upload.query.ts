import { gql } from "@apollo/client";

export const getUploads = gql`
  query GetUpload {
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

import { gql } from "@apollo/client";

export const addUpload = gql`
  mutation Mutation($upload: Upload!) {
    addUpload(upload: $upload) {
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

export const deleteUpload = gql`
  mutation Mutation($deleteUploadId: Float!, $file: String!) {
    deleteUpload(id: $deleteUploadId, file: $file) {
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

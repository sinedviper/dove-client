import { gql } from "@apollo/client";

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

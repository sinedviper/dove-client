import { gql } from "@apollo/client";

export const deleteUpload = gql`
  mutation DeleteUpload($idPhoto: Float!, $file: String!) {
    deleteUpload(idPhoto: $idPhoto, file: $file) {
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

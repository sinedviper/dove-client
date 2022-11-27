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

export const getUploadUser = gql`
  query GetUploadUser($idUser: Float!) {
    getUploadUser(idUser: $idUser) {
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

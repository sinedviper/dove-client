import { gql } from "@apollo/client";

export const addChat = gql`
  mutation Mutation($chat: ChatInput!) {
    addChat(chat: $chat) {
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
          read
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

export const removeChat = gql`
  mutation Mutation($idChat: Float!) {
    deleteChat(idChat: $idChat) {
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
          read
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

import { RootState } from 'store'

export const getChat = (state: RootState) => state.chats.chats
export const getChatUser = (state: RootState, action) =>
  state.chats.chats?.filter((chat) => chat?.user?.id === action)[0]

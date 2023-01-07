import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

import { IChat } from 'utils/interface'

interface IChatsState {
  chats: IChat[] | undefined
}

const initialState: IChatsState = {
  chats: undefined,
}

export const chatsSlice = createSlice({
  initialState,
  name: '@@chatsSlice',
  reducers: {
    actionClearChats: () => initialState,
    actionAddChats: (state: Draft<IChatsState>, action: PayloadAction<IChat[]>) => {
      state.chats = action.payload
    },
  },
})

export const chatsReducer = chatsSlice.reducer

export const { actionClearChats, actionAddChats } = chatsSlice.actions

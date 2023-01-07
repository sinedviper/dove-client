import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

import { IMessage } from 'utils/interface'

interface IMessageState {
  message: {
    message: Pick<IMessage, 'chatId' | 'id' | 'text'> | undefined
    edit: boolean | undefined
  }
}

const initialState: IMessageState = {
  message: {
    message: undefined,
    edit: undefined,
  },
}

export const messageEditSlice = createSlice({
  initialState,
  name: '@@messagesEditSlice',
  reducers: {
    actionClearMessageEdit: () => initialState,
    actionAddMessageEdit: (
      state: Draft<IMessageState>,
      action: PayloadAction<{ message: Pick<IMessage, 'chatId' | 'id' | 'text'>; edit: boolean }>,
    ) => {
      state.message = action.payload
    },
  },
})

export const messageEditReducer = messageEditSlice.reducer

export const { actionClearMessageEdit, actionAddMessageEdit } = messageEditSlice.actions

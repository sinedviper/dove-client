import { createSlice } from "@reduxjs/toolkit";

import { IMessage } from "utils/interface";
import { RootState } from "store";

interface IMessageState {
  messages: IMessage[] | undefined;
}

const initialState: IMessageState = {
  messages: undefined,
};

export const messagesSlice = createSlice({
  initialState,
  name: "@@messagesSlice",
  reducers: {
    actionClearMessages: () => initialState,
    actionAddMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const messagesReducer = messagesSlice.reducer;

export const { actionClearMessages, actionAddMessages } = messagesSlice.actions;

export const getMessages = (state: RootState) => state.messages.messages;

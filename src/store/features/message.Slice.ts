/* eslint-disable array-callback-return */
import { createSlice } from "@reduxjs/toolkit";

import { IMessage } from "interface";
import { RootState } from "store";

interface IMessageState {
  messages: IMessage[] | null;
}

const initialState: IMessageState = {
  messages: null,
};

export const messagesSlice = createSlice({
  initialState,
  name: "messagesSlice",
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

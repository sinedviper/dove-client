import { createSlice } from "@reduxjs/toolkit";

import { IMessage } from "utils/interface";

interface IMessageState {
  messages: IMessage[] | undefined;
  messagesBefore: IMessage[] | undefined;
}

const initialState: IMessageState = {
  messages: undefined,
  messagesBefore: undefined,
};

export const messagesSlice = createSlice({
  initialState,
  name: "@@messagesSlice",
  reducers: {
    actionClearMessages: () => initialState,
    actionAddMessages: (state, action) => {
      state.messages = action.payload;
    },
    actionAddMessagesLast: (state, action) => {
      state.messagesBefore = state.messagesBefore
        ? action.payload.concat(state.messagesBefore)
        : action.payload;
    },
  },
});

export const messagesReducer = messagesSlice.reducer;

export const { actionClearMessages, actionAddMessages, actionAddMessagesLast } =
  messagesSlice.actions;

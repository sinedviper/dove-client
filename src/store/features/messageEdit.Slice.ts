/* eslint-disable array-callback-return */
import { createSlice } from "@reduxjs/toolkit";

import { IMessage } from "interface";
import { RootState } from "store";

interface IMessageState {
  message: {
    message: IMessage | null;
    edit: boolean | null;
  };
}

const initialState: IMessageState = {
  message: {
    message: null,
    edit: null,
  },
};

export const messageEditSlice = createSlice({
  initialState,
  name: "@@messagesEditSlice",
  reducers: {
    actionClearMessageEdit: () => initialState,
    actionAddMessageEdit: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const messageEditReducer = messageEditSlice.reducer;

export const { actionClearMessageEdit, actionAddMessageEdit } =
  messageEditSlice.actions;

export const getMessageEdit = (state: RootState) => state.message;

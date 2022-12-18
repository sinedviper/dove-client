import { createSlice } from "@reduxjs/toolkit";

import { IMessage } from "utils/interface";

interface IMessageState {
  message: {
    message: IMessage | undefined;
    edit: boolean | undefined;
  };
}

const initialState: IMessageState = {
  message: {
    message: undefined,
    edit: undefined,
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

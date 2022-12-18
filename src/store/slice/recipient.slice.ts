import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "utils/interface";

interface IRecipientState {
  recipient: IUser | undefined;
}

const initialState: IRecipientState = {
  recipient: undefined,
};

export const recipientSlice = createSlice({
  initialState,
  name: "@@recipientSlice",
  reducers: {
    actionClearRecipient: () => initialState,
    actionAddRecipient: (state, action) => {
      state.recipient = action.payload;
    },
  },
});

export const recipientReducer = recipientSlice.reducer;

export const { actionClearRecipient, actionAddRecipient } =
  recipientSlice.actions;

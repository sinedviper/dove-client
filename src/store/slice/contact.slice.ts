import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "utils/interface";

interface IContactState {
  contacts: IUser[] | undefined;
}

const initialState: IContactState = {
  contacts: undefined,
};

export const contactsSlice = createSlice({
  initialState,
  name: "@@contactsSlice",
  reducers: {
    actionClearContact: () => initialState,
    actionAddContact: (state, action) => {
      state.contacts = action.payload;
    },
  },
});

export const contactReducer = contactsSlice.reducer;

export const { actionClearContact, actionAddContact } = contactsSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "interface";
import { RootState } from "store";

interface IContactState {
  contacts: IUser[] | null;
  status: string;
}

const initialState: IContactState = {
  contacts: null,
  status: "idle",
};

export const contactsSlice = createSlice({
  initialState,
  name: "contactsSlice",
  reducers: {
    actionClearContact: () => initialState,
    actionAddContact: (state, action) => {
      state.contacts = action.payload;
    },
  },
});

export const contactReducer = contactsSlice.reducer;

export const { actionClearContact, actionAddContact } = contactsSlice.actions;

export const getContacts = (state: RootState) => state.contacts.contacts;

import { RootState } from "store";

export const getContacts = (state: RootState) => state.contacts.contacts;

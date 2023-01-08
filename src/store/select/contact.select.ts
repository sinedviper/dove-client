import { RootState } from 'store'

export const getContacts = (state: RootState) => state.contacts.contacts
export const getContactUser = (state: RootState, action) =>
  state.contacts.contacts?.filter((contact) => contact.id === action)[0]

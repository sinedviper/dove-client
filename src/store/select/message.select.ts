import { RootState } from "store";

export const getMessages = (state: RootState) => state.messages.messages;
export const getMessagesBefore = (state: RootState) =>
  state.messages.messagesBefore;

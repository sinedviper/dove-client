import { RootState } from "store";

export const getRecipient = (state: RootState) => state.recipient.recipient;

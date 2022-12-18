import { RootState } from "store";

export const getChat = (state: RootState) => state.chats.chats;

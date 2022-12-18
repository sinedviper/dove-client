import { createSlice } from "@reduxjs/toolkit";

import { IChat } from "utils/interface";

interface IChatsState {
  chats: IChat[] | undefined;
}

const initialState: IChatsState = {
  chats: undefined,
};

export const chatsSlice = createSlice({
  initialState,
  name: "@@chatsSlice",
  reducers: {
    actionClearChats: () => initialState,
    actionAddChats: (state, action) => {
      state.chats = action.payload;
    },
    actionUpdateChatsMessage: (state, action) => {
      state.chats?.map((obj) => {
        if (obj.id === action.payload.id) {
          obj.lastMessage = action.payload.text;
        }
        return obj;
      });
    },
  },
});

export const chatsReducer = chatsSlice.reducer;

export const { actionClearChats, actionAddChats, actionUpdateChatsMessage } =
  chatsSlice.actions;

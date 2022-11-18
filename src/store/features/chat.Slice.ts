/* eslint-disable array-callback-return */
import { createSlice } from "@reduxjs/toolkit";

import { IChat } from "interface";
import { RootState } from "store";

interface IChatsState {
  chats: IChat[] | null;
}

const initialState: IChatsState = {
  chats: null,
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

export const getChat = (state: RootState) => state.chats.chats;

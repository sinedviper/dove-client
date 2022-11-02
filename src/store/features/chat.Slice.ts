import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "index";

import { IChatResponse } from "interface";
import { getChats } from "mutation";
import { RootState } from "store";

export const loadChats = createAsyncThunk("@@chats/load-chats", async () => {
  const data = await client
    .query({ query: getChats })
    .then((res) => res.data.getChats);
  return data;
});

interface IChatsState {
  chats: IChatResponse | null;
  status: string;
}

const initialState: IChatsState = {
  chats: null,
  status: "idle",
};

export const chatsSlice = createSlice({
  initialState,
  name: "chatsSlice",
  reducers: {
    actionClearChats: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadChats.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.status = "received";
        state.chats = action.payload as unknown as IChatResponse;
      });
  },
});

export const chatsReducer = chatsSlice.reducer;

export const { actionClearChats } = chatsSlice.actions;

export const getChat = (state: RootState) => state.chats.chats;

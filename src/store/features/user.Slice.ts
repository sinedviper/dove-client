import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "index";

import { IUserResponse } from "interface";
import { getMe } from "mutation";
import { RootState } from "store";

export const loadUser = createAsyncThunk("@@user/load-user", async () => {
  return await client.query({ query: getMe }).then((res) => res.data.getMe);
});

interface IUserState {
  user: IUserResponse | null;
  status: string;
}

const initialState: IUserState = {
  user: null,
  status: "idle",
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUser.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.status = "received";
        state.user = action.payload as unknown as IUserResponse;
      });
  },
});

export const userReducer = userSlice.reducer;

export const { logout } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

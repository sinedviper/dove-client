import { createSlice } from "@reduxjs/toolkit";

import { IUserResponse } from "interface";
import { RootState } from "store";

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
    actionUserAdd: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { logout, actionUserAdd } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "utils/interface";
import { RootState } from "store";

interface IUserState {
  user: IUser | undefined;
}

const initialState: IUserState = {
  user: undefined,
};

export const userSlice = createSlice({
  initialState,
  name: "@@userSlice",
  reducers: {
    actionClearUser: () => initialState,
    actionAddUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { actionClearUser, actionAddUser } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

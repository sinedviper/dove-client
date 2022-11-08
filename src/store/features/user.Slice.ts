import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "interface";
import { RootState } from "store";

interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    actionClearUser: () => initialState,
    actionUserAdd: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;

export const { actionClearUser, actionUserAdd } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;

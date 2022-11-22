import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface ICopyState {
  copy: boolean;
}

const initialState: ICopyState = {
  copy: false,
};

export const copySlice = createSlice({
  initialState,
  name: "@@copySlice",
  reducers: {
    actionClearCopy: () => initialState,
    actionAddCopy: (state, action) => {
      state.copy = action.payload;
    },
  },
});

export const copyReducer = copySlice.reducer;

export const { actionClearCopy, actionAddCopy } = copySlice.actions;

export const getCopy = (state: RootState) => state.copy.copy;

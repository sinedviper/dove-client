import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface IFetchState {
  fetch: boolean;
}

const initialState: IFetchState = {
  fetch: false,
};

export const fetchSlice = createSlice({
  initialState,
  name: "@@fetchSlice",
  reducers: {
    actionClearFetch: () => initialState,
    actionAddFetch: (state, action) => {
      state.fetch = action.payload;
    },
  },
});

export const fetchReducer = fetchSlice.reducer;

export const { actionClearFetch, actionAddFetch } = fetchSlice.actions;

export const getFetch = (state: RootState) => state.fetch.fetch;

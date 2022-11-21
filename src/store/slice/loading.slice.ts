import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface ILoadingState {
  loading: boolean;
}

const initialState: ILoadingState = {
  loading: false,
};

export const loadingSlice = createSlice({
  initialState,
  name: "@@loadingSlice",
  reducers: {
    actionClearLoading: () => initialState,
    actionAddLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const loadingReducer = loadingSlice.reducer;

export const { actionClearLoading, actionAddLoading } = loadingSlice.actions;

export const getLoading = (state: RootState) => state.loading.loading;

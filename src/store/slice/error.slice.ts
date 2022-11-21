import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface IErrorState {
  errors: string[];
}

const initialState: IErrorState = {
  errors: [],
};

export const errorsSlice = createSlice({
  initialState,
  name: "@@errorSlice",
  reducers: {
    actionClearError: () => initialState,
    actionAddError: (state, action) => {
      state.errors.push(action.payload);
    },
    actionDeleteError: (state, action) => {
      state.errors = state.errors.filter(
        (error, index) => index === action.payload
      );
    },
  },
});

export const errorsReducer = errorsSlice.reducer;

export const { actionClearError, actionAddError, actionDeleteError } =
  errorsSlice.actions;

export const getErrors = (state: RootState) => state.errors.errors;

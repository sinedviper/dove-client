import { createSlice } from "@reduxjs/toolkit";

import { IUser } from "interface";
import { RootState } from "store";

interface IReceiptState {
  receipt: IUser | null;
}

const initialState: IReceiptState = {
  receipt: null,
};

export const receiptSlice = createSlice({
  initialState,
  name: "@@receiptSlice",
  reducers: {
    actionClearReceipt: () => initialState,
    actionAddReceipt: (state, action) => {
      state.receipt = action.payload;
    },
  },
});

export const receiptReducer = receiptSlice.reducer;

export const { actionClearReceipt, actionAddReceipt } = receiptSlice.actions;

export const getReceipt = (state: RootState) => state.receipt.receipt;

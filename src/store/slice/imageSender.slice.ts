import { createSlice } from "@reduxjs/toolkit";

import { IImage } from "utils/interface";
import { RootState } from "store";

interface IImagesState {
  images: IImage | undefined;
}

const initialState: IImagesState = {
  images: undefined,
};

export const imageSenderSlice = createSlice({
  initialState,
  name: "@@imageSenderSlice",
  reducers: {
    actionClearImageSender: () => initialState,
    actionAddImageSender: (state, action) => {
      state.images = action.payload;
    },
  },
});

export const imageSenderReducer = imageSenderSlice.reducer;

export const { actionClearImageSender, actionAddImageSender } =
  imageSenderSlice.actions;

export const getImageSender = (state: RootState) => state.imageSender.images;

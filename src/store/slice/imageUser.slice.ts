import { createSlice } from "@reduxjs/toolkit";

import { IImage } from "utils/interface";
import { RootState } from "store";

interface IImagesState {
  images: IImage[] | undefined;
}

const initialState: IImagesState = {
  images: undefined,
};

export const imageUserSlice = createSlice({
  initialState,
  name: "@@imageUserSlice",
  reducers: {
    actionClearImageUser: () => initialState,
    actionAddImageUser: (state, action) => {
      state.images = action.payload;
    },
  },
});

export const iamgeUserReducer = imageUserSlice.reducer;

export const { actionClearImageUser, actionAddImageUser } =
  imageUserSlice.actions;

export const getImageUser = (state: RootState) => state.imageUser.images;

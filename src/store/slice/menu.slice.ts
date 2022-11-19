import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface IMenuState {
  setting: boolean;
  contact: boolean;
  edit: boolean;
}

const initialState: IMenuState = {
  setting: false,
  contact: false,
  edit: false,
};

export const menuSlice = createSlice({
  initialState,
  name: "@@menuSlice",
  reducers: {
    actionMenuClear: () => initialState,
    actionMenuContact: (state, action) => {
      state.contact = action.payload;
    },
    actionMenuSetting: (state, action) => {
      state.setting = action.payload;
    },
    actionMenuEdit: (state, action) => {
      state.edit = action.payload;
    },
  },
});

export const menuReducer = menuSlice.reducer;

export const {
  actionMenuClear,
  actionMenuContact,
  actionMenuSetting,
  actionMenuEdit,
} = menuSlice.actions;

export const getMenuSetting = (state: RootState) => state.menu.setting;
export const getMenuContact = (state: RootState) => state.menu.contact;
export const getMenuEdit = (state: RootState) => state.menu.edit;

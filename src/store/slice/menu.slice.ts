import { createSlice } from "@reduxjs/toolkit";

interface IMenuState {
  setting: boolean;
  contact: boolean;
  edit: boolean;
  main: boolean;
  bugs: boolean;
  menuMessage: number | null;
  haveMessage: Date | null;
}

const initialState: IMenuState = {
  setting: false,
  contact: false,
  edit: false,
  main: false,
  bugs: false,
  menuMessage: null,
  haveMessage: null,
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
    actionMenuMain: (state, action) => {
      state.main = action.payload;
    },
    actionMenuBugs: (state, action) => {
      state.bugs = action.payload;
    },
    actionMenuMessage: (state, action) => {
      state.menuMessage = action.payload;
    },
    actionHaveMessage: (state, action) => {
      state.haveMessage = action.payload;
    },
  },
});

export const menuReducer = menuSlice.reducer;

export const {
  actionMenuClear,
  actionMenuContact,
  actionMenuSetting,
  actionMenuEdit,
  actionMenuMain,
  actionMenuBugs,
  actionMenuMessage,
  actionHaveMessage,
} = menuSlice.actions;

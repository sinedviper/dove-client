import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "store";

interface ITabIndexGroupeState {
  tabIndexGroupe: {
    tabIndexFirst: number;
    tabIndexSecond: number;
    tabIndexThree: number;
    tabIndexFourth: number;
    tabIndexFiveth: number;
    tabIndexSixth: number;
    tabIndexSeventh: number;
    tabIndexEighth: number;
  };
}

const initialState: ITabIndexGroupeState = {
  tabIndexGroupe: {
    tabIndexFirst: 0,
    tabIndexSecond: -1,
    tabIndexThree: -1,
    tabIndexFourth: -1,
    tabIndexFiveth: -1,
    tabIndexSixth: 0,
    tabIndexSeventh: -1,
    tabIndexEighth: -1,
  },
};

export const tabIndexGroupeSlice = createSlice({
  initialState,
  name: "@@tabIndexGroupeSlice",
  reducers: {
    actionClearTabIndexGroupe: () => initialState,
    actionAddTabIndexFirst: (state, action) => {
      state.tabIndexGroupe.tabIndexFirst = action.payload;
    },
    actionAddTabIndexSecond: (state, action) => {
      state.tabIndexGroupe.tabIndexSecond = action.payload;
    },
    actionAddTabIndexThree: (state, action) => {
      state.tabIndexGroupe.tabIndexThree = action.payload;
    },
    actionAddTabIndexFourth: (state, action) => {
      state.tabIndexGroupe.tabIndexFourth = action.payload;
    },
    actionAddTabIndexFiveth: (state, action) => {
      state.tabIndexGroupe.tabIndexFiveth = action.payload;
    },
    actionAddTabIndexSixth: (state, action) => {
      state.tabIndexGroupe.tabIndexSixth = action.payload;
    },
    actionAddTabIndexSeventh: (state, action) => {
      state.tabIndexGroupe.tabIndexSeventh = action.payload;
    },
    actionAddTabIndexEighth: (state, action) => {
      state.tabIndexGroupe.tabIndexEighth = action.payload;
    },
  },
});

export const tabIndexGroupeReducer = tabIndexGroupeSlice.reducer;

export const {
  actionClearTabIndexGroupe,
  actionAddTabIndexFirst,
  actionAddTabIndexSecond,
  actionAddTabIndexThree,
  actionAddTabIndexFourth,
  actionAddTabIndexFiveth,
  actionAddTabIndexSixth,
  actionAddTabIndexSeventh,
  actionAddTabIndexEighth,
} = tabIndexGroupeSlice.actions;

export const getTabIndexFirst = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexFirst;
export const getTabIndexSecond = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexSecond;
export const getTabIndexThree = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexThree;
export const getTabIndexFourth = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexFourth;
export const getTabIndexFiveth = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexFiveth;
export const getTabIndexSixth = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexSixth;
export const getTabIndexSeventh = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexSeventh;
export const getTabIndexEighth = (state: RootState) =>
  state.tabIndexGroupe.tabIndexGroupe.tabIndexEighth;

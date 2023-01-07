import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

interface ITabIndexGroupeState {
  tabIndexGroupe: {
    tabIndexFirst: number
    tabIndexSecond: number
    tabIndexThree: number
    tabIndexFourth: number
    tabIndexFiveth: number
    tabIndexSixth: number
    tabIndexSeventh: number
    tabIndexEighth: number
  }
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
}

export const tabIndexGroupeSlice = createSlice({
  initialState,
  name: '@@tabIndexGroupeSlice',
  reducers: {
    actionClearTabIndexGroupe: () => initialState,
    actionAddTabIndexFirst: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexFirst = action.payload
    },
    actionAddTabIndexSecond: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexSecond = action.payload
    },
    actionAddTabIndexThree: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexThree = action.payload
    },
    actionAddTabIndexFourth: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexFourth = action.payload
    },
    actionAddTabIndexFiveth: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexFiveth = action.payload
    },
    actionAddTabIndexSixth: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexSixth = action.payload
    },
    actionAddTabIndexSeventh: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexSeventh = action.payload
    },
    actionAddTabIndexEighth: (
      state: Draft<ITabIndexGroupeState>,
      action: PayloadAction<1 | 0 | -1>,
    ) => {
      state.tabIndexGroupe.tabIndexEighth = action.payload
    },
  },
})

export const tabIndexGroupeReducer = tabIndexGroupeSlice.reducer

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
} = tabIndexGroupeSlice.actions

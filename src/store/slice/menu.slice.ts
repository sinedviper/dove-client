import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

interface IMenuState {
  setting: boolean
  contact: boolean
  edit: boolean
  main: boolean
  bugs: boolean
  menuMessage: number | null
  haveMessage: Date | null
}

const initialState: IMenuState = {
  setting: false,
  contact: false,
  edit: false,
  main: false,
  bugs: false,
  menuMessage: null,
  haveMessage: null,
}

export const menuSlice = createSlice({
  initialState,
  name: '@@menuSlice',
  reducers: {
    actionMenuContact: (state: Draft<IMenuState>, action: PayloadAction<boolean>) => {
      state.contact = action.payload
    },
    actionMenuSetting: (state: Draft<IMenuState>, action: PayloadAction<boolean>) => {
      state.setting = action.payload
    },
    actionMenuEdit: (state: Draft<IMenuState>, action: PayloadAction<boolean>) => {
      state.edit = action.payload
    },
    actionMenuMain: (state: Draft<IMenuState>, action: PayloadAction<boolean>) => {
      state.main = action.payload
    },
    actionMenuBugs: (state: Draft<IMenuState>, action: PayloadAction<boolean>) => {
      state.bugs = action.payload
    },
    actionMenuMessage: (state: Draft<IMenuState>, action: PayloadAction<number | null>) => {
      state.menuMessage = action.payload
    },
    actionHaveMessage: (state: Draft<IMenuState>, action: PayloadAction<Date>) => {
      state.haveMessage = action.payload
    },
  },
})

export const menuReducer = menuSlice.reducer

export const {
  actionMenuContact,
  actionMenuSetting,
  actionMenuEdit,
  actionMenuMain,
  actionMenuBugs,
  actionMenuMessage,
  actionHaveMessage,
} = menuSlice.actions

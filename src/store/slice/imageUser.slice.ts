import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

import { IImage } from 'utils/interface'

interface IImagesState {
  images: IImage[] | undefined
}

const initialState: IImagesState = {
  images: undefined,
}

export const imageUserSlice = createSlice({
  initialState,
  name: '@@imageUserSlice',
  reducers: {
    actionAddImageUser: (state: Draft<IImagesState>, action: PayloadAction<IImage[]>) => {
      state.images = action.payload
    },
  },
})

export const imageUserReducer = imageUserSlice.reducer

export const { actionAddImageUser } = imageUserSlice.actions

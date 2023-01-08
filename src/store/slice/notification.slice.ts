import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

interface error {
  text: string
  id: string
}

interface INotificationState {
  loading: boolean
  fetch: boolean
  errors: error[]
  copy: boolean
}

const initialState: INotificationState = {
  loading: false,
  fetch: false,
  errors: [],
  copy: false,
}

export const notificationSlice = createSlice({
  initialState,
  name: '@@notificationSlice',
  reducers: {
    actionClearNotification: () => initialState,
    actionAddLoading: (state: Draft<INotificationState>, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    actionAddCopy: (state: Draft<INotificationState>, action: PayloadAction<boolean>) => {
      state.copy = action.payload
    },
    actionAddFetch: (state: Draft<INotificationState>, action: PayloadAction<boolean>) => {
      state.fetch = action.payload
    },
    actionAddError: (state: Draft<INotificationState>, action: PayloadAction<error>) => {
      state.errors.push(action.payload)
    },
    actionDeleteError: (state: Draft<INotificationState>, action: PayloadAction<string>) => {
      state.errors = state.errors.filter((error) => String(error.id) !== String(action.payload))
    },
  },
})

export const notificationReducer = notificationSlice.reducer

export const {
  actionClearNotification,
  actionAddFetch,
  actionAddLoading,
  actionAddError,
  actionDeleteError,
  actionAddCopy,
} = notificationSlice.actions

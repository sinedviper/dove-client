import { tabIndexGroupeReducer } from './slice/tabIndexGroupe.slice'
import { Action, configureStore, ThunkAction, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import {
  chatsReducer,
  contactReducer,
  messageEditReducer,
  messagesReducer,
  userReducer,
  recipientReducer,
  menuReducer,
  imageUserReducer,
} from './slice'
import { notificationReducer } from './slice/notification.slice'

const reducer = combineReducers({
  user: userReducer,
  contacts: contactReducer,
  chats: chatsReducer,
  messages: messagesReducer,
  message: messageEditReducer,
  recipient: recipientReducer,
  menu: menuReducer,
  notification: notificationReducer,
  imageUser: imageUserReducer,
  tabIndexGroupe: tabIndexGroupeReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'errors',
    'loading',
    'copy',
    'menu',
    'message',
    'tabIndexGroupe',
    'fetch',
    'imageSender',
    'imageContact',
  ],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

import {
  Action,
  configureStore,
  ThunkAction,
  combineReducers,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import {
  chatsReducer,
  contactReducer,
  messageEditReducer,
  messagesReducer,
  userReducer,
  recipientReducer,
  menuReducer,
  loadingReducer,
  errorsReducer,
  copyReducer,
  iamgeUserReducer,
  fetchReducer,
  imageSenderReducer,
} from "./slice";

const reducer = combineReducers({
  user: userReducer,
  contacts: contactReducer,
  chats: chatsReducer,
  messages: messagesReducer,
  message: messageEditReducer,
  recipient: recipientReducer,
  menu: menuReducer,
  loading: loadingReducer,
  errors: errorsReducer,
  copy: copyReducer,
  imageUser: iamgeUserReducer,
  fetch: fetchReducer,
  imageSender: imageSenderReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["errors", "loading", "copy", "menu", "message"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

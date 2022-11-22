/* eslint-disable react-hooks/rules-of-hooks */
import {
  actionClearChats,
  actionClearContact,
  actionClearError,
  actionClearLoading,
  actionClearMessageEdit,
  actionClearMessages,
  actionClearRecipient,
  actionClearUser,
} from "store";
import { theme, animation } from "utils/context";

export const outLogin = (dispatch, themeChange): void => {
  localStorage.removeItem("token");

  dispatch(actionClearUser());
  dispatch(actionClearChats());
  dispatch(actionClearContact());
  dispatch(actionClearMessages());
  dispatch(actionClearMessageEdit());
  dispatch(actionClearRecipient());
  dispatch(actionClearLoading());
  dispatch(actionClearError());

  themeChange?.changeTheme(theme.THEME_LIGHT);
  themeChange?.changeAnimation(animation.ANIMATION_ON);
};

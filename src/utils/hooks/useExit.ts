import { useAppDispatch } from "utils/hooks";
import { theme, animation, useTheme } from "utils/context";
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

export const useExit = () => {
  const dispatch = useAppDispatch();
  const themeChange = useTheme();

  return (): void => {
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
};

import { useAppDispatch } from "utils/hooks";
import { theme, animation, useTheme } from "utils/context";
import {
  actionClearChats,
  actionClearContact,
  actionClearNotification,
  actionClearMessageEdit,
  actionClearMessages,
  actionClearRecipient,
  actionClearUser,
} from "store";

//that hook for clere store and delete token when user exit
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
    dispatch(actionClearNotification());

    themeChange?.changeTheme(theme.THEME_LIGHT);
    themeChange?.changeAnimation(animation.ANIMATION_ON);
  };
};

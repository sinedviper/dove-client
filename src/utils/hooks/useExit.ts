import { useAppDispatch } from "utils/hooks";
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

  return (): void => {
    localStorage.removeItem("token");

    dispatch(actionClearNotification());
    dispatch(actionClearUser());
    dispatch(actionClearChats());
    dispatch(actionClearContact());
    dispatch(actionClearMessages());
    dispatch(actionClearMessageEdit());
    dispatch(actionClearRecipient());
  };
};

import { v4 as uuidv4 } from "uuid";

import { actionAddError, actionAddFetch, actionDeleteError } from "store";
import { useAppDispatch, useDebounce } from "utils/hooks";

export function useError() {
  const dispatch = useAppDispatch();
  const debouncedError = useDebounce((id, dispatch) => {
    dispatch(actionDeleteError(id));
  }, 3000);

  return function (text): void {
    const id = uuidv4();
    if (text === "Failed to fetch") {
      dispatch(actionAddFetch(true));
    } else {
      dispatch(actionAddError({ id, text }));
      debouncedError(id, dispatch);
      dispatch(actionAddFetch(false));
    }
  };
}

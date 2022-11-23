import { useNavigate } from "react-router-dom";
import { useAppDispatch, useExit } from "utils/hooks";
import { actionAddError } from "store";

interface check {
  data: any;
  actionAdd: Function;
}

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exit = useExit();

  return ({ data, actionAdd }: check): void => {
    if (data) {
      if (data.status === "Invalid") {
        if (data.code === 401) {
          exit();
          navigate("/login");
        }
        dispatch(actionAddError(data.message));
      }
      if (data.status === "Success") {
        data.code === 200 && dispatch(actionAdd(data.data));
        data.code === 201 && dispatch(actionAdd(data.data));
      }
    }
  };
};

export const useAuthorizationSearch = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exit = useExit();

  return ({ data }: Omit<check, "actionAdd">) => {
    if (data) {
      if (data.status === "Invalid") {
        if (data.code === 401) {
          exit();
          navigate("/login");
        }
        dispatch(actionAddError(data.message));
      }
      if (data.status === "Success") {
        return data.data;
      }
    }
  };
};

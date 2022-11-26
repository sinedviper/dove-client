import { useNavigate } from "react-router-dom";
import { useAppDispatch, useError, useExit } from "utils/hooks";

interface check {
  data: any;
  actionAdd: Function;
}

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exit = useExit();
  const error = useError();

  return ({ data, actionAdd }: check): void => {
    if (data) {
      if (data.status === "Invalid") {
        if (data.code === 401) {
          exit();
          navigate("/login");
        }
        error(data.message);
      }
      if (data.status === "Success") {
        data.code === 200 && dispatch(actionAdd(data.data));
        data.code === 201 && dispatch(actionAdd(data.data));
      }
    }
  };
};

export const useAuthorizationSearch = () => {
  const navigate = useNavigate();
  const exit = useExit();
  const error = useError();

  return ({ data }: Omit<check, "actionAdd">) => {
    if (data) {
      if (data.status === "Invalid") {
        if (data.code === 401) {
          exit();
          navigate("/login");
        }
        error(data.message);
      }
      if (data.status === "Success") {
        return data.data;
      }
    }
  };
};

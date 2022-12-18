import { useNavigate } from "react-router-dom";
import { useAppDispatch, useError, useExit } from "utils/hooks";

interface check {
  data: any;
  actionAdd: Function;
}

//check user token for autorization in system and dispatch data in store
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

//that hook check also token and return data
export const useAuthorizationData = () => {
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

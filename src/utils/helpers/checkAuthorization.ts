import { actionAddError } from "store";
import { outLogin } from "utils/helpers";

interface check {
  dispatch: Function;
  navigate: Function;
  data: any;
  actionAdd: Function;
  themeChange: any;
}

export const checkAuthorization = ({
  dispatch,
  navigate,
  data,
  actionAdd,
  themeChange,
}: check) => {
  if (data) {
    if (data.status === "Invalid") {
      if (data.code === 401) {
        outLogin(dispatch, themeChange);
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

export const checkAuthorizationSearch = ({
  dispatch,
  navigate,
  data,
  themeChange,
}: Omit<check, "actionAdd">) => {
  if (data) {
    if (data.status === "Invalid") {
      if (data.code === 401) {
        outLogin(dispatch, themeChange);
        navigate("/login");
      }
      dispatch(actionAddError(data.message));
    }
    if (data.status === "Success") {
      return data.data;
    }
  }
};

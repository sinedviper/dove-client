import { toast } from "react-toastify";

import { outLogin } from "helpers";

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
  if (data.status === "Invalid") {
    if (data.code === 401) {
      outLogin(dispatch, themeChange);
      navigate("/login");
    }
    toast.error(data.message);
  }
  if (data.status === "Success") {
    dispatch(actionAdd(data.data));
  }
};

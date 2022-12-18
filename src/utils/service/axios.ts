import axios from "axios";

import { SERVER_LINK } from "utils/constants";

export const axiosSet = axios.create({
  baseURL: SERVER_LINK,
  headers: {
    Authorization: window.localStorage.getItem("token"),
    "Content-Type": "multipart/form-data",
  },
});

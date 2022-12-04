import axios from "axios";

import { SERVER_LINK } from "utils/constants";

const instance = axios.create({
  baseURL: SERVER_LINK,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  config.headers["Access-Control-Allow-Origin"] = "*";
  config.headers["Access-Control-Allow-Headers"] = "*";
  return config;
});

export default instance;

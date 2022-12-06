import axios from "axios";

import { SERVER_LINK } from "utils/constants";

const instance = axios.create({
  baseURL: SERVER_LINK,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default instance;

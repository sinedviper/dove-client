import React from "react";
import { Navigate } from "react-router-dom";

import { Login } from "pages-components";

export const LoginPage = (): JSX.Element => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <Login />
    </>
  );
};

import React from "react";
import { Navigate } from "react-router-dom";

import { SignUp } from "pages-components";

export const SignUpPage = (): JSX.Element => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <SignUp />
    </>
  );
};

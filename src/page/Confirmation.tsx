import React from "react";
import { Navigate } from "react-router-dom";

import { Confirmation } from "pages-components";

export const ConfirmationPage = (): JSX.Element => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Confirmation />
    </>
  );
};

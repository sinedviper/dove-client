import React from "react";
import { Navigate } from "react-router-dom";

import { Bugs } from "pages-components";

export const BugsPage = (): JSX.Element => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Bugs />
    </>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import cn from "classnames";

import { LayoutProps } from "./Layout.props";

import styles from "./Layout.module.css";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "hooks";
import { getUser } from "store";

export const Layout = ({ className, ...props }: LayoutProps): JSX.Element => {
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user != null) {
      navigate(`${user.data.username}`);
    }
  }, [user]);

  if (!token) {
    return <Navigate to='login' />;
  }

  return (
    <main className={cn(className, styles.main)} {...props}>
      <Outlet />
    </main>
  );
};

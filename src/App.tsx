import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { LoginPage, SignUpPage } from "page";
import { Notification } from "components";
import { Home, Layout } from "pages-components";
import { IUser } from "utils/interface";
import { useAppSelector } from "utils/hooks";
import { getUser } from "store";

function App(): JSX.Element {
  const user: IUser | undefined = useAppSelector(getUser);

  return (
    <>
      {!user && (
        <Notification
          style={{
            bottom: "auto",
            top: "40px",
            right: "50%",
            left: "50%",
            position: "fixed",
            maxWidth: "280px",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path=':username' element={<Home />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sigup' element={<SignUpPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

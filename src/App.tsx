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
            top: "75px",
            right: "75px",
            left: "auto",
            position: "fixed",
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

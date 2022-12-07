import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ConfirmationPage, LoginPage, SignUpPage } from "page";
import { Notification } from "components";
import { SideRight, SideLeft } from "pages-components";
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
            bottom: "40px",
            right: "50%",
            left: "50%",
            position: "fixed",
            maxWidth: "350px",
            transform: "translate(-50%, 0)",
          }}
        />
      )}

      <Router>
        <Routes>
          <Route path='/' element={<SideLeft />}>
            <Route path=':username' element={<SideRight />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sigup' element={<SignUpPage />} />
          <Route path='/confirmation' element={<ConfirmationPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

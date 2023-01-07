import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactGA from "react-ga";

import { BugsPage, ConfirmationPage, LoginPage, SignUpPage } from "page";
import { Notification } from "components";
import { SideRight, SideLeft } from "pages-components";
import { IUser } from "utils/interface";
import { useAppSelector } from "utils/hooks";
import { getMenuBugs, getUser } from "store/select";
import { TRACKING_ID } from "utils/constants";

ReactGA.initialize(TRACKING_ID);

function App(): JSX.Element {
  const user: IUser | undefined = useAppSelector(getUser);
  const bugs = useAppSelector(getMenuBugs);

  return (
    <>
      {bugs ? (
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
      ) : (
        !user && (
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
        )
      )}
      <Router>
        <Routes>
          <Route path='/' element={<SideLeft />}>
            <Route path=':username' element={<SideRight />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/confirmation' element={<ConfirmationPage />} />
          <Route path='/bugs' element={<BugsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

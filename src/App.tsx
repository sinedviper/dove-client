import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { LoginPage, SignUpPage } from "page";
import { Home, Layout } from "pages-components";

import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "utils/hooks";
import { getUser } from "store";
import { IUser } from "utils/interface";

function App(): JSX.Element {
  const user: IUser | undefined = useAppSelector(getUser);

  return (
    <>
      <ToastContainer
        autoClose={1300}
        pauseOnFocusLoss
        newestOnTop
        draggable
        hideProgressBar={false}
        closeOnClick={false}
        theme={user?.theme ? "dark" : "light"}
      />
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

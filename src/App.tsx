import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { LoginPage, SignUpPage } from "page";
import { Home, Layout } from "pages-components";

import "react-toastify/dist/ReactToastify.css";

function App(): JSX.Element {
  return (
    <>
      <ToastContainer
        autoClose={1200}
        pauseOnFocusLoss
        newestOnTop
        draggable
        hideProgressBar={false}
        closeOnClick={false}
      />
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index path=':username' element={<Home />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sigup' element={<SignUpPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

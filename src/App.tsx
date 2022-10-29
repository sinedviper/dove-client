import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { LoginPage, SignUpPage } from "page";
import { Home, Layout } from "pages-components";

function App(): JSX.Element {
  return (
    <>
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

import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './scss/style.scss';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/user/Login'));
const ForgotPswd = React.lazy(() => import('./views/user/ForgotPswd'));
const ChangePswd = React.lazy(() => import('./views/user/ChangePswd'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/" name="Login Page" element={<Login />} />
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/forgotPswd" name="ForgotPswd Page" element={<ForgotPswd />} />
            <Route exact path="/changePswd" name="ChangePswd Page" element={<ChangePswd />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;

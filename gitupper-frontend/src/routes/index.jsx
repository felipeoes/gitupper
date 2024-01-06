/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/index.js";

import { paths } from "../services/utils/paths";

//rotas não-autenticadas
import Login from "../views/non-auth/login/Login";
// import Logout from "../views/non-auth/logout/logout";
import Signup from "../views/non-auth/signup/Signup";

//rotas autenticadas
import HomePage from "../views/auth/homepage/HomePage";
import Bind from "./../views/auth/bind/Bind";
import Navbar from "../components/sidebar/Sidebar";
import NotFound from "./../views/non-auth/not-found/NotFound";

// rotas de settings
import SettingsPage from "../views/auth/settingsPage/SettingsPage";
import ResetPassword from "./../views/non-auth/reset-password/ResetPassword";
import Repositories from "../views/auth/repositories/Repositories";

const AppRoutes = (props) => {
  const { state } = useContext(AuthContext);

  function RequireAuth({ children, redirectTo }) {
    let isAuthenticated = state.user;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  }

  const sidebarRoutes = [
    {
      path: paths.homepage,
      RenderPage: HomePage,
    },
    // {
    //   path: "/user-profile/*",
    //   custom: (
    //     <RequireAuth redirectTo="/login">
    //       <UserContentWrapper>
    //         <UserProfile shouldHideNavbar={(res) => shouldHideNavbar(res)} />
    //         <Routes>
    //           <Route path="/details" element={<UserDetails />} />
    //         </Routes>
    //       </UserContentWrapper>
    //     </RequireAuth>
    //   ),
    //   RenderPage: UserProfile,
    // },
    {
      path: paths.repositories,
      RenderPage: Repositories,
    },
    {
      path: "/settings",
      RenderPage: SettingsPage,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.signup} element={<Signup />} />
        <Route path={paths.resetPassword} element={<ResetPassword />} />

        <Route
          path="*"
          element={
            <>
              <RequireAuth redirectTo={paths.login}>
                <Routes>
                  <Route path="*" element={<NotFound />} />
                  <Route path={paths.bind} element={<Bind />} />
                  <Route path="/" element={<Navigate to={paths.homepage} />} />

                  {sidebarRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.custom ? (
                          route.Custom
                        ) : (
                          <Navbar RenderPage={route.RenderPage} />
                        )
                      }
                    />
                  ))}
                </Routes>
              </RequireAuth>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

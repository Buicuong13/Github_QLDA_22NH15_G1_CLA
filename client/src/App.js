import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes/index'
import MainLayout from './layouts/MainLayout'
import DefaultLayout from './layouts/DefaultLayout'
import CreateAccountLayout from './layouts/CreateAccountLayout'
import UpgradeLayout from './layouts/UpgradeLayout'
import * as userService from './services/userService';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { authAccount } from './redux/actions/auth';
import { useSelector } from "react-redux";
import ProctectRoute from './proctect_route'

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const res = await userService.getRoleId();
          dispatch(authAccount(res.roleId));
        } catch (error) {
          console.error(error);
        }
      };
    }
    fetchData();
  }, [dispatch, isAuthenticated]);
  return (
    <Router>
      <div className="App">
        <Routes>
          {
            routes.map((route, index) => {
              let Layout = DefaultLayout;
              if (route.layout === 'undefined') {
                Layout = UpgradeLayout;
              }
              else if (route.layout === null) {
                Layout = CreateAccountLayout;
              }
              else if (route.layout) {
                Layout = MainLayout;
              }
              let Page = route.component;
              let path = route.path;
              return <Route key={index} path={path}
                element={
                  <ProctectRoute isPrivate={route.isPrivate} adminRoute={route.permission}>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProctectRoute>
                } />
            })
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;

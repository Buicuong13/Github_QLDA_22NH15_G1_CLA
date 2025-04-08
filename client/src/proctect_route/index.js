import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
function ProctectRoute({ children, isPrivate, adminRoute }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const roleId = useSelector((state) => state.auth.roleId);

  if (adminRoute) {
    if (isAuthenticated) {
      if (roleId) {
        if (roleId !== 1) {
          return <Navigate to="/home" />;
        }
        return children;
      }
    }
    else {
      return <Navigate to="/" />;
    }
  }

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default ProctectRoute;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function AuthProtectionRoutes({ element: Component, userRole, ...rest }) {
  const { isAuthenticated, role } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    } else if (role !== userRole) {
        
      const redirectPath = location.state?.from || -1;
      navigate(redirectPath, { state: { error: "Unauthorized access" } });
    }
  }, [isAuthenticated, role, userRole, navigate, location.pathname, location.state]);

  if (isAuthenticated && role === userRole) {
    return <Component {...rest} />;
  }

  return null;
}

export default AuthProtectionRoutes;

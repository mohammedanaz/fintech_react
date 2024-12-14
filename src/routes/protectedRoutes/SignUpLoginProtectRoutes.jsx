import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SignUpLoginProtectRoutes({ element: Component, ...rest }) {
  const { isAuthenticated, role } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home")
    }
  });

  if (!isAuthenticated) {
    return <Component {...rest} />;
  }

  return null;
}

export default SignUpLoginProtectRoutes;
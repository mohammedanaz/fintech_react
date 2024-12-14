import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function HomeRoutes() {
  const { isAuthenticated, role } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {

      //const redirectPath = location.state?.from || "/";

      if (role === "individual") {
        navigate("/individualHome");
      } else if (role === "corporate") {
        navigate("/corporateHome");
      } else {
        navigate("/");
      }
    }
  });

  if (!isAuthenticated) {
    navigate("/login");
  }

  return null;
}

export default HomeRoutes;
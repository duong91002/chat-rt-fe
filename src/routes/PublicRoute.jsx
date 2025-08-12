import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import useAuthStore from "../store/authStore";

const PublicRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { getInformation } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const user = await getInformation();
      if (user) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [getInformation]);

  if (loading) return null;
  return authorized ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;

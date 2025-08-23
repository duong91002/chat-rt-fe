import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import useAuthStore from "../store/authStore";
import useNotification from "../hooks/useNotification";
const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { getInformation } = useAuthStore();
  const finishAuth = (isAuthorized) => {
    setAuthorized(isAuthorized);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        return finishAuth(false);
      }

      const { user } = await getInformation();
      finishAuth(!!user);
      if (!!user) {
        useNotification();
      }
    };

    checkAuth();
  }, [getInformation]);

  if (loading) return null;
  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

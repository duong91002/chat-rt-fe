import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import useAuthStore from "../store/authStore";
import useNotification from "../hooks/useNotification";

const ProtectedRoute = () => {
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
    useNotification();
  }, [getInformation]);

  if (loading) return null;
  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

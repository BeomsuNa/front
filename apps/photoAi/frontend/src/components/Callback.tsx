import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth.store";

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
    localStorage.setItem("token", token);
    useAuth.getState().setToken(token);
    navigate("/");
    }
    console.log('카카오 로그인 성공')
  }, [location, navigate]);

};

export default OAuthCallback;

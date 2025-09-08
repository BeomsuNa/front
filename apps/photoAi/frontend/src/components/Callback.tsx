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

    }
    console.log('카카오 로그인 성공')
  }, [location, navigate]);

  return <div>로그인 처리중...</div>;
};

export default OAuthCallback;

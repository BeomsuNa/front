import {axios} from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import useAuth from '../../../frontend/src/state/';
import { useEffect } from 'react';
  
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const OauthGoogle = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      onSuccess: async (tokenResponse) => {
      const res = await axios
      .post("/api/auth/google", {
      access_token: tokenResponse.access_token,
      })
    const { token, user } = res.data;
      localStorage.setItem('token',token)
      useAuth.getState().setUser(user)
      useAuth.getState().setToken(token)
      navigate('/');
      },
      onError: () => {
        console.log('로그인 실패');
        alert("구글 로그인 실패");
      },
      })


export default OauthGoogle;
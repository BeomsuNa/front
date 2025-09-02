import { useAuth } from '@/state/auth.store';
import { LoginButton } from '@comp/ui';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const navigate = useNavigate();
      const OauthGoogle = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        onSuccess: async (tokenResponse) => {
          console.log('보낼 액세스토큰 :', tokenResponse.access_token)
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

      useEffect(() => {
        const initAuth = async() => {
          console.log('현재상태는? :', useAuth.getState());
          const token = localStorage.getItem('token');
          if (!token) return;
          try {
            const res = await axios.get('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
           useAuth.getState().setUser(res.data.user);
           useAuth.getState().setToken(token);
           console.log('토큰 유지 성공')
          } catch (error) {
            console.error(error);
          }
        }
        initAuth();
      }, [])
  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="w-80 p-8 rounded-lg shadow-lg bg-white flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이메일"
            className="px-4 py-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            id='password'
            type="password"
            placeholder="비밀번호"
            className="px-4 py-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
                    <span className="flex gap-2 text-sm text-gray-600">아직 아이디가 없으신가요?
                      <nav>
                      <Link to='/signup' className='text-blue-500 hover:underline'>회원가입</Link>
                    </nav>
                    </span>
          <button
            type="submit"
            className="py-3 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition"
          >
            로그인
          </button>
            <button
            type="button"
            className="py-3 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition"
            onClick={() => OauthGoogle()}
          >
            Google
          </button>
            <button
            type="submit"
            className="py-3 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition"
          >
            KAKAO
          </button>
            <button
            type="submit"
            className="py-3 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition"
          >
            GITHUB
          </button>
          <LoginButton text="Login" startColor='red' endColor='red'></LoginButton>

        </form>
      </div>
    </div>
  )
}

export default LoginPage;

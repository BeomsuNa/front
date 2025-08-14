import EmailInputWithDomain from "@/components/EmailInputWithDomain";
import { useAuth } from "@/state/auth.store";
import axios from "axios";
import React, { useEffect, useMemo,  useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";



const PASSWORD_RE =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/; // 영문+숫자+특수문자, 8~20자

export default function Signup() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');   
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState("");            // 이름
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const passValid = useMemo(() => PASSWORD_RE.test(password), [password]);
  const passMatch = useMemo(() => password.length > 0 && password === confirm, [password, confirm]);
  const setToken = useAuth((s) => s.setToken);
  const navigate = useNavigate()

    useEffect(() => {
    if (token) {
      setIsVerified(true);
      // zustand에 토큰 저장 등 추가 로직
      setToken(token);
    }
  }, [token]);

  const canSubmit =
    email.trim().length > 0 &&
    name.trim().length > 0 &&
    passValid &&
    passMatch 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await axios.post("/auth/signup", {
        email,
        name,
        password
      })
      if (res.status === 200) {
        alert("회원가입 성공!");
        navigate('/login'); 
      }
    } catch (err: any) {
      alert(err?.message || "에러가 발생했습니다.");
    }
  }

async function sendMagicLink() {
  try {
    await axios.post('/api/auth/magic-link', {email})
      setMsg('메일을 확인하세요.');
  }catch (err :any) {
      setMsg(err?.response?.data?.message || "에러가 발생했습니다.");
  }

}

  return (
    <div className="bg-gray-100 flex justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* 이메일 (링크 인증 방식) */}

          {isVerified ? (
            <div className="mb-4">
          <EmailInputWithDomain value={email} onChange={setEmail} isVerified={isVerified} />
          <button type="button" onClick={sendMagicLink} className=" mt-3 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
          인증 코드 발송
          </button>
            <p className="mt-2 text-sm text-green-600">이메일이 인증되었습니다.</p>
          </div>

          ) : (
          <div className="mb-4">
          <EmailInputWithDomain value={email} onChange={setEmail} isVerified={isVerified} />
          <button type="button" onClick={sendMagicLink} className=" mt-3 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
          인증 코드 발송
          </button>
            <p className="mt-2 text-sm text-red-600">{msg}</p>
          </div>
          )}

          {/* 비밀번호 */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 ${
                passValid ? "border-green-400 focus:ring-green-300" : "border-gray-300 focus:ring-blue-400"
              }`}
              aria-describedby="passwordHelp"
            />
            <p id="passwordHelp" className={`mt-1 text-xs ${passValid ? "text-green-600" : "text-gray-500"}`}>
              숫자와 문자, 특수문자 8~20자가 필요합니다.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label htmlFor="confirm" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호 확인
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 ${
                passMatch ? "border-green-400 focus:ring-green-300" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {confirm.length > 0 && (
              <p className={`mt-1 text-sm ${passMatch ? "text-green-600" : "text-red-600"}`}>
                {passMatch ? "일치" : "일치하지 않습니다!"}
              </p>
            )}
          </div>

        {/* 이름 */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 ${
                passValid ? "border-green-400 focus:ring-green-300" : "border-gray-300 focus:ring-blue-400"
              }`}
              aria-describedby="nameHelp"
            />

          </div>


          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

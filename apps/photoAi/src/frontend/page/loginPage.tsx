import React from 'react'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-80 p-8 rounded-lg shadow-lg bg-white flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이메일"
            className="px-4 py-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="px-4 py-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="py-3 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage;

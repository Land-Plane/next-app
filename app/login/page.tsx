// app/login/page.tsx
"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const msg = await signIn(email, password)
    if (msg) setError(msg)
    else router.push("/")
  }

  const handleSignUp = async () => {
    setError(null)
    const msg = await signUp(email, password)
    if (msg) setError(msg)
    else router.push("/")
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-bold text-center mb-6">登录 / 注册</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email" placeholder="邮箱" value={email} required
          onChange={e => setEmail(e.target.value)}
          className="p-2.5 border rounded-md text-base"
        />
        <input
          type="password" placeholder="密码（至少 6 位）" value={password} required minLength={6}
          onChange={e => setPassword(e.target.value)}
          className="p-2.5 border rounded-md text-base"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="flex-1 py-2.5 bg-blue-500 text-white rounded-md cursor-pointer">
            登录
          </button>
          <button type="button" onClick={handleSignUp} className="flex-1 py-2.5 bg-green-500 text-white rounded-md cursor-pointer">
            注册
          </button>
        </div>
      </form>
    </div>
  )
}
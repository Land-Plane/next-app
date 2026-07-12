// app/users/[username]/not-found.tsx
import Link from "next/link"

export default function UserNotFound() {
  return (
    <div className="max-w-md mx-auto p-5 text-center">
      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-600 mb-6">找不到该用户</p>
      <Link
        href="/users"
        className="text-blue-600 hover:underline"
      >
        ← 返回用户列表
      </Link>
    </div>
  )
}
// app/users/[username]/page.tsx
import Link from "next/link"
import { notFound } from "next/navigation"

interface GitHubUserDetail {
  login: string
  name: string
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.github.com/users")
    if (!res.ok) return []                       // API 限流时跳过
    const users = await res.json()
    if (!Array.isArray(users)) return []          // 数据格式不对时跳过
    return users.map((user: { login: string }) => ({
      username: user.login,
    }))
  } catch {
    return []                                     // 网络不可达时跳过
  }
}
async function getUser(username: string): Promise<GitHubUserDetail> {
  const res = await fetch(`https://api.github.com/users/${username}`)
  if (res.status === 404) {
    notFound()
  }
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = await getUser(username)

  return (
    <div className="max-w-md mx-auto p-5">
      <Link href="/users" className="text-blue-600 hover:underline text-sm">
        ← 返回用户列表
      </Link>
      <div className="mt-4 flex flex-col items-center gap-4 p-6 border rounded-lg">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-full"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
          <p className="text-gray-500">@{user.login}</p>
          {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <span className="text-center">
            <p className="font-bold text-gray-800">{user.public_repos}</p>
            <p>仓库</p>
          </span>
          <span className="text-center">
            <p className="font-bold text-gray-800">{user.followers}</p>
            <p>粉丝</p>
          </span>
          <span className="text-center">
            <p className="font-bold text-gray-800">{user.following}</p>
            <p>关注</p>
          </span>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          查看 GitHub 主页
        </a>
      </div>
    </div>
  )
}
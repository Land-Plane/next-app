// app/users/page.tsx
interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

async function getUsers(): Promise<GitHubUser[]> {
  const res = await fetch("https://api.github.com/users")
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-6">GitHub 用户列表</h1>
      <div className="grid gap-4">
        {users.map(user => (
          <a
            key={user.id}
            href={user.html_url}
            target="_blank"
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">{user.login}</p>
              <p className="text-sm text-gray-500">GitHub ID: {user.id}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
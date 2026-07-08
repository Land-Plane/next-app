
interface GitHubRepo {
  name: string
  description: string
  stargazers_count: number
  language: string
  html_url: string
}

async function getRepo(): Promise<GitHubRepo> {
    const res = await fetch("https://api.github.com/repos/facebook/react")
    if (!res.ok) throw new Error("Failed to fetch repo")
    return res.json()
}

export default async function RepoPage() {
    const repo = await getRepo()

    return (
        <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-2xl font-bold text-center mb-6">GitHub 仓库信息</h1>
        <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold">{repo.name}</h2>
            <p className="text-gray-600 mt-2">{repo.description}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>⭐ {repo.stargazers_count}</span>
                <span>语言: {repo.language}</span>
            </div>
            <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 hover:underline"
            >
                查看仓库 →
            </a>
            </div>
        </div>
        </div>
    )
}
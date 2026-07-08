import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Todo App",
  description: "React learning project",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body>
        <nav className="flex justify-center gap-6 py-4 border-b border-gray-200">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            首页
          </Link>
          <Link href="/counter" className="text-blue-600 hover:text-blue-800 font-medium">
            计数器
          </Link>
          <Link href="/users" className="text-blue-600 hover:text-blue-800 font-medium">
            GitHub 用户
          </Link>
          <Link href="/repos" className="text-blue-600 hover:text-blue-800 font-medium">
            GitHub 仓库
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
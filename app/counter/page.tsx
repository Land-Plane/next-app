// app/counter/page.tsx
"use client"

import { useState } from "react"

export default function CounterPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">计数器页面</h1>
      <p className="text-lg">当前计数: {count}</p>
      {count >= 5 && <p className="text-orange-500">你点了很多次了</p>}
      {count >= 10 && <p className="text-red-600 font-bold">不能再加了！</p>}
      <div className="flex gap-3">
        <button onClick={() => setCount(c => c + 1)}
          className="px-6 py-2.5 text-base cursor-pointer bg-green-500 text-white border-none rounded-md"
        >+1</button>
        <button onClick={() => setCount(c => c - 1)}
          className="px-6 py-2.5 text-base cursor-pointer bg-red-500 text-white border-none rounded-md"
        >-1</button>
      </div>
      <a href="/" className="text-blue-500 underline mt-4">返回首页</a>
    </div>
  )
}
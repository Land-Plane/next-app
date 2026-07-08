"use client"

import { useState } from "react"

export default function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === "") return
    onAdd(inputValue)
    setInputValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="text-center my-5">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="输入新任务..."
        className="p-2.5 text-base w-[300px] rounded-md border border-gray-300 mr-2.5"
      />
      <button type="submit"
        className="px-5 py-2.5 text-base cursor-pointer bg-blue-500 text-white border-none rounded-md"
      >
        添加
      </button>
    </form>
  )
}
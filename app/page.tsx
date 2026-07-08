"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import TodoInput from "./components/TodoInput"

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function Home() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好"

  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos")
      if (saved) return JSON.parse(saved)
    }
    return [
      { id: 1, text: "学习 React 基础知识", done: false },
      { id: 2, text: "完成 Counter 练习", done: false },
      { id: 3, text: "理解条件和列表渲染", done: false },
    ]
  })

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, done: false }])
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.done
    if (filter === "completed") return todo.done
    return true
  })

  return (
    <div className="max-w-md mx-auto p-5">
      <Header greeting={greeting} timeStr={now.toLocaleString("zh-CN")} />
      <hr className="my-8" />
      <TodoInput onAdd={addTodo} />
      <p className="text-center text-gray-600 text-sm">
        剩余 {todos.filter(t => !t.done).length} 项未完成
      </p>
      <h2 className="text-center text-gray-800">我的任务清单</h2>
      <div className="text-center mb-4">
        {["all", "active", "completed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-base cursor-pointer border-none rounded-md mr-2.5 ${
              filter === f ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {f === "all" ? "全部" : f === "active" ? "未完成" : "已完成"}
          </button>
        ))}
      </div>

      <ul className="list-none p-0">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className="flex justify-between items-center p-2.5 mb-2.5 border rounded-md cursor-pointer"
          >
            <span className={todo.done ? "line-through text-gray-500" : ""}>
              {todo.text}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id) }}
              className="px-3 py-1.5 text-sm cursor-pointer bg-red-500 text-white border-none rounded-md"
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      {todos.some(t => t.done) && (
        <div className="text-center mt-3">
          <button
            onClick={() => setTodos(todos.filter(t => !t.done))}
            className="px-5 py-2.5 text-base cursor-pointer bg-gray-500 text-white border-none rounded-md"
          >
            清除已完成
          </button>
        </div>
      )}
    </div>
  )
}
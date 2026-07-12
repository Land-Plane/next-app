"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import TodoInput from "./components/TodoInput"
import { supabase } from "./lib/supabase"
import { useAuth } from "./context/AuthContext"
import { useRouter } from "next/navigation"

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function Home() {
  const [greeting, setGreeting] = useState("")
  const [timeStr, setTimeStr] = useState("")
  const { user, loading: authLoading, signOut } = useAuth()
  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    setGreeting(hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好")
    setTimeStr(now.toLocaleString("zh-CN"))
  }, [])

  const [todos, setTodos] = useState<Todo[]>([])

  const [filter, setFilter] = useState("all")
  const [newPassword, setNewPassword] = useState("")
  
  const router = useRouter()

  // 未登录时跳转到登录页
  useEffect(() => {
    if (!authLoading && !user) router.push("/login")
  }, [user, authLoading, router])

  // 只在 user 可用时加载 Todo
  useEffect(() => {
    if (!user) return
    async function loadTodos() {
      const { data } = await supabase.from("todos").select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
      if (data) setTodos(data)
    }
    loadTodos()
  }, [user])
  // 新增：添加时写入 Supabase
  const addTodo = async (text: string) => {
    const { data, error } = await supabase.from("todos").insert({ text, user_id: user!.id }).select()
    if (error) { alert("添加失败: " + error.message); return }
    if (data) setTodos([...todos, ...data])
  }

  // 新增：删除时从 Supabase 删除
  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id)
    if (error) return
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // 新增：切换状态时更新 Supabase
  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const { error } = await supabase.from("todos").update({ done: !todo.done }).eq("id", id)
    if (error) return
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  // 新增：清除已完成
  const clearDone = async () => {
    const { error } = await supabase.from("todos").delete().eq("done", true)
    if (error) return
    setTodos(prev => prev.filter(t => !t.done))
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { alert("密码至少 6 位"); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) alert("修改失败: " + error.message)
    else { alert("密码已修改"); setNewPassword("") }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.done
    if (filter === "completed") return todo.done
    return true
  })

  return (
    <div className="max-w-md mx-auto p-5">
      {greeting && <Header greeting={greeting} timeStr={timeStr} />}
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
            onClick={clearDone}
            className="px-5 py-2.5 text-base cursor-pointer bg-gray-500 text-white border-none rounded-md"
          >
            清除已完成
          </button>
        </div>
      )}

      {/* 修改密码 */}
      <hr className="my-8" />
      <div className="p-4 border rounded-lg">
        <h3 className="text-base font-bold mb-3">修改密码</h3>
        <div className="flex gap-2">
          <input type="password" placeholder="新密码（至少6位）" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="flex-1 p-2 border rounded-md text-sm"
          />
          <button onClick={handleChangePassword}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md cursor-pointer whitespace-nowrap"
          >修改</button>
        </div>
      </div>
      {/* 登出 */}
      {user && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500 mr-3">{user.email ?? ''}</span>
          <button onClick={signOut}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >登出</button>
        </div>
      )}
    </div>
  )
}
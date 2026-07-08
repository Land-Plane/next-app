export default function Header({ greeting, timeStr }: { greeting: string; timeStr: string }) {
  return (
    <header className="text-center my-5">
      <h1 className="text-xl text-gray-800 m-0">{greeting},欢迎来到我的页面</h1>
      <p className="text-gray-600">现在是 {timeStr}</p>
    </header>
  )
}
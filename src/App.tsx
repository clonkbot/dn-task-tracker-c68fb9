import { useState, useEffect } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('dn-todos')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) }))
    }
    return []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem('dn-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input.trim(), completed: false, createdAt: new Date() }
      ])
      setInput('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed))
  }

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeTodos = todos.filter(t => !t.completed).length
  const completedTodos = todos.filter(t => t.completed).length

  return (
    <div className="min-h-screen bg-[#e8e6e1] relative overflow-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-40"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat'
           }}
      />

      {/* Stepped shape left side */}
      <div className="fixed left-0 top-0 h-full w-16 md:w-24 lg:w-32 z-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#1a1a3e]" />
        <div className="absolute top-1/3 left-0 w-3/4 h-1/6 bg-[#1a1a3e]" />
        <div className="absolute top-1/2 left-0 w-1/2 h-1/6 bg-[#1a1a3e]" />
        <div className="absolute top-2/3 left-0 w-3/4 h-1/3 bg-[#1a1a3e]" />
      </div>

      {/* Main content */}
      <main className="relative z-20 min-h-screen flex flex-col pl-20 md:pl-32 lg:pl-40 pr-4 md:pr-8 lg:pr-16 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-10 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
            <div className="flex items-center border-2 border-[#1a1a3e] bg-[#1a1a3e]">
              <span className="text-white font-mono text-lg md:text-xl px-2 md:px-3 py-1">DN</span>
              <span className="bg-white text-[#1a1a3e] font-mono text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 tracking-widest">
                TASK TRACKER
              </span>
            </div>
            <div className="border-2 border-[#1a1a3e] px-2 md:px-3 py-1 md:py-1.5">
              <span className="font-mono text-xs md:text-sm text-[#1a1a3e]">@DN25</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 font-mono text-[10px] md:text-xs text-[#1a1a3e] tracking-wider">
            <div>
              <span className="opacity-50">//</span>ACTIVE: {activeTodos}
            </div>
            <div>
              <span className="opacity-50">//</span>COMPLETED: {completedTodos}
            </div>
            <div>
              <span className="opacity-50">//</span>TOTAL: {todos.length}
            </div>
          </div>
        </header>

        {/* Input section */}
        <div className="mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="// ENTER NEW TASK..."
                className="w-full bg-transparent border-2 border-[#1a1a3e] px-3 md:px-4 py-3 md:py-4 font-mono text-xs md:text-sm text-[#1a1a3e] placeholder-[#1a1a3e]/40 focus:outline-none focus:bg-white/50 transition-colors tracking-wider"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30">
                <CheckerPattern size={16} />
              </div>
            </div>
            <button
              onClick={addTodo}
              className="bg-[#1a1a3e] text-white font-mono text-xs md:text-sm px-4 md:px-6 py-3 md:py-4 tracking-widest hover:bg-[#2a2a5e] transition-colors min-h-[48px]"
            >
              ADD TASK
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 md:mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[10px] md:text-xs px-3 md:px-4 py-2 md:py-2.5 tracking-widest transition-colors min-h-[44px] ${
                filter === f
                  ? 'bg-[#1a1a3e] text-white'
                  : 'border-2 border-[#1a1a3e] text-[#1a1a3e] hover:bg-[#1a1a3e]/10'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dotted line separator */}
        <div className="border-t-2 border-dotted border-[#1a1a3e]/30 mb-4 md:mb-6" />

        {/* Todo list */}
        <div className="flex-1 space-y-2 md:space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="font-mono text-xs md:text-sm text-[#1a1a3e]/50 py-8 md:py-12 text-center animate-fade-in">
              {filter === 'all'
                ? '// NO TASKS YET. ADD ONE ABOVE.'
                : filter === 'active'
                ? '// NO ACTIVE TASKS.'
                : '// NO COMPLETED TASKS.'}
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-slide-up group"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className={`flex items-center gap-2 md:gap-4 border-2 border-[#1a1a3e] p-3 md:p-4 transition-all ${
                  todo.completed ? 'bg-[#1a1a3e]/5' : 'bg-white/30 hover:bg-white/50'
                }`}>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="w-5 h-5 md:w-6 md:h-6 border-2 border-[#1a1a3e] flex items-center justify-center flex-shrink-0 hover:bg-[#1a1a3e]/10 transition-colors min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0"
                  >
                    {todo.completed && <CheckerPattern size={12} />}
                  </button>

                  <span className={`flex-1 font-mono text-xs md:text-sm tracking-wide ${
                    todo.completed ? 'line-through opacity-50' : 'text-[#1a1a3e]'
                  }`}>
                    {todo.text}
                  </span>

                  <span className="font-mono text-[8px] md:text-[10px] text-[#1a1a3e]/40 hidden sm:block">
                    {todo.createdAt.toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 font-mono text-[10px] md:text-xs text-[#1a1a3e]/50 hover:text-[#1a1a3e] transition-all px-2 min-h-[44px] flex items-center"
                  >
                    [DEL]
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom section */}
        {completedTodos > 0 && (
          <div className="mt-6 md:mt-8 animate-fade-in">
            <button
              onClick={clearCompleted}
              className="font-mono text-[10px] md:text-xs text-[#1a1a3e]/50 hover:text-[#1a1a3e] tracking-widest transition-colors py-2"
            >
              // CLEAR COMPLETED ({completedTodos})
            </button>
          </div>
        )}

        {/* Info section */}
        <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t-2 border-dotted border-[#1a1a3e]/30 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1a1a3e] px-2 md:px-3 py-1.5 md:py-2">
                <span className="font-mono text-[10px] md:text-xs text-white tracking-widest">DITHER X ASCII</span>
                <span className="font-mono text-[10px] md:text-xs text-white/50 ml-2">///</span>
              </div>
              <DitherPattern />
            </div>
            <div className="font-mono text-[10px] md:text-xs text-[#1a1a3e]/60 tracking-widest">
              CREATED WITH PASSION &nbsp;&nbsp; @ 2025
            </div>
          </div>

          <h2 className="font-mono text-xl md:text-2xl lg:text-3xl text-[#1a1a3e] tracking-[0.2em] mt-4 md:mt-6">
            TASK MASTER
          </h2>
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 pt-4 border-t border-[#1a1a3e]/10">
          <p className="font-mono text-[9px] md:text-[10px] text-[#1a1a3e]/30 tracking-wider text-center">
            Requested by @PauliusX · Built by @clonkbot
          </p>
        </footer>
      </main>

      {/* Decorative checker patterns */}
      <div className="fixed top-1/4 right-8 md:right-16 opacity-20 hidden lg:block">
        <LargeCheckerPattern />
      </div>
    </div>
  )
}

function CheckerPattern({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="0" y="0" width="5" height="5" fill="#1a1a3e" />
      <rect x="10" y="0" width="5" height="5" fill="#1a1a3e" />
      <rect x="5" y="5" width="5" height="5" fill="#1a1a3e" />
      <rect x="15" y="5" width="5" height="5" fill="#1a1a3e" />
      <rect x="0" y="10" width="5" height="5" fill="#1a1a3e" />
      <rect x="10" y="10" width="5" height="5" fill="#1a1a3e" />
      <rect x="5" y="15" width="5" height="5" fill="#1a1a3e" />
      <rect x="15" y="15" width="5" height="5" fill="#1a1a3e" />
    </svg>
  )
}

function LargeCheckerPattern() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
      {[...Array(8)].map((_, i) => (
        [...Array(6)].map((_, j) => (
          (i + j) % 2 === 0 && (
            <rect key={`${i}-${j}`} x={i * 10} y={j * 10} width="10" height="10" fill="#1a1a3e" />
          )
        ))
      ))}
    </svg>
  )
}

function DitherPattern() {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="hidden sm:block">
      {/* Dithered gradient effect */}
      <rect x="0" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="8" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="16" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="24" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="32" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="4" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="12" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="20" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="28" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="0" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="8" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="16" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="4" y="12" width="4" height="4" fill="#1a1a3e" />
      <rect x="12" y="12" width="4" height="4" fill="#1a1a3e" />
      <rect x="0" y="16" width="4" height="4" fill="#1a1a3e" />
      <rect x="8" y="16" width="4" height="4" fill="#1a1a3e" />
      <rect x="4" y="20" width="4" height="4" fill="#1a1a3e" />
      <rect x="0" y="24" width="4" height="4" fill="#1a1a3e" />
      {/* Right side - "25" in pixels */}
      <rect x="40" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="44" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="48" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="52" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="56" y="0" width="4" height="4" fill="#1a1a3e" />
      <rect x="40" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="52" y="4" width="4" height="4" fill="#1a1a3e" />
      <rect x="40" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="44" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="48" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="52" y="8" width="4" height="4" fill="#1a1a3e" />
      <rect x="52" y="12" width="4" height="4" fill="#1a1a3e" />
      <rect x="40" y="16" width="4" height="4" fill="#1a1a3e" />
      <rect x="44" y="16" width="4" height="4" fill="#1a1a3e" />
      <rect x="48" y="16" width="4" height="4" fill="#1a1a3e" />
      <rect x="52" y="16" width="4" height="4" fill="#1a1a3e" />
    </svg>
  )
}

export default App

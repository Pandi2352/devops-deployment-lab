const version = import.meta.env.VITE_APP_VERSION ?? 'dev'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-white">
      <h1 className="text-4xl font-bold">DevOps Lab</h1>
      <p className="text-slate-300">React + vite + TypeScript + Tailwind</p>
      <p className="rounded border border-slate-600 px-3 py-1 font-mono text-sm">
        Version: {version}
      </p>
    </main>
  )
}

export default App

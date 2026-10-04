function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        Genshin Impact Wiki <span className="text-accent-500">&</span> Tracker
      </h1>
      <p className="max-w-prose text-zinc-600 dark:text-zinc-400">
        Your setup is ready. Edit <code className="font-mono">src/App.tsx</code> and save to see
        changes instantly.
      </p>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Framework', value: 'React 19' },
          { label: 'Language', value: 'TypeScript 6' },
          { label: 'Styling', value: 'Tailwind CSS 4' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-zinc-200 px-6 py-4 dark:border-zinc-800"
          >
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</dt>
            <dd className="font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}

export default App

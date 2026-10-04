import { NavLink, Route, Routes } from 'react-router-dom'
import { CharacterPage } from './pages/CharacterPage'
import { RosterPage } from './pages/RosterPage'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          isActive
            ? 'bg-accent-500/15 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300'
            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Genshin <span className="text-accent-500">Wiki</span>
          </span>
          <div className="flex items-center gap-1">
            <NavItem to="/">Characters</NavItem>
            <NavItem to="/tracker">Tracker</NavItem>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<RosterPage />} />
          <Route path="/characters/:id" element={<CharacterPage />} />
          <Route path="/tracker" element={<TrackerPlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        Game data from{' '}
        <a
          href="https://github.com/genshindev/api"
          target="_blank"
          rel="noreferrer noopener"
          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          genshin.dev
        </a>
        . Not affiliated with HoYoverse.
      </footer>
    </div>
  )
}

function TrackerPlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
      <h1 className="text-2xl font-bold">Tracker</h1>
      <p className="mx-auto mt-2 max-w-prose text-zinc-600 dark:text-zinc-400">
        Coming next. This will read your in-game roster — either by pulling from your device or by
        looking up your UID. It stays optional and separate from the wiki.
      </p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
      <p className="text-lg font-medium">Page not found</p>
      <NavLink
        to="/"
        className="text-accent-600 dark:text-accent-400 mt-3 inline-block hover:underline"
      >
        ← Back to the roster
      </NavLink>
    </div>
  )
}

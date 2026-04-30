import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  [
    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
    isActive
      ? "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-md shadow-purple-300/40"
      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700",
  ].join(" ");

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 text-gray-900">
      <header className="shrink-0 border-b border-purple-100/60 bg-white/80 backdrop-blur-xl z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 text-sm font-bold text-white shadow-md shadow-purple-300/40">
              S
            </span>
            <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              SessionBook
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Experts
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden px-4 py-3">
        {children}
      </main>
    </div>
  );
}
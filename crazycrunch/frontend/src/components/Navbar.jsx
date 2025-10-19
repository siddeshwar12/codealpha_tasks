import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-bgDark/80 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-primary">Crazy</span>Crunch
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => (isActive ? 'text-primary' : 'text-white') + ' hover:text-primary'}>Home</NavLink>
          <NavLink to="/upload" className={({isActive}) => (isActive ? 'text-primary' : 'text-white') + ' hover:text-primary'}>Upload</NavLink>
          {user ? (
            <div className="flex items-center gap-3">
              <NavLink to={`/profile/${user.id}`} className="hover:text-primary">{user.username}</NavLink>
              <button onClick={onLogout} className="btn-primary text-sm">Logout</button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-primary text-sm">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

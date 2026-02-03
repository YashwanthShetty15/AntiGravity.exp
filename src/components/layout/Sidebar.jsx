import { Home, Activity, DollarSign, GraduationCap, Settings, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Health', path: '/health' },
    { icon: DollarSign, label: 'Finance', path: '/finance' },
    { icon: GraduationCap, label: 'Academic', path: '/academic' },
]

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 glass border-r border-white/5 flex flex-col transition-all duration-300 z-50">
            <div className="p-6 flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-neon-purple shadow-glow-primary animate-pulse-slow" />
                <span className="hidden md:block font-display font-bold text-xl tracking-wider">
                    NEXUS
                </span>
            </div>

            <nav className="flex-1 mt-10 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "bg-white/10 text-primary shadow-lg"
                                : "text-muted hover:text-white hover:bg-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={clsx("w-6 h-6 transition-transform duration-300", isActive && "scale-110", "group-hover:scale-110")} />
                                <span className="hidden md:block font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-glow-primary" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="flex items-center gap-4 px-3 py-3 w-full rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-6 h-6" />
                    <span className="hidden md:block font-medium">Settings</span>
                </button>
            </div>
        </aside>
    )
}

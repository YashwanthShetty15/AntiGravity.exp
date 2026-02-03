import { Sidebar } from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
// CustomCursor removed
import { Background3D } from './Background3D'
import { AnimatePresence, motion } from 'framer-motion'

export function MainLayout() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 relative">

            <Background3D />
            <Sidebar />

            <main className="pl-20 md:pl-64 min-h-screen transition-all duration-300 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto p-8 pt-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

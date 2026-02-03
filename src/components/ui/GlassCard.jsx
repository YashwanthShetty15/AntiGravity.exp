import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

export function GlassCard({ children, className, hoverEffect = true, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: delay * 0.1
            }}
            whileHover={hoverEffect ? {
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            className={twMerge(
                "glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/5",
                hoverEffect && "hover:border-primary/30 hover:shadow-glow-primary/20",
                className
            )}
        >
            <div className="relative z-10">{children}</div>

            {/* Subtle gradient overlay on hover */}
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}

            {/* New: Shimmer effect on hover */}
            {hoverEffect && (
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            )}
        </motion.div>
    )
}

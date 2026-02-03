import { motion } from 'framer-motion'
import { useState } from 'react'

export function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, icon: Icon }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-medium">
                    {Icon && <Icon size={18} className="text-primary" />}
                    {label}
                </div>
                <span className="text-primary font-mono text-lg">{value}</span>
            </div>

            <div className="relative h-2 bg-white/10 rounded-full">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-neon-green rounded-full shadow-glow-primary"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute top-(-5px) left-0 w-full h-4 opacity-0 cursor-pointer"
                />
                {/* Thumb indicator (Custom) */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none"
                    style={{ left: `${((value - min) / (max - min)) * 100}%` }}
                    layoutId={`thumb-${label}`}
                />
            </div>
        </div>
    )
}

export function MoodSelector({ value, onChange }) {
    const moods = [
        { level: 1, text: "Wait..." },
        { level: 2, text: "Okay" },
        { level: 3, text: "Good" },
        { level: 4, text: "Great" },
        { level: 5, text: "Godlike" }
    ]

    return (
        <div className="space-y-3">
            <label className="text-white font-medium block">Energy Level</label>
            <div className="flex justify-between bg-white/5 rounded-2xl p-2 border border-white/5">
                {moods.map((m) => (
                    <button
                        key={m.level}
                        className={`flex-1 py-3 rounded-xl transition-all duration-300 ${value === m.level ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg' : 'text-muted hover:bg-white/5'}`}
                        onClick={() => onChange(m.level)}
                    >
                        <span className="text-sm font-bold">{m.text}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

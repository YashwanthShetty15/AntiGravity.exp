import { GlassCard } from '../components/ui/GlassCard'
import { RangeSlider, MoodSelector } from '../components/health/HealthInputs'
import { useState, useEffect } from 'react'
import { Moon, Droplets, Activity, HeartPulse, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HealthTracker() {
    const [sleep, setSleep] = useState(() => Number(localStorage.getItem('health_sleep')) || 7.5)
    const [water, setWater] = useState(() => Number(localStorage.getItem('health_water')) || 1500)
    const [mood, setMood] = useState(() => Number(localStorage.getItem('health_mood')) || 3)
    const [steps, setSteps] = useState(() => Number(localStorage.getItem('health_steps')) || 5000)

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('health_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('health_sleep', sleep);
        localStorage.setItem('health_water', water);
        localStorage.setItem('health_mood', mood);
        localStorage.setItem('health_steps', steps);
    }, [sleep, water, mood, steps]);

    useEffect(() => {
        localStorage.setItem('health_history', JSON.stringify(history));
    }, [history]);

    // Calculate "Pulse" based on stats (simplified logic)
    const healthScore = (sleep / 8 * 0.3) + (water / 2500 * 0.3) + (mood / 5 * 0.4)
    // Normalize score 0-1
    const normalizedScore = Math.min(Math.max(healthScore, 0), 1);

    const handleSaveDay = () => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        const newEntry = { day: today, score: Math.round(normalizedScore * 100) };

        // Update history (keep last 7 entries)
        const newHistory = [...history, newEntry].slice(-7);
        setHistory(newHistory);

        alert("Day logged successfully!");
    };

    // Generate chart data (fill with dummy if empty for visual)
    const chartData = history.length > 0 ? history : [
        { day: 'Mon', score: 65 }, { day: 'Tue', score: 40 }, { day: 'Wed', score: 75 },
        { day: 'Thu', score: 50 }, { day: 'Fri', score: 80 }, { day: 'Sat', score: 70 }, { day: 'Sun', score: 90 }
    ];

    return (
        <div className="space-y-6 animate-fade-in text-white/90">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Health Monitor</h1>
                    <p className="text-muted">Physiological status: <span className="text-neon-green">{(normalizedScore * 100).toFixed(0)}% Optimal</span></p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSaveDay}
                        className="px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 flex items-center gap-2 transition-all"
                    >
                        <Save size={18} />
                        Log Day
                    </button>

                    <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Visual Pulse */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-neon-green/30"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2 - normalizedScore, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-2 rounded-full border-4 border-neon-green/50"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ duration: 2 - normalizedScore, delay: 0.5, repeat: Infinity }}
                        />
                        <HeartPulse className="w-8 h-8 text-neon-green" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="space-y-8">
                    <h3 className="text-xl font-bold border-b border-white/10 pb-4">Daily Inputs</h3>

                    <RangeSlider
                        label="Hours Slept"
                        value={sleep}
                        onChange={setSleep}
                        min={0} max={12} step={0.5}
                        icon={Moon}
                    />

                    <RangeSlider
                        label="Water Intake (ml)"
                        value={water}
                        onChange={setWater}
                        min={0} max={4000} step={100}
                        icon={Droplets}
                    />

                    <RangeSlider
                        label="Steps Taken"
                        value={steps}
                        onChange={setSteps}
                        min={0} max={15000} step={100}
                        icon={Activity}
                    />

                    <MoodSelector value={mood} onChange={setMood} />
                </GlassCard>

                <div className="space-y-6">
                    <GlassCard className="h-full bg-gradient-to-br from-card/60 to-primary/5 border-primary/20">
                        <h3 className="text-xl font-bold mb-4">Weekly Analysis</h3>
                        <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-white/5 relative">
                            {chartData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-full">
                                    <div className="w-8 bg-white/10 rounded-t-lg relative group transition-all hover:bg-neon-green/50" style={{ height: `${d.score}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">{d.score}%</div>
                                    </div>
                                    <span className="text-xs text-muted">{d.day}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-center text-muted mt-4">Your vitality score is based on your daily inputs.</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

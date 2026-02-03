import { GlassCard } from '../components/ui/GlassCard'
import { Activity, DollarSign, GraduationCap, Flame, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StatCard({ title, value, subtitle, icon: Icon, color, progress }) {
    return (
        <GlassCard className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-20`}>
                <Icon size={120} className={color} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                        <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-muted">{title}</h3>
                </div>

                <div>
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-4xl font-display font-bold">{value}</span>
                        <span className="text-sm text-green-400 flex items-center mb-1">
                            <ArrowUpRight size={16} />
                        </span>
                    </div>
                    <p className="text-sm text-muted">{subtitle}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </GlassCard>
    )
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        health: 0,
        balance: 0,
        gpa: 0
    });

    useEffect(() => {
        // Health Calc
        const sleep = Number(localStorage.getItem('health_sleep')) || 7.5;
        const water = Number(localStorage.getItem('health_water')) || 1500;
        const mood = Number(localStorage.getItem('health_mood')) || 3;
        const healthScore = ((sleep / 8 * 0.3) + (water / 2500 * 0.3) + (mood / 5 * 0.4)) * 100;

        // Finance Calc
        const transactions = JSON.parse(localStorage.getItem('finance_transactions') || '[]');
        const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const balance = income - expense;

        // Academic Calc
        const subjects = JSON.parse(localStorage.getItem('academic_subjects') || '[]');
        const gpa = subjects.length > 0
            ? (subjects.reduce((acc, curr) => acc + (curr.progress / 25), 0) / subjects.length).toFixed(1)
            : 'N/A';

        setStats({
            health: Math.min(Math.round(healthScore), 100),
            balance: balance,
            gpa: gpa
        });
    }, []);

    const quickActions = [
        { label: 'Log Health', path: '/health' },
        { label: 'Add Expense', path: '/finance' },
        { label: 'Study Session', path: '/academic' }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">
                        Good Evening, <span className="text-primary">Pilot</span>
                    </h1>
                    <p className="text-muted">
                        Your systems are nominal. 12 day streak active.
                    </p>
                </div>

                <GlassCard className="py-2 px-6 flex items-center gap-3 !rounded-full !bg-white/5 hover:!bg-white/10 w-fit">
                    <Flame className="text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="font-bold text-lg">12 Days</span>
                </GlassCard>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Health"
                    value={`${stats.health}%`}
                    subtitle="Overall Wellness Score"
                    icon={Activity}
                    color="text-neon-green"
                    progress={stats.health}
                />
                <StatCard
                    title="Finance"
                    value={`$${stats.balance.toLocaleString()}`}
                    subtitle="Available Balance"
                    icon={DollarSign}
                    color="text-primary"
                    progress={Math.min((stats.balance / 5000) * 100, 100)} // Arbitrary goal for visual
                />
                <StatCard
                    title="Academic"
                    value={stats.gpa === 'N/A' ? 'N/A' : `${stats.gpa} GPA`}
                    subtitle="Current Estimate"
                    icon={GraduationCap}
                    color="text-neon-purple"
                    progress={stats.gpa === 'N/A' ? 0 : (stats.gpa / 4.0) * 100}
                />
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard className="col-span-1 md:col-span-2 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4">Activity Overview</h3>
                        <p className="text-muted">Interactive charts coming soon...</p>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-left flex items-center justify-between group"
                            >
                                <span>{action.label}</span>
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" size={16} />
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}

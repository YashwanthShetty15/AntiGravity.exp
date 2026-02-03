import { GlassCard } from '../components/ui/GlassCard'
import { BookOpen, CheckCircle, Clock, Trophy, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const INITIAL_SUBJECTS = [
    { id: 1, title: "Quantum Physics", progress: 75, nextTask: "Read Ch. 4", hours: 12 },
    { id: 2, title: "Linear Algebra", progress: 45, nextTask: "Problem Set 3", hours: 8 },
    { id: 3, title: "Computer Science", progress: 90, nextTask: "Final Project", hours: 45 },
    { id: 4, title: "History of Art", progress: 60, nextTask: "Write Essay", hours: 6 },
]

export default function AcademicTracker() {
    const [subjects, setSubjects] = useState(() => {
        const saved = localStorage.getItem('academic_subjects');
        return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    });

    const [isAddingMsg, setIsAddingMsg] = useState(false);
    const [newSubject, setNewSubject] = useState({ title: '', progress: 0, nextTask: '', hours: 0 });

    useEffect(() => {
        localStorage.setItem('academic_subjects', JSON.stringify(subjects));
    }, [subjects]);

    const handleAddSubject = (e) => {
        e.preventDefault();
        if (!newSubject.title) return;
        setSubjects([...subjects, { id: Date.now(), ...newSubject, progress: Number(newSubject.progress), hours: Number(newSubject.hours) }]);
        setNewSubject({ title: '', progress: 0, nextTask: '', hours: 0 });
        setIsAddingMsg(false);
    };

    const handleDelete = (id) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const handleUpdateProgress = (id, newProgress) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, progress: newProgress } : s));
    };

    const totalHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);
    // Simple GPA calc placeholder
    const gpa = (subjects.reduce((acc, curr) => acc + (curr.progress / 25), 0) / subjects.length).toFixed(1);

    return (
        <div className="space-y-8 animate-fade-in text-white/90">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Academic Status</h1>
                    <p className="text-muted">Estimated GPA: <span className="text-neon-purple font-mono text-xl">{isNaN(gpa) ? 'N/A' : gpa}</span></p>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-sm border border-neon-purple/20">
                        Exam Week
                    </span>
                    <button
                        onClick={() => setIsAddingMsg(!isAddingMsg)}
                        className="px-4 py-2 rounded-full bg-neon-purple/20 border border-neon-purple/50 hover:bg-neon-purple/30 flex items-center gap-2 transition-all"
                    >
                        <Plus size={16} />
                        Add Subject
                    </button>
                </div>
            </header>

            {isAddingMsg && (
                <GlassCard className="animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-muted mb-1">Subject Name</label>
                            <input
                                type="text"
                                value={newSubject.title}
                                onChange={e => setNewSubject({ ...newSubject, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                                placeholder="e.g. Advanced Calculus"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Next Task</label>
                            <input
                                type="text"
                                value={newSubject.nextTask}
                                onChange={e => setNewSubject({ ...newSubject, nextTask: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                                placeholder="e.g. Read Ch. 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Hours Done</label>
                            <input
                                type="number"
                                value={newSubject.hours}
                                onChange={e => setNewSubject({ ...newSubject, hours: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                        <button type="submit" className="bg-neon-purple hover:bg-neon-purple/80 text-white font-bold p-2 rounded-lg transition-colors">
                            Add
                        </button>
                    </form>
                </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((sub, i) => (
                    <GlassCard key={sub.id} className="relative group" hoverEffect={true}>
                        <button
                            onClick={() => handleDelete(sub.id)}
                            className="absolute top-2 right-2 p-1 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-20"
                        >
                            <X size={16} />
                        </button>

                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen size={80} />
                        </div>

                        <h3 className="text-xl font-bold mb-2 pr-6 truncate">{sub.title}</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted">Progress</span>
                                    <span className="text-neon-purple">{sub.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const width = rect.width;
                                        const newProg = Math.round((x / width) * 100);
                                        handleUpdateProgress(sub.id, newProg);
                                    }}
                                    title="Click to update progress"
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sub.progress}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-gradient-to-r from-neon-purple to-pink-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted">
                                <Clock size={14} />
                                <span>{sub.hours}h studied</span>
                            </div>

                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                <div>
                                    <p className="text-xs text-muted">Next Task</p>
                                    <p className="text-sm font-medium truncate w-32">{sub.nextTask}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <GlassCard className="flex flex-col md:flex-row items-center justify-between p-8 gap-6 bg-gradient-to-r from-neon-purple/10 to-transparent">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-neon-purple/20 rounded-full text-neon-purple">
                        <Trophy size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Milestone Tracker</h3>
                        <p className="text-muted">
                            {totalHours >= 50
                                ? "You completed 50 study hours this month!"
                                : `You've studied ${totalHours} hours. ${50 - totalHours} more to reach 50h.`}
                        </p>
                    </div>
                </div>
                <button
                    disabled={totalHours < 50}
                    className={`px-8 py-3 font-bold rounded-xl shadow-glow-secondary transition-all ${totalHours >= 50 ? 'bg-neon-purple text-white hover:scale-105' : 'bg-white/10 text-muted cursor-not-allowed'}`}
                >
                    {totalHours >= 50 ? 'Claim Reward' : 'Locked'}
                </button>
            </GlassCard>
        </div>
    )
}

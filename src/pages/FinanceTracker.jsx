import { GlassCard } from '../components/ui/GlassCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, CreditCard, Wallet, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const INITIAL_TRANSACTIONS = [
    { id: 1, type: 'income', amount: 4000, category: 'Salary', date: '2025-01-15' },
    { id: 2, type: 'expense', amount: 1200, category: 'Rent', date: '2025-01-01' },
    { id: 3, type: 'expense', amount: 400, category: 'Food', date: '2025-01-10' },
    { id: 4, type: 'expense', amount: 300, category: 'Utilities', date: '2025-01-20' },
    { id: 5, type: 'income', amount: 3000, category: 'Freelance', date: '2025-02-05' },
];

export default function FinanceTracker() {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('finance_transactions');
        return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    });

    const [isAddingMsg, setIsAddingMsg] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ type: 'expense', amount: '', category: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }, [transactions]);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalSavings = totalIncome - totalExpenses;

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!newTransaction.amount || !newTransaction.category) return;

        const transaction = {
            id: Date.now(),
            ...newTransaction,
            amount: Number(newTransaction.amount)
        };

        setTransactions([...transactions, transaction]);
        setNewTransaction({ type: 'expense', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
        setIsAddingMsg(false);
    };

    const handleDelete = (id) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    // Prepare chart data (monthly)
    const chartData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.name === month);
        if (existing) {
            existing[t.type === 'income' ? 'income' : 'expense'] += t.amount;
        } else {
            acc.push({
                name: month,
                income: t.type === 'income' ? t.amount : 0,
                expense: t.type === 'expense' ? t.amount : 0
            });
        }
        return acc;
    }, []).sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.name) - months.indexOf(b.name);
    });

    // Prepare category data
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, []);

    return (
        <div className="space-y-8 animate-fade-in text-white/90">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold">Financial Overview</h1>
                    <p className="text-muted">Net Worth: <span className="text-primary font-mono text-xl">${totalSavings.toFixed(2)}</span></p>
                </div>
                <button
                    onClick={() => setIsAddingMsg(!isAddingMsg)}
                    className="px-6 py-2 rounded-full bg-primary/20 border border-primary/50 hover:bg-primary/30 flex items-center gap-2 transition-all"
                >
                    <Plus size={16} />
                    Add Transaction
                </button>
            </header>

            {isAddingMsg && (
                <GlassCard className="animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-muted mb-1">Type</label>
                            <select
                                value={newTransaction.type}
                                onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Food, Salary"
                                value={newTransaction.category}
                                onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Amount</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={newTransaction.amount}
                                onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Date</label>
                            <input
                                type="date"
                                value={newTransaction.date}
                                onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                            />
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary/80 text-black font-bold p-2 rounded-lg transition-colors">
                            Save
                        </button>
                    </form>
                </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-neon-green/10 rounded-xl text-neon-green">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">Total Income</p>
                        <h3 className="text-2xl font-bold">${totalIncome.toFixed(0)}</h3>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                        <CreditCard size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">Total Expenses</p>
                        <h3 className="text-2xl font-bold">${totalExpenses.toFixed(0)}</h3>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">Available Balance</p>
                        <h3 className="text-2xl font-bold">${totalSavings.toFixed(0)}</h3>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="col-span-2 min-h-[400px]">
                    <h3 className="text-xl font-bold mb-6">Income vs Expenses</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121216', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {transactions.slice().reverse().map((t) => (
                            <div key={t.id} className="flex justify-between items-center group">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{t.category}</span>
                                    <span className="text-xs text-muted">{t.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${t.type === 'income' ? 'text-neon-green' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(0)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5">
                        <h4 className="font-bold mb-4 text-sm text-muted">Spending Breakdown</h4>
                        <div className="space-y-3">
                            {categoryData.slice(0, 4).map((item) => (
                                <div key={item.name} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted">{item.name}</span>
                                        <span>${item.value}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-neon-purple"
                                            style={{ width: `${(item.value / totalExpenses) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}

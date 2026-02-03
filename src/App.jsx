import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import HealthTracker from './pages/HealthTracker'
import FinanceTracker from './pages/FinanceTracker'
import AcademicTracker from './pages/AcademicTracker'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="health" element={<HealthTracker />} />
          <Route path="finance" element={<FinanceTracker />} />
          <Route path="academic" element={<AcademicTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

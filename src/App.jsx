import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import { TransactionProvider } from './components/TransactionContext';
import { CurrencyProvider } from "./components/CurrencyContext";

export default function App() {
  return (
    <TransactionProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </TransactionProvider>
  );
}
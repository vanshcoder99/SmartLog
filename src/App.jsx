import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import { TransactionProvider } from './components/TransactionContext';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from "./components/CurrencyContext";
import AboutPage from './components/AboutPage';

export default function App() {

  return (
    <TransactionProvider>
      <CurrencyProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </TransactionProvider>
  );
}
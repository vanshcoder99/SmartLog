
import { Plus, TrendingUp, TrendingDown, Wallet, IndianRupee, Calendar, Tag, Filter, Search, Eye, EyeOff, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Trash2, Download, Moon, Sun, Target } from "lucide-react";

import { useTransactions } from "./TransactionContext";
import { useCurrency } from "./CurrencyContext";
import { useState, useEffect } from "react";
import AddTransactionModal from "./AddTransactionModal";
 import EnhancedEmptyState from "./EnhancedEmptyState";

import ConfirmationModal from "./ConfirmationModal";
import Footer from "./Footer";
// Download imports
import { PDFDownloadLink } from "@react-pdf/renderer";
import TransactionPDF from "./TransactionPDF";
import { Link } from "react-router-dom";

export default function Dashboard() {

  const { transactions, income, expense, setTransactions, deleteTransaction } = useTransactions();
  const [showModal, setShowModal] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("date-desc");

  const [animatedValues, setAnimatedValues] = useState({ income: 0, expense: 0, balance: 0 });
  const { currency, locale, setCurrency, setLocale } = useCurrency();
  
  const currencies = [
    { code: "INR", locale: "en-IN", symbol: "₹" },
    { code: "USD", locale: "en-US", symbol: "$" },
    { code: "EUR", locale: "de-DE", symbol: "€" },
    { code: "BRL", locale: "pt-BR", symbol: "R$" },
    { code: "JPY", locale: "ja-JP", symbol: "¥" },
  ];

  const currentIndex = currencies.findIndex((c) => c.code === currency);
  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

  const handleChange = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % currencies.length
        : (currentIndex - 1 + currencies.length) % currencies.length;

    const next = currencies[newIndex];
    setCurrency(next.code);
    setLocale(next.locale);
  };

  // New function for dropdown currency selection
  const handleCurrencySelect = (e) => {
    const selectedCode = e.target.value;
    const selectedCurrency = currencies.find(c => c.code === selectedCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency.code);
      setLocale(selectedCurrency.locale);
    }
  };

  const symbol = currentCurrency.symbol;

  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const balance = income - expense;
  const defaultCategories = ["Food", "Entertainment", "Utilities", "Income", "Transport", "Shopping", "Health", "Education"];
  const categories = ["All", ...new Set(transactions.map(t => t.category))];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleDelete = id => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteTransaction(transactionToDelete);

    setShowDeleteModal(false)
    setTransactionToDelete(null)
  }

  useEffect(() => {
    setIsVisible(true);
    const duration = 2000;
    const steps = 60;
    const incomeStep = income / steps;
    const expenseStep = expense / steps;
    const balanceStep = balance / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValues({
        income: Math.floor(incomeStep * currentStep),
        expense: Math.floor(expenseStep * currentStep),
        balance: Math.floor(balanceStep * currentStep),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({ income, expense, balance });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [income, expense, balance]);

  // Function to parse date string "DD/MM/YYYY" into a Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed in Date constructor
  };

  const filteredAndSortedTransactions = transactions
    .filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting logic based on sortCriteria
      if (sortCriteria === "date-desc") {
        return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      } else if (sortCriteria === "date-asc") {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      } else if (sortCriteria === "amount-desc") {
        return b.amount - a.amount;
      } else if (sortCriteria === "amount-asc") {
        return a.amount - b.amount;
      }
      return 0; // Default no sort
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = category => {
    const icons = {
      Food: "🍽️",
      Entertainment: "🎬",
      Utilities: "⚡",
      Income: "💰",
      Transport: "🚗",
      Shopping: "🛍️",
      Health: "🏥",
      Education: "📚",
      Savings: "🏦",
    };

    return icons[category] || "📝";
  };
  // To prevent scrolling background when transaction forms open up
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);


  const maxAmount = Math.max(1, ...transactions.map(t => t.amount));

  const convertToCSV = (transactions) => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => {
      const note = t.note.includes(',') ? `"${t.note}"` : t.note;
      return [t.date, t.type, t.category, t.amount, note]
    })

    const headerRow = headers.join(',')
    const rowStrings = rows.map(r => 
      r.join(',')
    )

    return [headerRow, ...rowStrings].join('\n')
  }

  const downloadCSV = (csvString) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.href = url;
    link.download = 'transactions.csv';
    link.click()
    URL.revokeObjectURL(url);
  }

  const handleExportCSV = () => {
    const s = convertToCSV(transactions)
    downloadCSV(s)
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
      : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900"
      }`}>
      <main className="flex-1 w-full p-6 mb-40">
        <div className="max-w-6xl mx-auto">

          <div className="flex justify-between items-start mb-2">
            <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h2>
              <p className={`transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"
                } mb-8`}>
                Track your financial journey with smart insights
              </p>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${darkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <Link to="/income-history">
              <div
                className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${
                  hoveredCard === "income" ? "shadow-2xl shadow-green-200" : "shadow-lg"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  animationDelay: "0.2s",
                }}
                onMouseEnter={() => setHoveredCard("income")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-4 right-4">
                  <TrendingUp className="w-8 h-8 text-white/80" />
                </div>
                <div className="text-white/80 text-sm font-medium mb-2">Total Income</div>
                <div className="text-3xl font-black text-white mb-1">
                  {formatCurrency(animatedValues.income)}
                </div>
                <div className="text-white/60 text-xs">+12% from last month</div>
               
              </div>
            </Link>


            {/* Expense Card */}
            <Link to="/expense-history" className="block">
              <div
               className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === "expense" ? "shadow-2xl shadow-red-200" : "shadow-lg"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  borderRadius: 20,
                  background: "#ed0f0fff",
                  boxShadow: "2px 2px 6px #ee3c3cff, -2px -2px 6px #e20a0aff",
                  animationDelay: "0.4s",
                }}
                onMouseEnter={() => setHoveredCard("expense")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-4 right-4">
                  <TrendingDown className="w-8 h-8 text-white/80" />
                </div>
                <div className="text-white/80 text-sm font-medium mb-2">Total Expense</div>
                <div className="text-3xl font-black text-white mb-1">{formatCurrency(animatedValues.expense)}</div>
                <div className="text-white/60 text-xs">-5% from last month</div>
               
              </div>
            </Link>


            {/* Balance Card */}
            <div
              className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === "balance" ? "shadow-2xl shadow-blue-200" : "shadow-lg"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                animationDelay: "0.6s",
              }}
              onMouseEnter={() => setHoveredCard("balance")}
              onMouseLeave={() => setHoveredCard(null)}>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button onClick={() => setShowBalance(!showBalance)} className="text-white/80 hover:text-white transition-colors">
                  {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                </button>
                <Wallet className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-white/80 text-sm font-medium mb-2">Current Balance</div>
              <div className="text-3xl font-black text-white mb-1">{showBalance ? formatCurrency(animatedValues.balance) : "••••••"}</div>
              <div className={`text-xs ${balance >= 0 ? "text-green-200" : "text-red-200"}`}>{balance >= 0 ? "✓ Healthy balance" : "⚠ Monitor spending"}</div>
            </div>
          </div>

          <div
            className={`flex flex-col md:flex-row gap-4 mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ animationDelay: "0.8s" }}>

            <Link
              to="/goals"
              className="group relative bg-gradient-to-r from-green-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 cursor-pointer"
            >
              <Target className="w-5 h-5 transition-transform group-hover:rotate-12" />
              View Goals
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 cursor-pointer">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Add Transaction
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 backdrop-blur-sm ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-900"
                  : "bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
              />
            </div>

            <div className="relative min-w-[100px]">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <select
                value={selectedCategory}

                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-12 pr-11 py-4 rounded-2xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer relative z-0 ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-900"
                  : "bg-white/80 border-gray-200 text-gray-900"
                  }`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getTransactionIcon(category)} {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
            </div>

            {/* Sorting Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                className={`w-full pl-4 pr-8 py-4 rounded-2xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer relative z-0 ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-900"
                  : "bg-white/80 border-gray-200 text-gray-900"
                  }`}
              >
                <option value="date-desc">Sort by Date (Newest)</option>
                <option value="date-asc">Sort by Date (Oldest)</option>
                <option value="amount-desc">Sort by Amount (Highest)</option>
                <option value="amount-asc">Sort by Amount (Lowest)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
            </div>

            {/* Currency Dropdown */}
            <div className="relative w-[100px]">
              <select
                value={currency}
                onChange={handleCurrencySelect}
                className={`w-full pl-4 pr-8 py-4 rounded-2xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer relative z-0 ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-900"
                  : "bg-white/80 border-gray-200 text-gray-900"
                  }`}
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
            </div>

            
          </div>

          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "1s" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-3">
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${darkMode ? "text-gray-100" : "text-gray-800"
                }`}>
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Recent Transactions
                <span className={`text-sm font-normal px-3 py-1 rounded-full ${darkMode ? "text-gray-300 bg-gray-700" : "text-gray-500 bg-gray-100"
                  }`}>
                  {filteredAndSortedTransactions.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
              {transactions.length > 0 && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer"
                  onClick={handleExportCSV}                  
                >
                  <Download className="h-5 w-5" />
                  Download Transactions in CSV
                </button>
              )}

              {transactions.length > 0 && (
                <PDFDownloadLink document={<TransactionPDF transactions={transactions} />} fileName="Transaction-History.pdf">
                  {() => (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer">
                      <Download className="h-5 w-5" />
                      Download Transactions History
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
            </div>

            <div className="space-y-4">
              {filteredAndSortedTransactions.map((transaction, index) => (
                <div
                key={transaction.id}
                className={`group p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white/80 border-gray-100 hover:border-gray-200"
                }`}
                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                        transaction.type === "Income"
                          ? "bg-green-100 text-green-600 group-hover:bg-green-200"
                          : "bg-red-100 text-red-600 group-hover:bg-red-200"
                      } group-hover:scale-110 transition-all duration-300 ${
                        darkMode
                          ? transaction.type === "Income"
                            ? "dark:bg-green-900/30 dark:text-green-400 group-hover:dark:bg-green-900/50"
                            : "dark:bg-red-900/30 dark:text-red-400 group-hover:dark:bg-red-900/50"
                          : ""
                      }`}
                    >
                      {getTransactionIcon(transaction.category)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div
                        className={`font-bold group-hover:text-blue-600 transition-colors duration-300 ${
                          darkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {transaction.note?.trim()
                          ? transaction.note
                          : transaction.type === "Income"
                          ? "Money added 🎉"
                          : "Money deducted 😯"}
                      </div>

                      <div
                        className={`flex flex-wrap items-center gap-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Tag className="w-4 h-4" />
                        {transaction.category}
                        <Calendar className="w-4 h-4 ml-2" />
                        {(() => {
                          const [dd, mm, yyyy] = transaction.date.split("/");
                          return `${dd}/${mm}/${yyyy}`;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                    <div
                      className={`text-xl sm:text-2xl font-black group-hover:scale-110 transition-transform duration-300 ${
                        transaction.type === "Expense"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {transaction.type === "Expense" ? "- " : "+ "}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className={`transition-colors ${
                        darkMode
                          ? "text-gray-500 hover:text-red-500"
                          : "text-gray-400 hover:text-red-600"
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div
                  className={`mt-4 h-1 rounded-full overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      transaction.type === "Income"
                        ? "bg-green-400 dark:bg-green-500"
                        : "bg-red-400 dark:bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (transaction.amount / maxAmount) * 100,
                        100
                      )}%`,
                      animationDelay: `${1.5 + index * 0.1}s`,
                    }}
                  ></div>
                </div>
              </div>
              ))}
            </div>
     {transactions.length === 0 && (
  <div className="text-center mb-8">
    {/* Styled Heading */}
    <h2 className="inline-block px-6 py-3 mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full shadow-lg backdrop-blur-md border border-white/20">
      🚀 No Transactions Yet — Let’s Get Started!
    </h2>

    <EnhancedEmptyState onAddTransaction={() => setShowModal(true)} />
  </div>
)}


      
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transform transition-all duration-500 ease-in-out ${
          showScrollTop
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-16 opacity-0 scale-75 pointer-events-none"
        } ${
          darkMode
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-blue-900/25"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-blue-200"
        } hover:scale-110 hover:-translate-y-1 group`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </button>

      <Footer />

      <AddTransactionModal showModal={showModal} setShowModal={setShowModal} darkMode={darkMode} />
      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={"Confirm Deletion"}
        message={'Are you sure you want to delete this transaction? This action cannot be undone.'}
        darkMode={darkMode}
      />

      <style jsx>{`
        @keyframes expandWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

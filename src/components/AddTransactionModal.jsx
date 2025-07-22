const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

import { useState, useEffect } from 'react';
import { useTransactions } from './TransactionContext';
import toast from 'react-hot-toast';

export default function AddTransactionModal({ showModal = true, setShowModal = () => {} }) {
  const { addTransaction } = useTransactions();
  const [form, setForm] = useState({
    amount: '',
    category: '',
    type: 'Expense',
    date: formatDate(new Date()),
    note: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    }
  }, [showModal]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!form.category.trim()) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    

    await new Promise(resolve => setTimeout(resolve, 800));
    
    addTransaction({
      ...form,
      id: Date.now(),
      amount: parseFloat(form.amount)
    });
    
      toast.success('Transaction Added Successfully!');

    setForm({
      amount: '',
      category: '',
      type: 'Expense',
      date: formatDate(new Date()),
      note: ''
    });
    setErrors({});
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const handleInputChange = (field, value) => {
    let newValue = value;
    if (field === 'date') {
      newValue = formatDate(value);
    }
    setForm({ ...form, [field]: newValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!showModal) return null;

  return (
    <div 
      className={`fixed inset-0 w-full h-screen bg-black transition-opacity duration-300 z-50 overflow-y-auto ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div className="flex items-center justify-center min-h-full p-4 py-8">
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 my-auto ${
            isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
         
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add Transaction</h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

       
          <div className="p-6 space-y-6">
           
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm animate-pulse">{errors.amount}</p>}
            </div>


            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="e.g., Food, Transport, Entertainment"
              />
              {errors.category && <p className="text-category text-sm animate-pulse">{errors.category}</p>}
            </div>

    
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Type</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {['Income', 'Expense'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      form.type === type
                        ? type === 'Income' 
                          ? 'bg-green-500 text-white shadow-md transform scale-105'
                          : 'bg-red-500 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

           
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={
                  (() => {
                    
                    const [dd, mm, yyyy] = form.date.split('/');
                    return `${yyyy}-${mm}-${dd}`;
                  })()
                }
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm animate-pulse">{errors.date}</p>}
            </div>

            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Note (Optional)</label>
              <textarea
                value={form.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300"
                placeholder="Add a note about this transaction..."
              />
            </div>

         
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSubmitting
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Plus, BarChart2, TrendingUp, TrendingDown, Calendar, Tag, BookOpen, Dumbbell, Check, Circle } from 'lucide-react';

const HabitTracker = () => {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      title: 'Streak',
      value: '0',
      icon: <Clock className="w-8 h-8 text-white/80" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#10b981'
    },
    {
      title: 'Success Rate',
      value: '0%',
      icon: <TrendingUp className="w-8 h-8 text-white/80" />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#3b82f6'
    },
    {
      title: 'Days Missed',
      value: '0',
      icon: <TrendingDown className="w-8 h-8 text-white/80" />,
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)',
      color: '#f43f5e'
    }
  ];



  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 font-space">
            Habit Tracker
          </h1>
          <p className="text-gray-600 mb-8 font-inter">Track and improve your daily habits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${
                hoveredCard === stat.title ? 'shadow-2xl shadow-green-200' : 'shadow-lg'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                background: stat.gradient,
                animationDelay: `${0.2 + index * 0.1}s`
              }}
              onMouseEnter={() => setHoveredCard(stat.title)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className="text-white w-12 h-12 rounded-full flex items-center justify-center bg-white/10">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 font-space">My Habits</h2>
            <button
              onClick={() => setShowAddHabit(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 font-inter"
            >
              <Plus className="w-5 h-5" />
              Add New Habit
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center text-gray-500">
              <p className="mb-4">No habits added yet</p>
              <p>Start tracking your habits today!</p>
            </div>
          </div>
        </div>
      </div>

      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Habit</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;

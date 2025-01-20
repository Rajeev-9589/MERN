import React, { useState, useEffect } from 'react';
import RandomChart from './RandomChart';
import PieChart from './PieChart';
import axios from 'axios';
import ExpenseBarChart from './ExpenseBarChart';
import { auth } from '../services/firebase';
import Loading from './images/Pulse-1s-200px.gif'


function Dashboard({ userData, setIsAuthenticated,setIsLoading,isLoading }) {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [addedAmount, setAddedAmount] = useState('');
  const [addedAmountDate, setAddedAmountDate] = useState('');
  const [from, setFrom] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [tag, setTag] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [addedMoney, setAddedMoney] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [insights, setInsights] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [UserId, setUserId] = useState(0);

 

  useEffect(() => {
    async function fetchData() {
      const idToken = await auth.currentUser.getIdToken(true);
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5500/alltransaction', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const transactions = response.data.transactions || {};
        const { expenses = [], addedMoney = [] } = transactions;
  
        setExpenses(expenses);
        setAddedMoney(addedMoney);
        setUserId(userData.uid);
  
        // Calculate total income and expenses
        const totalIncome = addedMoney.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  
        setTotalIncome(totalIncome);
        setTotalExpenses(totalExpenses);
        generateInsights(totalIncome, totalExpenses);
        setIsLoading(false);
      } catch (error) {
        alert("Server Error, Please try again later!")
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [refreshKey, setIsLoading, userData.uid]);  // Added setIsLoading and userData.uid to the dependency array
  

  const generateInsights = (income, expenses) => {
    if (income > expenses) {
      setInsights(`You have a surplus of ₹${income - expenses}. Great job managing your finances!`);
    } else if (income < expenses) {
      setInsights(`You have a deficit of ₹${expenses - income}. Consider reviewing your expenses.`);
    } else if (income === 0 && expenses === 0) {
      setInsights(`Add data to get insights.`);
    }
  };

  const handleAddMoney = async () => {
    try {
      setIsLoading(true);
      const sentData = await axios.post('http://localhost:5500/addMoney', {
        amount: addedAmount,
        from,
        date: addedAmountDate,
        userId: UserId
      });
      console.log(sentData);
      setIsIncomeModalOpen(false);
      setRefreshKey((prev) => prev + 1); // Trigger refresh
      setIsLoading(false)

    } catch (error) {
      alert(error);
    }
  };

  const handleExpense = async () => {

    try {
      setIsLoading(true);
      const sentData = await axios.post('http://localhost:5500/addExpense', {
        tag: tag,
        amount: expenseAmount,
        date: expenseDate,
        userId: UserId
      });
      console.log(sentData);
      setIsExpenseModalOpen(false);
      setRefreshKey((prev) => prev + 1); // Trigger refresh
      setIsLoading(false);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      setIsLoading(true)

      if (type === 'expense') {
        const response = await axios.delete(`http://localhost:5500/deleteExpense/${id}`);
        console.log(response.data.message);
      } else {
        const response = await axios.delete(`http://localhost:5500/deleteMoney/${id}`);
        console.log(response.data.message);
      }
      setRefreshKey((prev) => prev + 1); // Trigger refresh
      setIsLoading(false)

    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  const handleLogout = async () => {
    
    try {
      setIsLoading(true);
      // Sign out the user from Firebase
      await auth.signOut();
      alert('User logged out');

      // Optionally, redirect the user to the login page or home page
      window.location.href = '/login'; // Or use React Router to navigate (e.g., navigate('/login'))

      // Clear any locally stored session data (if needed)
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      // Update any app states 
      setIsAuthenticated(false);  // using state management to track authentication
      setIsLoading(true);

    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-1 w-screen h-screen bg-gray-50 text-gray-800 overflow-hidden">
       {isLoading && (
        <div className="overlay">
          <img src={Loading} alt="Loading..." />
        </div>
      )}
      {/* Left Section */}
      <div className="flex flex-col items-center justify-between bg-white shadow-md rounded-lg p-6 lg:w-1/2 h-full space-y-1">
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm border border-blue-200 h-20">
          <div className="flex items-center">
            <img
              src={userData.photoURL}
              alt="User Avatar"
              className="rounded-full w-16 h-16 object-cover border border-blue-500"
            />
            <h1 className="ml-4 text-lg font-semibold text-blue-700">Welcome, {userData.displayName}!</h1>
          </div>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 " onClick={handleLogout}>
            Logout
          </button>
        </div>




        {/* Chart Section */}
        <div className="flex items-center justify-center bg-blue-100 w-full h-1/3 rounded-lg shadow">
          {expenses.length === 0 && addedMoney.length === 0 ? (
            <p className="text-gray-500">Add transaction & analyze</p>
          ) : (
            <RandomChart key={refreshKey} setIsLoading={setIsLoading} />)}
        </div>
        <div className="flex items-center justify-center bg-red-100 w-full h-1/3 rounded-lg shadow">
          {expenses.length === 0 && addedMoney.length === 0 ? (
            <p className="text-gray-500">Add transactions & analyze</p>
          ) : (
            <ExpenseBarChart key={refreshKey} setIsLoading={setIsLoading}/>)}
        </div>
        {/* Action Section */}
        <div className="w-full bg-gradient-to-r from-red-50 via-yellow-50 to-blue-50 p-2 h-1/3 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-700 mb-3 border-b border-gray-300 pb-1">
            Actions
          </h2>
          <div className="flex justify-between gap-3">
            <button
              className="flex-1 py-2 text-sm font-medium bg-red-500 text-white rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={() => setIsExpenseModalOpen(true)}
            >
              + Expense
            </button>
            <button
              className="flex-1 py-2 text-sm font-medium bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onClick={() => setIsIncomeModalOpen(true)}
            >
              + Income
            </button>
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 lg:w-1/2 h-full space-y-6">
        <div className="w-full bg-blue-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Income vs. Expense</h2>
          <div className="w-full h-56 flex items-center justify-center bg-white rounded-lg shadow">
            {expenses.length === 0 && addedMoney.length === 0 ? (
              <p className="text-gray-500">Add transactions & analyze.</p>
            ) : (
              <PieChart key={refreshKey} setIsLoading={setIsLoading} />)}
          </div>
        </div>
        {/* Summary Section */}
        <div className="w-full bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 h-1/2 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-blue-900 mb-4">Summary</h1>
          <div className="flex space-x-2">
            <p className="text-sm text-gray-800 font-medium">
              Total Income: <span className="font-semibold text-green-600">₹{totalIncome}</span>
            </p>
            <p className="text-sm text-gray-800 font-medium">
              Total Expenses: <span className="font-semibold text-red-600">₹{totalExpenses}</span>
            </p>
          </div>
          <div className="mt-2 bg-white p-2 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Insights</h2>
            <p className="text-gray-700 text-base">{insights}</p>
          </div>
        </div>

      </div>

      {/* Modal for Adding Income */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Income</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="incomeName" className="block text-gray-700 font-medium">
                  From
                </label>
                <input
                  type="text"
                  id="incomeName"
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter income name"
                />
              </div>
              <div>
                <label htmlFor="incomeAmount" className="block text-gray-700 font-medium">
                  Amount
                </label>
                <input
                  type="number"
                  id="incomeAmount"
                  onChange={(e) => setAddedAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label htmlFor="incomeDate" className="block text-gray-700 font-medium">
                  Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setAddedAmountDate(e.target.value)}
                  id="incomeDate"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 focus:outline-none"
                onClick={() => setIsIncomeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={handleAddMoney}
              >
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Expense</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="expenseName" className="block text-gray-700 font-medium">
                  Tag
                </label>
                <input
                  type="text"
                  id="expenseName"
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Enter expense name"
                />
              </div>
              <div>
                <label htmlFor="expenseAmount" className="block text-gray-700 font-medium">
                  Amount
                </label>
                <input
                  type="number"
                  id="expenseAmount"
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label htmlFor="expenseDate" className="block text-gray-700 font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="expenseDate"
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 focus:outline-none"
                onClick={() => setIsExpenseModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={handleExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 lg:w-1/2 h-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Transaction History</h2>
        <div className="w-full h-full bg-green-50 rounded-lg shadow p-4 overflow-y-auto">
          {expenses.length === 0 && addedMoney.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-4">
              {/* Expenses Section */}
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Expenses</h3>
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white p-4 rounded-lg shadow-md border border-red-300 flex justify-between items-center"
                  >
                    <span className="text-red-800 font-medium">{expense.tag}</span>
                    <span className="text-red-600">₹{expense.amount}</span>
                    <span className="text-gray-500 text-sm">{expense.date}</span>
                    {/* Delete Button */}
                    <button
                      className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleDelete(expense.id, "expense")}
                    >
                      Delete
                    </button>

                  </div>
                ))}
              </div>

              {/* Added Money Section */}
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Added Money</h3>
                {addedMoney.map((money) => (
                  <div
                    key={money.id}
                    className="bg-white p-4 rounded-lg shadow-md border border-green-300 flex justify-between items-center"
                  >
                    <span className="text-green-800 font-medium">{money.from}</span>
                    <span className="text-green-600">₹{money.amount}</span>
                    <span className="text-gray-500 text-sm">{money.date}</span>
                    {/* Delete Button */}
                    <button
                      className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleDelete(money.id, "money")}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { auth } from '../services/firebase';
// Register required modules for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ExpenseBarChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const idToken = await auth.currentUser.getIdToken(true);
        try {
          const response = await axios.get('http://localhost:5500/alltransaction', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
        const data = await response.data;

        if (data.transactions && data.transactions.expenses) {
          const aggregatedData = processMonthlyExpenses(data.transactions.expenses);
          setChartData(aggregatedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processMonthlyExpenses = (expenses) => {
    const monthlyExpenses = {};

    expenses.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const amount = parseFloat(transaction.amount) || 0;
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + amount;
    });

    const sortedMonths = Object.keys(monthlyExpenses).sort();

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Total Expenses',
          data: sortedMonths.map((month) => monthlyExpenses[month]),
          backgroundColor: '#FF6384',
          borderColor: '#B91C1C',
          borderWidth: 1,
        },
      ],
    };
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Bar data={chartData} />
    </div>
  );
}

export default ExpenseBarChart;

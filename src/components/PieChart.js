import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { auth } from '../services/firebase';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const idToken = await auth.currentUser.getIdToken(true);
      try {
        const response = await axios.get('http://localhost:5500/alltransaction', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const { expenses, addedMoney } = response.data.transactions;

        // Aggregate expenses by tag
        const expenseData = expenses.reduce((acc, expense) => {
          acc[expense.tag] = (acc[expense.tag] || 0) + parseFloat(expense.amount);
          return acc;
        }, {});

        // Prepare chart labels and data
        const labels = [...Object.keys(expenseData), 'Added Money'];
        const data = [...Object.values(expenseData), 
          addedMoney.reduce((sum, money) => sum + parseFloat(money.amount), 0)];

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                '#F87171', // Red
                '#60A5FA', // Blue
                '#34D399', // Green
                '#FBBF24', // Yellow
                '#A78BFA', // Purple
              ],
              borderColor: [
                '#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchData();
  }, []);

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      {chartData ? <Pie data={chartData} options={options} /> : <p>Loading...</p>}
    </div>
  );
}

export default PieChart;

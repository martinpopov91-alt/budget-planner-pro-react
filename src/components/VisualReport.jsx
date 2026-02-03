import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VisualReport({ budgetData, actualData }) {
  const categories = ['Bills', 'Expenses', 'Debt', 'Savings'];

  const getTotal = (dataObj, section) => {
    if (!dataObj[section]) return 0;
    return Object.values(dataObj[section]).reduce((sum, val) => sum + Number(val), 0);
  };

  const budgetTotals = categories.map(cat => getTotal(budgetData, cat));
  const actualTotals = categories.map(cat => actualData(cat));

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: budgetTotals,
        backgroundColor: '#334155', // Dark Grey-Blue
        borderRadius: 4, // Rounded bars
        barPercentage: 0.6,
      },
      {
        label: 'Actual',
        data: actualTotals,
        backgroundColor: (context) => {
          const cat = context.chart.data.labels[context.dataIndex];
          // Dynamic Colors
          if (cat === 'Savings') return '#f59e0b'; // Gold
          if (cat === 'Debt') return '#ef4444';    // Red
          return '#3b82f6'; // Blue
        },
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', usePointStyle: true } },
      title: { display: false }, // Cleaner without title
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#64748b', font: {size: 11} }, 
        grid: { color: '#334155', drawBorder: false, borderDash: [5, 5] } // Dashed lines
      },
      x: { 
        ticks: { color: '#94a3b8', font: {weight: 'bold'} }, 
        grid: { display: false } 
      },
    },
  };

  return (
    <div className="summary-card" style={{ height: '350px', padding: '25px' }}>
      <div style={{marginBottom: '20px'}}>
        <h3>Financial Overview</h3>
      </div>
      <div style={{flex: 1, minHeight: 0}}> {/* Fix for ChartJS resizing */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default VisualReport;
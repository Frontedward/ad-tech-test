import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import data from './list.json';
import Chart from 'chart.js/auto';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const chartRef = useRef(null);

  // вычисление индексов начала и конца текущей страницы
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // функция для изменения текущей страницы
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    // создание графика возрастов
    const ages = currentItems.map(item => item.age);
    const ageLabels = Array.from(new Set(ages)).sort((a, b) => a - b);
    const ageCounts = ageLabels.map(age => ages.filter(a => a === age).length);

    const ctx = document.getElementById('ageChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ageLabels,
        datasets: [
          {
            label: 'Persons same age',
            data: ageCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  }, [currentItems]);

  return (
    <div className="App">
      <div className="table-container">
        <div className="custom-table">
          <div className="table-row header-row">
            <div className="table-cell bold-gray left-align">IsActive</div> 
            <div className="table-cell bold-gray right-align">Name</div>
            <div className="table-cell bold-gray right-align">Gender</div>
            <div className="table-cell bold-gray right-align">Balance</div>
            <div className="table-cell bold-gray right-align">Company</div>
            <div className="table-cell bold-gray right-align">Email</div>            
          </div>          

          {currentItems.map(item => (
            <div className="table-row" key={item.id}>
              <div className="table-cell left-align horizontal-line">{item.isActive ? 'Yes' : 'No'}</div>
              <div className="table-cell right-align horizontal-line">{item.name}</div>
              <div className="table-cell right-align horizontal-line">{item.gender}</div>
              <div className="table-cell right-align horizontal-line">{item.balance}</div>
              <div className="table-cell right-align horizontal-line">{item.company}</div>
              <div className="table-cell right-align horizontal-line">{item.email}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      <canvas id="ageChart"></canvas>
    </div>
  );
}

export default App;

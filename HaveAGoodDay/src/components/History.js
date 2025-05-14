import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './History.css';
import { format } from 'date-fns';

const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodHistory, setMoodHistory] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Mood',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.4,
      fill: false
    }]
  });
  
  // Add state for mood entries with notes
  const [moodEntries, setMoodEntries] = useState([]);
  
  useEffect(() => {
    // Load mood data for selected date
    loadMoodForDate(selectedDate);
  }, [selectedDate]);
  
  const loadMoodForDate = (date) => {
    // Format date to YYYY-MM-DD for comparison
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    
    // Get mood data from localStorage
    const allMoodData = JSON.parse(localStorage.getItem('moodData') || '[]');
    
    // Filter entries for the selected date
    const entriesForDate = allMoodData.filter(entry => {
      const entryDate = format(new Date(entry.timestamp), 'yyyy-MM-dd');
      return entryDate === selectedDateStr;
    });
    
    // Sort entries by time
    entriesForDate.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Store entries with notes
    setMoodEntries(entriesForDate);
    
    // Update chart data
    const labels = entriesForDate.map(entry => format(new Date(entry.timestamp), 'HH:mm'));
    const data = entriesForDate.map(entry => entry.moodValue);
    
    setChartData({
      labels,
      datasets: [{
        label: 'Mood',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        fill: false
      }]
    });
  };
  
  return (
    <div className="history-view">
      <h2>Mood History</h2>
      
      <div className="date-selector">
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          maxDate={new Date()}
          inline
        />
      </div>
      
      <div className="chart-container">
        <Line data={chartData} options={{
          scales: {
            y: {
              min: -10,
              max: 10,
              ticks: {
                stepSize: 2
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Mood for ${selectedDate.toLocaleDateString()}`
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        }} />
      </div>
      
      {/* Add mood entries with notes */}
      <div className="mood-entries-list">
        <h3>Mood Log Entries</h3>
        {moodEntries.length === 0 ? (
          <p>No mood entries for this date.</p>
        ) : (
          <ul className="entry-list">
            {moodEntries.map((entry, index) => (
              <li key={index} className="entry-item">
                <div className="entry-time">
                  {format(new Date(entry.timestamp), 'HH:mm')}
                </div>
                <div className="entry-mood">
                  <span className="mood-label">Mood: </span>
                  <span className="mood-value">{entry.moodValue}</span>
                </div>
                {entry.notes && (
                  <div className="entry-notes">
                    <p>{entry.notes}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default History; 
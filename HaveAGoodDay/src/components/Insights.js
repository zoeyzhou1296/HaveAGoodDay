import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './Insights.css';

const Insights = () => {
  const [moodPatterns, setMoodPatterns] = useState({});
  const [happinessFactors, setHappinessFactors] = useState([]);
  const [sadnessFactors, setSadnessFactors] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [moodNotes, setMoodNotes] = useState({
    high: [],  // Notes from high mood entries
    medium: [], // Notes from neutral mood entries
    low: []     // Notes from low mood entries
  });
  
  useEffect(() => {
    // Analyze mood data for the selected time range
    analyzeMoodData(timeRange);
  }, [timeRange]);
  
  const analyzeMoodData = (range) => {
    // Get all mood data
    const allMoodData = JSON.parse(localStorage.getItem('moodData') || '[]');
    
    // Filter by time range
    const now = new Date();
    const rangeMap = {
      'week': 7,
      'month': 30,
      'year': 365
    };
    
    const daysToSubtract = rangeMap[range] || 7;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    const filteredData = allMoodData.filter(entry => 
      new Date(entry.timestamp) >= startDate
    );
    
    // Categorize notes by mood level
    const highMoods = filteredData.filter(entry => entry.moodValue > 5);
    const mediumMoods = filteredData.filter(entry => entry.moodValue >= -5 && entry.moodValue <= 5);
    const lowMoods = filteredData.filter(entry => entry.moodValue < -5);
    
    setMoodNotes({
      high: highMoods.map(entry => entry.notes).filter(note => note && note.trim().length > 0),
      medium: mediumMoods.map(entry => entry.notes).filter(note => note && note.trim().length > 0),
      low: lowMoods.map(entry => entry.notes).filter(note => note && note.trim().length > 0)
    });
    
    // Perform pattern analysis on the data
    // ... existing pattern analysis ...
    
    // For demo purposes, set some sample happiness and sadness factors
    // In a real implementation, you would analyze the notes to extract these
    setHappinessFactors(['Exercise', 'Social time', 'Good food', 'Productivity', 'Nature']);
    setSadnessFactors(['Work stress', 'Poor sleep', 'Arguments', 'Bad weather', 'Financial worry']);
    
    // Set sample patterns for demo
    setMoodPatterns({
      weekdayTrend: "somewhat better on weekends",
      timeOfDayTrend: "best in the evening",
      volatility: "moderately variable"
    });
  };
  
  return (
    <div className="insights">
      <h2>Mood Insights</h2>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === 'week' ? 'active' : ''}
          onClick={() => setTimeRange('week')}
        >
          Past Week
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''}
          onClick={() => setTimeRange('month')}
        >
          Past Month
        </button>
        <button 
          className={timeRange === 'year' ? 'active' : ''}
          onClick={() => setTimeRange('year')}
        >
          Past Year
        </button>
      </div>
      
      <div className="pattern-summary">
        <h3>Mood Patterns</h3>
        <p>Based on your mood entries, here are some patterns we've noticed:</p>
        <ul>
          {moodPatterns.weekdayTrend && (
            <li>Your mood tends to be {moodPatterns.weekdayTrend} on weekdays.</li>
          )}
          {moodPatterns.timeOfDayTrend && (
            <li>You typically feel {moodPatterns.timeOfDayTrend}.</li>
          )}
          {moodPatterns.volatility && (
            <li>Your mood stability is {moodPatterns.volatility}.</li>
          )}
        </ul>
      </div>
      
      <div className="factors">
        <div className="happiness-factors">
          <h3>What Makes You Happy</h3>
          <ul>
            {happinessFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
        
        <div className="sadness-factors">
          <h3>What Might Cause Lower Moods</h3>
          <ul>
            {sadnessFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="average-mood-chart">
        <h3>Average Mood by Day</h3>
        <Bar 
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Average Mood',
              data: [2, 3, 1, -1, 4, 7, 5],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
          }} 
          options={{
            scales: {
              y: {
                min: -10,
                max: 10,
                ticks: {
                  stepSize: 2
                }
              }
            }
          }}
        />
      </div>
      
      <div className="recommendations">
        <h3>Recommendations</h3>
        <p>Based on your mood patterns, consider these suggestions:</p>
        <ul>
          <li>Schedule more outdoor activities in the mornings, when your mood tends to be higher.</li>
          <li>Consider journaling before bed to process feelings from challenging days.</li>
          <li>Your mood often improves after social interactions - try to connect with friends more regularly.</li>
        </ul>
      </div>
      
      <div className="mood-notes-analysis">
        <h3>Your Mood in Your Words</h3>
        
        <div className="mood-notes-categories">
          <div className="high-mood-notes">
            <h4>When You Felt Great</h4>
            {moodNotes.high.length === 0 ? (
              <p>No high mood entries with notes.</p>
            ) : (
              <ul>
                {moodNotes.high.slice(0, 3).map((note, index) => (
                  <li key={index}>"{note}"</li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="low-mood-notes">
            <h4>When Your Mood Was Lower</h4>
            {moodNotes.low.length === 0 ? (
              <p>No low mood entries with notes.</p>
            ) : (
              <ul>
                {moodNotes.low.slice(0, 3).map((note, index) => (
                  <li key={index}>"{note}"</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights; 
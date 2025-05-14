import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import './MoodLogger.css';

const MoodLogger = () => {
  const [moodData, setMoodData] = useState([]);
  const [currentMode, setCurrentMode] = useState('timeline'); // timeline, points, realtime
  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedTime, setBedTime] = useState('23:00');
  
  // Timeline mode variables
  const [timelineData, setTimelineData] = useState([]);
  
  // Point entry mode variables
  const [pointTime, setPointTime] = useState('');
  const [pointMood, setPointMood] = useState(0);
  
  // Chart data
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
  
  // Add context notes state
  const [contextNotes, setContextNotes] = useState('');
  const [pointNotes, setPointNotes] = useState('');
  const [realtimeNotes, setRealtimeNotes] = useState('');
  
  useEffect(() => {
    // Generate time labels based on wake and bed times
    generateTimeLabels();
    
    // Load previous mood data if available
    loadMoodData();
  }, [wakeTime, bedTime]);
  
  const generateTimeLabels = () => {
    // Generate labels for every hour between wake and bed time
    // ...
  };
  
  const loadMoodData = () => {
    // Load mood data from localStorage or API
    // ...
  };
  
  const handleTimelineDrawing = (e) => {
    // Handle drawing on the timeline
    // Calculate mood value based on cursor Y position
    // ...
  };
  
  const handlePointSubmit = (e) => {
    e.preventDefault();
    // Add the mood point and update the chart
    // ...
  };
  
  const saveMoodData = () => {
    // Determine which notes to use based on current mode
    let notesToSave = '';
    if (currentMode === 'timeline') {
      notesToSave = contextNotes;
    } else if (currentMode === 'points') {
      notesToSave = pointNotes;
    } else if (currentMode === 'realtime') {
      notesToSave = realtimeNotes;
    }
    
    // Create mood entry with timestamp, mood value, and notes
    const moodEntry = {
      timestamp: new Date().toISOString(),
      moodValue: currentMode === 'timeline' ? 
        calculateAverageMood() : 
        (currentMode === 'points' ? pointMood : parseInt(document.querySelector('.realtime-logging input[type="range"]').value)),
      notes: notesToSave,
      mode: currentMode
    };
    
    // Save to localStorage or send to API
    const existingData = JSON.parse(localStorage.getItem('moodData') || '[]');
    const updatedData = [...existingData, moodEntry];
    localStorage.setItem('moodData', JSON.stringify(updatedData));
    
    // Reset form fields if needed
    if (currentMode === 'points') {
      setPointTime('');
      setPointMood(0);
      setPointNotes('');
    } else if (currentMode === 'realtime') {
      setRealtimeNotes('');
    } else {
      setContextNotes('');
    }
    
    alert('Mood data saved successfully!');
  };
  
  return (
    <div className="mood-logger">
      <h2>Log Your Mood</h2>
      
      <div className="schedule-inputs">
        <label>
          Wake up time:
          <input 
            type="time" 
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
          />
        </label>
        <label>
          Bed time:
          <input 
            type="time" 
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
          />
        </label>
      </div>
      
      <div className="logging-modes">
        <button 
          className={currentMode === 'timeline' ? 'active' : ''}
          onClick={() => setCurrentMode('timeline')}
        >
          Draw Timeline
        </button>
        <button 
          className={currentMode === 'points' ? 'active' : ''}
          onClick={() => setCurrentMode('points')}
        >
          Enter Points
        </button>
        <button 
          className={currentMode === 'realtime' ? 'active' : ''}
          onClick={() => setCurrentMode('realtime')}
        >
          Real-time Log
        </button>
      </div>
      
      {currentMode === 'timeline' && (
        <div className="timeline-mode">
          <div 
            className="timeline-canvas"
            onMouseMove={handleTimelineDrawing}
            onMouseUp={() => {}}
          >
            <div className="mood-scale">
              <div>+10</div>
              <div>0</div>
              <div>-10</div>
            </div>
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
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Mood: ${context.parsed.y}`;
                    }
                  }
                }
              },
              responsive: true,
              maintainAspectRatio: false,
            }} />
          </div>
          
          <div className="context-notes-section">
            <h4>What's happening?</h4>
            <textarea
              value={contextNotes}
              onChange={(e) => setContextNotes(e.target.value)}
              placeholder="Describe what's affecting your mood right now..."
              rows={4}
            />
          </div>
        </div>
      )}
      
      {currentMode === 'points' && (
        <div className="point-entry">
          <form onSubmit={handlePointSubmit}>
            <label>
              Time:
              <input 
                type="time" 
                value={pointTime}
                onChange={(e) => setPointTime(e.target.value)}
                required
              />
            </label>
            <label>
              Mood (-10 to +10):
              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={pointMood}
                onChange={(e) => setPointMood(e.target.value)}
              />
              <span>{pointMood}</span>
            </label>
            <label>
              What happened at this time?
              <textarea
                value={pointNotes}
                onChange={(e) => setPointNotes(e.target.value)}
                placeholder="Describe what affected your mood at this time..."
                rows={4}
              />
            </label>
            <button type="submit">Add Point</button>
          </form>
          
          <Line data={chartData} options={{
            scales: {
              y: {
                min: -10,
                max: 10,
                ticks: {
                  stepSize: 2
                }
              }
            }
          }} />
        </div>
      )}
      
      {currentMode === 'realtime' && (
        <div className="realtime-logging">
          <p>Current time: {format(new Date(), 'HH:mm')}</p>
          <label>
            Current Mood (-10 to +10):
            <input 
              type="range" 
              min="-10" 
              max="10" 
              defaultValue="0"
              onChange={(e) => {
                // Add point at current time with this mood value
                // ...
              }}
            />
          </label>
          
          <div className="context-notes-section">
            <h4>What's happening right now?</h4>
            <textarea
              value={realtimeNotes}
              onChange={(e) => setRealtimeNotes(e.target.value)}
              placeholder="Describe what's affecting your mood right now..."
              rows={4}
            />
          </div>
          
          <Line data={chartData} options={{
            scales: {
              y: {
                min: -10,
                max: 10,
                ticks: {
                  stepSize: 2
                }
              }
            }
          }} />
        </div>
      )}
      
      <button className="save-button" onClick={saveMoodData}>
        Save Mood Data
      </button>
    </div>
  );
};

export default MoodLogger; 
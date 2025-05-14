from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
from datetime import datetime
from ai.pattern_analysis import MoodPatternAnalyzer

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze-mood', methods=['POST'])
def analyze_mood():
    data = request.get_json()
    user_id = data.get('userId')
    time_range = data.get('timeRange', 'week')
    
    # Load the user's mood data
    mood_data = load_user_mood_data(user_id, time_range)
    
    # Convert timestamps from strings to datetime objects
    for entry in mood_data:
        entry['timestamp'] = datetime.fromisoformat(entry['timestamp'])
    
    # Get context notes
    context_notes = [entry.get('notes', '') for entry in mood_data]
    
    # Initialize the analyzer
    analyzer = MoodPatternAnalyzer()
    
    # Preprocess the data
    processed_data = analyzer.preprocess_data(mood_data)
    
    # Identify patterns
    patterns = analyzer.identify_patterns(processed_data)
    
    # Identify factors affecting mood
    happy_factors, sad_factors = analyzer.identify_factors(processed_data, context_notes)
    
    # Generate recommendations based on patterns
    recommendations = generate_recommendations(patterns, happy_factors, sad_factors)
    
    return jsonify({
        'patterns': patterns,
        'happinessFactors': happy_factors,
        'sadnessFactors': sad_factors,
        'recommendations': recommendations
    })

def load_user_mood_data(user_id, time_range):
    # In a real app, this would query a database
    # For now, we'll assume reading from a local file
    # ...
    return []

def generate_recommendations(patterns, happy_factors, sad_factors):
    recommendations = []
    
    # Example logic for generating recommendations
    if patterns.get('weekdayTrend') == 'significantly better on weekends':
        recommendations.append("Try to incorporate more weekend-like activities into your weekdays.")
    
    if 'exercise' in happy_factors:
        recommendations.append("Regular exercise appears to boost your mood - consider making it a consistent part of your routine.")
    
    if 'lonely' in sad_factors:
        recommendations.append("Consider scheduling regular social activities to combat feelings of loneliness.")
    
    # Add more recommendation logic here
    
    return recommendations

if __name__ == '__main__':
    app.run(debug=True) 
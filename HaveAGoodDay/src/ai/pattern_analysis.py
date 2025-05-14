import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestRegressor

class MoodPatternAnalyzer:
    def __init__(self):
        self.model = None
        self.clusters = None
    
    def preprocess_data(self, mood_data):
        """
        Convert raw mood data into features for analysis
        """
        df = pd.DataFrame(mood_data)
        
        # Extract time features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
        
        # Calculate volatility
        df['mood_change'] = df['mood_value'].diff().abs()
        
        return df
    
    def identify_patterns(self, processed_data):
        """
        Find patterns in user's mood data
        """
        patterns = {}
        
        # Weekday vs Weekend analysis
        weekday_avg = processed_data[processed_data['weekend'] == 0]['mood_value'].mean()
        weekend_avg = processed_data[processed_data['weekend'] == 1]['mood_value'].mean()
        
        if weekend_avg - weekday_avg > 2:
            patterns['weekdayTrend'] = "significantly better on weekends"
        elif weekend_avg - weekday_avg > 0.5:
            patterns['weekdayTrend'] = "somewhat better on weekends"
        elif weekday_avg - weekend_avg > 2:
            patterns['weekdayTrend'] = "significantly better on weekdays"
        elif weekday_avg - weekend_avg > 0.5:
            patterns['weekdayTrend'] = "somewhat better on weekdays"
        else:
            patterns['weekdayTrend'] = "consistent throughout the week"
        
        # Time of day analysis
        morning_mood = processed_data[(processed_data['hour'] >= 6) & (processed_data['hour'] < 12)]['mood_value'].mean()
        afternoon_mood = processed_data[(processed_data['hour'] >= 12) & (processed_data['hour'] < 18)]['mood_value'].mean()
        evening_mood = processed_data[(processed_data['hour'] >= 18)]['mood_value'].mean()
        
        best_time = max([(morning_mood, "best in the morning"), 
                         (afternoon_mood, "best in the afternoon"),
                         (evening_mood, "best in the evening")])
        patterns['timeOfDayTrend'] = best_time[1]
        
        # Mood volatility
        avg_change = processed_data['mood_change'].mean()
        if avg_change > 4:
            patterns['volatility'] = "highly variable"
        elif avg_change > 2:
            patterns['volatility'] = "moderately variable"
        else:
            patterns['volatility'] = "relatively stable"
        
        return patterns
    
    def identify_factors(self, processed_data, context_notes):
        """
        Identify potential factors affecting mood
        """
        # This would ideally use NLP to analyze context notes
        # For now, a simple keyword-based approach
        happy_factors = []
        sad_factors = []
        
        # Example implementation
        happy_keywords = ['exercise', 'friends', 'outdoors', 'success', 'family']
        sad_keywords = ['stress', 'work', 'tired', 'conflict', 'lonely']
        
        for note, mood in zip(context_notes, processed_data['mood_value']):
            if mood > 5:  # High mood entry
                for keyword in happy_keywords:
                    if keyword.lower() in note.lower():
                        happy_factors.append(keyword)
            elif mood < -5:  # Low mood entry
                for keyword in sad_keywords:
                    if keyword.lower() in note.lower():
                        sad_factors.append(keyword)
        
        # Count occurrences and return top factors
        from collections import Counter
        top_happy = [factor for factor, _ in Counter(happy_factors).most_common(5)]
        top_sad = [factor for factor, _ in Counter(sad_factors).most_common(5)]
        
        return top_happy, top_sad

# Example usage:
# analyzer = MoodPatternAnalyzer()
# processed_data = analyzer.preprocess_data(user_mood_data)
# patterns = analyzer.identify_patterns(processed_data)
# happy_factors, sad_factors = analyzer.identify_factors(processed_data, context_notes) 
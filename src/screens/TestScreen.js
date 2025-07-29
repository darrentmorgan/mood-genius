import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, CustomButton } from '../components/ui';

const TestScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (moodData) => {
    setSelectedMood(moodData);
  };

  const handleButtonPress = () => {
    console.log('Modern UI button pressed!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8fafc' }}>
      <Card variant="elevated" style={{ padding: 24, marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          🎉 Modern UI Restored!
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 15 }}>
          NativeBase + Custom Components working!
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 }}>
          Step 2/4: Custom Buttons ✅
        </Text>
        
        <CustomButton
          title="Primary Button with Gradient"
          variant="primary"
          gradient={true}
          onPress={handleButtonPress}
          style={{ marginBottom: 12 }}
        />
        
        <CustomButton
          title="Secondary Button"
          variant="secondary"
          onPress={handleButtonPress}
          style={{ marginBottom: 8 }}
        />
      </Card>
      
      <Card variant="flat" style={{ padding: 16 }}>
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#888' }}>
          Next: Adding MoodButton with Haptic Feedback
        </Text>
      </Card>
    </View>
  );
};

export default TestScreen;
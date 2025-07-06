import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDailyQuest } from '../services/GeminiService';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const [quest, setQuest] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuest = async () => {
      const dailyQuest = await getDailyQuest();
      setQuest(dailyQuest);
      setIsLoading(false);
    };

    fetchQuest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tuklascope</Text>
      <View style={styles.questCard}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <>
            <Ionicons name="compass-outline" size={48} color="#007AFF" />
            <Text style={styles.questText}>{quest}</Text>
          </>
        )}
      </View>
      <Text style={styles.subHeader}>Welcome, Explorer!</Text>
      <Text style={styles.bodyText}>Tap the central scan button to begin your next discovery.</Text>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f4f8' },
  header: { fontFamily: 'Poppins-Bold', fontSize: 42, color: '#002B6B', marginBottom: 40 },
  questCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  questText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  subHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginTop: 40,
  },
  bodyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 10,
  }
});
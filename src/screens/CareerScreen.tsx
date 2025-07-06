import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import careerData from '../data/careers.json';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Discovery } from '../types';
import { getCareerInsight } from '../services/GeminiService';
import { Ionicons } from '@expo/vector-icons';

type Career = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

const CAREER_FILTERS = ['All', 'STEM', 'Technology', 'Innovation', 'Design'];

const CareerItem = ({ item }: { item: Career }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{item.name}</Text>
    <Text style={styles.itemDescription}>{item.description}</Text>
  </View>
);

export const CareerScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem('@discoveries');
      const discoveries: Discovery[] = jsonValue ? JSON.parse(jsonValue) : [];
      const discoveryNames = discoveries.map(d => d.objectName).slice(0, 5); // Use last 5 discoveries
      const generatedInsight = await getCareerInsight(discoveryNames);
      setInsight(generatedInsight);
      setIsLoading(false);
    };

    if (isFocused) {
      fetchInsight();
    }
  }, [isFocused]);

  const filteredCareers = useMemo(() => {
    if (activeFilter === 'All') return careerData;
    return careerData.filter(career => career.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tuklas-Connect</Text>
      
      <View style={styles.insightCard}>
        {isLoading ? <ActivityIndicator color="#007AFF" /> : (
            <>
                <Ionicons name="sparkles-outline" size={24} color="#007AFF" style={{ position: 'absolute', top: 15, left: 15 }} />
                <Text style={styles.insightText}>{insight}</Text>
            </>
        )}
      </View>

      <Text style={styles.subHeader}>Explore Career Paths</Text>

      <View style={{ marginBottom: 20 }}>
        <FlatList
          data={CAREER_FILTERS}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filterPill, activeFilter === item && styles.activeFilterPill]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={filteredCareers}
        renderItem={({ item }) => <CareerItem item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  header: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#002B6B' },
  subHeader: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#002B6B', marginTop: 20, marginBottom: 15 },
  insightCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 15,
    padding: 20,
    paddingHorizontal: 25,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  insightText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#002B6B',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  filterPill: { backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, elevation: 2, borderColor: '#ddd', borderWidth: 1 },
  activeFilterPill: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText: { fontFamily: 'Poppins-Bold', fontSize: 14, color: '#007AFF' },
  activeFilterText: { color: 'white' },
  itemContainer: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 15, elevation: 3 },
  itemTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#004AAD' },
  itemDescription: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#333', marginTop: 5 },
});
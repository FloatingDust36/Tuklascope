import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type UserLevel = 'Batang Kuryoso' | 'High School Explorer' | 'College Innovator';

export const ProfileScreen = () => {
  const [level, setLevel] = useState<UserLevel>('Batang Kuryoso');
  const [totalDiscoveries, setTotalDiscoveries] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadProfileData = async () => {
      const savedLevel = await AsyncStorage.getItem('@userLevel') as UserLevel | null;
      if (savedLevel) setLevel(savedLevel);
      
      const discoveries = await AsyncStorage.getItem('@discoveries');
      setTotalDiscoveries(discoveries ? JSON.parse(discoveries).length : 0);
    };

    if (isFocused) {
      loadProfileData();
    }
  }, [isFocused]);

  const selectLevel = async (newLevel: UserLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLevel(newLevel);
    await AsyncStorage.setItem('@userLevel', newLevel);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.statCard}>
        <Ionicons name="albums-outline" size={32} color="#007AFF" />
        <Text style={styles.statNumber}>{totalDiscoveries}</Text>
        <Text style={styles.statLabel}>Discoveries Made</Text>
      </View>

      <Text style={styles.subHeader}>Select Your Level</Text>
      <TouchableOpacity style={[styles.button, level === 'Batang Kuryoso' && styles.selectedButton]} onPress={() => selectLevel('Batang Kuryoso')}>
        <Text style={styles.buttonText}>Batang Kuryoso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, level === 'High School Explorer' && styles.selectedButton]} onPress={() => selectLevel('High School Explorer')}>
        <Text style={styles.buttonText}>High School Explorer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, level === 'College Innovator' && styles.selectedButton]} onPress={() => selectLevel('College Innovator')}>
        <Text style={styles.buttonText}>College Innovator</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 60, paddingHorizontal: 20 }, 
  header: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#002B6B', marginBottom: 20, textAlign: 'center' },
  statCard: { width: '100%', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3, marginBottom: 30 },
  statNumber: { fontFamily: 'Poppins-Bold', fontSize: 48, color: '#004AAD' },
  statLabel: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#6c757d' },
  subHeader: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#002B6B', marginBottom: 10, alignSelf: 'flex-start'},
  button: { width: '100%', padding: 15, backgroundColor: 'white', borderRadius: 15, marginVertical: 8, borderWidth: 3, borderColor: 'white', elevation: 2 },
  selectedButton: { borderColor: '#007AFF' },
  buttonText: { fontFamily: 'Poppins-Bold', fontSize: 16, textAlign: 'center', color: '#333' }
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const JournalItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{item.objectName}</Text>
    <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
    <Text style={styles.itemFact}>{item.learningData.biology.text}</Text>
  </View>
);

export default function JournalScreen() {
  const [discoveries, setDiscoveries] = useState([]);
  const isFocused = useIsFocused(); // Hook to reload data when screen is visited

  const loadDiscoveries = async () => {
    const jsonValue = await AsyncStorage.getItem('@discoveries');
    setDiscoveries(jsonValue != null ? JSON.parse(jsonValue) : []);
  };

  useEffect(() => {
    if (isFocused) {
      loadDiscoveries();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Field Journal</Text>
      <FlatList
        data={discoveries}
        renderItem={({ item }) => <JournalItem item={item} />}
        keyExtractor={item => item.date.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No discoveries yet. Start scanning!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 60, paddingHorizontal: 20 },
    header: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#002B6B', marginBottom: 20 },
    itemContainer: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
    itemTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#004AAD', textTransform: 'capitalize' },
    itemDate: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#6c757d', marginBottom: 10 },
    itemFact: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#333' },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular', fontSize: 16 }
});
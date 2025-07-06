import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Discovery } from '../types';
import { Ionicons } from '@expo/vector-icons';

type JournalItemProps = {
  item: Discovery;
  onDelete: (date: string) => void;
};

const JournalItem = ({ item, onDelete }: JournalItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => setIsExpanded(!isExpanded)}>
      <View style={styles.headerRow}>
        <Text style={styles.itemTitle}>{item.objectName}</Text>
        <TouchableOpacity onPress={() => onDelete(item.date)}>
          <Ionicons name="trash-outline" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          {item.learningData?.stem && <Text style={styles.detailText}>• {item.learningData.stem.text}</Text>}
          {item.learningData?.tech && <Text style={styles.detailText}>• {item.learningData.tech.text}</Text>}
          {item.learningData?.local && <Text style={styles.detailText}>• {item.learningData.local.text}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const JournalScreen = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const isFocused = useIsFocused(); 

  const loadDiscoveries = async () => {
    const jsonValue = await AsyncStorage.getItem('@discoveries');
    setDiscoveries(jsonValue != null ? JSON.parse(jsonValue) : []);
  };

  const handleDelete = async (dateToDelete: string) => {
    const newDiscoveries = discoveries.filter(d => d.date !== dateToDelete);
    setDiscoveries(newDiscoveries);
    await AsyncStorage.setItem('@discoveries', JSON.stringify(newDiscoveries));
  };

  const confirmDelete = (dateToDelete: string) => {
    Alert.alert("Delete Discovery", "Are you sure you want to delete this journal entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDelete(dateToDelete) }
    ]);
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
        renderItem={({ item }) => <JournalItem item={item} onDelete={confirmDelete} />}
        keyExtractor={item => item.date}
        ListEmptyComponent={<Text style={styles.emptyText}>No discoveries yet!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 },
    header: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#002B6B', marginBottom: 20 },
    itemContainer: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 15, elevation: 3 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#004AAD', textTransform: 'capitalize' },
    itemDate: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#6c757d', marginBottom: 10 },
    detailsContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    detailText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#333', marginBottom: 5 },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular', fontSize: 16 }
});
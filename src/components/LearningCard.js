import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function LearningCard({ objectName, data, onClose }) {
  if (!data) return null;
  const { biology, physics, tech } = data;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{objectName}</Text>
        <ScrollView>
          {biology && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{biology.title}</Text>
              <Text style={styles.sectionText}>{biology.text}</Text>
            </View>
          )}
          {physics && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{physics.title}</Text>
              <Text style={styles.sectionText}>{physics.text}</Text>
            </View>
          )}
          {tech && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{tech.title}</Text>
              <Text style={styles.sectionText}>{tech.text}</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  card: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textTransform: 'capitalize' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  sectionText: { fontSize: 16, color: '#555', marginTop: 5 },
  closeButton: { backgroundColor: '#007AFF', borderRadius: 20, padding: 10, elevation: 2, marginTop: 15 },
  closeButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }
});